/* A small dependency-free WebGL globe with a 2D overlay for routes.
   Coordinates: x = cos(lat) sin(lon), y = sin(lat), z = cos(lat) cos(lon). */
(function () {
  "use strict";
  var D2R = Math.PI / 180;
  var FOV = 30 * D2R;

  function ll2v(lat, lon, r) {
    r = r === undefined ? 1 : r;
    var p = lat * D2R, l = lon * D2R, c = Math.cos(p);
    return [r * c * Math.sin(l), r * Math.sin(p), r * c * Math.cos(l)];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
  function cross(a, b) {
    return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
  }
  function norm(a) {
    var l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  }
  function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
  function ease(t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
  function wrap(lon) { return ((lon + 540) % 360) - 180; }
  function hexRgb(h) {
    var n = parseInt(h.slice(1), 16);
    return [(n >> 16) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
  }

  function shader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
    return s;
  }
  function program(gl, vs, fs, attribs) {
    var p = gl.createProgram();
    gl.attachShader(p, shader(gl, gl.VERTEX_SHADER, vs));
    gl.attachShader(p, shader(gl, gl.FRAGMENT_SHADER, fs));
    attribs.forEach(function (a, i) { gl.bindAttribLocation(p, i, a); });
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(p));
    var u = {};
    var n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS);
    for (var i = 0; i < n; i++) {
      var name = gl.getActiveUniform(p, i).name;
      u[name] = gl.getUniformLocation(p, name);
    }
    return { p: p, u: u };
  }

  var VS_SPHERE = [
    "attribute vec3 pos; attribute vec2 uv; uniform mat4 vp; uniform vec2 off;",
    "varying vec2 vUv; varying vec3 vN;",
    "void main(){ vUv=uv; vN=pos; gl_Position=vp*vec4(pos,1.); gl_Position.xy+=off*gl_Position.w; }"
  ].join("\n");
  var FS_SPHERE = [
    "precision highp float; uniform sampler2D tex; uniform vec3 eye; uniform vec3 limb;",
    "varying vec2 vUv; varying vec3 vN;",
    "void main(){",
    " vec3 n=normalize(vN); vec3 v=normalize(eye-n);",
    " vec3 c=texture2D(tex,vUv).rgb;",
    " vec3 l=normalize(eye+vec3(-.7,1.1,.4)*length(eye));",
    " float d=clamp(dot(n,l),0.,1.);",
    " c*=.80+.24*d;",
    " float f=pow(1.-clamp(dot(n,v),0.,1.),3.);",
    " c=mix(c,limb,f*.55);",
    " gl_FragColor=vec4(c,1.);",
    "}"
  ].join("\n");
  var VS_LINE = [
    "attribute vec3 pos; uniform mat4 vp; uniform vec2 off; uniform vec3 eye; varying float face;",
    "void main(){ face=dot(normalize(pos),eye-pos); gl_Position=vp*vec4(pos,1.); gl_Position.xy+=off*gl_Position.w; }"
  ].join("\n");
  var FS_LINE = [
    "precision highp float; uniform vec4 col; varying float face;",
    "void main(){ if(face<0.)discard; gl_FragColor=vec4(col.rgb*col.a,col.a); }"
  ].join("\n");
  var VS_QUAD = "attribute vec2 p; void main(){ gl_Position=vec4(p,0.,1.); }";
  var FS_HALO = [
    "precision highp float; uniform vec2 c; uniform float R; uniform vec3 col;",
    "void main(){ float r=length(gl_FragCoord.xy-c)/R; float a=0.;",
    " if(r>.98){ a=pow(clamp(1.-(r-.98)/.2,0.,1.),2.2)*.5; }",
    " gl_FragColor=vec4(col*a,a); }"
  ].join("\n");

  function Globe(glCanvas, overlay, opts) {
    this.c = glCanvas;
    this.o = overlay;
    this.ctx = overlay.getContext("2d");
    this.opts = opts || {};
    this.lat = 20; this.lon = 112; this.zoom = 1;
    this.insets = { left: 0, right: 0, top: 0, bottom: 0 };
    this.arcs = [];
    this.arcStart = 0;
    this.anim = null;
    this.frameCb = null;
    this.reduced = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
    this.vel = null;
    this._dirty = true;
    this._raf = 0;
    this._loop = this._loop.bind(this);
    var gl = glCanvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: true }) ||
             glCanvas.getContext("experimental-webgl");
    if (!gl) throw new Error("WebGL unavailable");
    this.gl = gl;
    this.pSphere = program(gl, VS_SPHERE, FS_SPHERE, ["pos", "uv"]);
    this.pLine = program(gl, VS_LINE, FS_LINE, ["pos"]);
    this.pHalo = program(gl, VS_QUAD, FS_HALO, ["p"]);
    this._buildSphere();
    this._quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    this.tex = gl.createTexture();
    var maxT = gl.getParameter(gl.MAX_TEXTURE_SIZE);
    this.texW = Math.min(maxT, window.innerWidth < 800 ? 4096 : 8192);
    this.aniso = gl.getExtension("EXT_texture_filter_anisotropic");
    this.lineBuf = null; this.lineCount = 0;
    this.limb = hexRgb((this.opts.colors && this.opts.colors.limb) || "#DDEFF2");
    this.haloCol = hexRgb((this.opts.colors && this.opts.colors.halo) || "#9CD3DC");
    this._bind();
    this.resize();
    this.requestRender();
  }

  Globe.prototype._buildSphere = function () {
    var gl = this.gl, SEG = 180, RINGS = 90, pos = [], idx = [];
    for (var j = 0; j <= RINGS; j++) {
      var lat = 90 - (180 * j) / RINGS;
      for (var i = 0; i <= SEG; i++) {
        var lon = -180 + (360 * i) / SEG, v = ll2v(lat, lon);
        pos.push(v[0], v[1], v[2], i / SEG, j / RINGS);
      }
    }
    for (j = 0; j < RINGS; j++) {
      for (i = 0; i < SEG; i++) {
        var a = j * (SEG + 1) + i, b = a + SEG + 1;
        idx.push(a, a + 1, b, a + 1, b + 1, b);
      }
    }
    this.sVbo = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sVbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pos), gl.STATIC_DRAW);
    this.sIbo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sIbo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    this.sCount = idx.length;
  };

  /* Paint a nautical-chart style texture and build crisp coastline lines. */
  Globe.prototype.setLand = function (geo) {
    var W = this.texW, H = W / 2, cv = document.createElement("canvas");
    cv.width = W; cv.height = H;
    var g = cv.getContext("2d"), col = this.opts.colors || {};
    var proj = d3geo.geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2]).precision(0);
    var path = d3geo.geoPath(proj, g);
    var k = W / 8192;
    g.fillStyle = col.sea || "#C9E0E4";
    g.fillRect(0, 0, W, H);
    g.lineJoin = "round";
    /* graticule */
    g.beginPath(); path(d3geo.geoGraticule10());
    g.strokeStyle = col.grid || "rgba(40,90,110,.22)"; g.lineWidth = 1.4 * k; g.stroke();
    /* shallow-water bands, as on a sounding chart */
    g.beginPath(); path(geo);
    g.strokeStyle = col.shoal2 || "#BCD9DF"; g.lineWidth = 26 * k; g.stroke();
    g.strokeStyle = col.shoal1 || "#A9CFD8"; g.lineWidth = 11 * k; g.stroke();
    g.fillStyle = col.land || "#EEDDAA"; g.fill();
    g.strokeStyle = col.coast || "#6E6A4C"; g.lineWidth = 1 * k; g.stroke();

    var gl = this.gl;
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, cv);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    if (this.aniso) {
      gl.texParameterf(gl.TEXTURE_2D, this.aniso.TEXTURE_MAX_ANISOTROPY_EXT,
        Math.min(8, gl.getParameter(this.aniso.MAX_TEXTURE_MAX_ANISOTROPY_EXT)));
    }
    var polys = geo.type === "MultiPolygon" ? geo.coordinates : [geo.coordinates], n = 0, pi, ri, i;
    for (pi = 0; pi < polys.length; pi++) for (ri = 0; ri < polys[pi].length; ri++) n += polys[pi][ri].length;
    var a = new Float32Array(n * 6), m = 0, R = 1.0006;
    for (pi = 0; pi < polys.length; pi++) {
      for (ri = 0; ri < polys[pi].length; ri++) {
        var ring = polys[pi][ri];
        for (i = 1; i < ring.length; i++) {
          if (Math.abs(ring[i][0] - ring[i - 1][0]) > 180) continue;
          var p = ll2v(ring[i - 1][1], ring[i - 1][0], R), q = ll2v(ring[i][1], ring[i][0], R);
          a[m++] = p[0]; a[m++] = p[1]; a[m++] = p[2]; a[m++] = q[0]; a[m++] = q[1]; a[m++] = q[2];
        }
      }
    }
    if (!this.lineBuf) this.lineBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
    gl.bufferData(gl.ARRAY_BUFFER, a.subarray(0, m), gl.STATIC_DRAW);
    this.lineCount = m / 3;
    this.hasLand = true;
    this.requestRender();
  };

  Globe.prototype.setInsets = function (ins) { this.insets = ins; this.resize(); };

  Globe.prototype.resize = function () {
    var r = this.c.parentElement.getBoundingClientRect();
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    [this.c, this.o].forEach(function (cv) {
      cv.width = Math.round(this.w * this.dpr);
      cv.height = Math.round(this.h * this.dpr);
    }, this);
    var ins = this.insets;
    this.availW = Math.max(120, this.w - ins.left - ins.right);
    this.availH = Math.max(120, this.h - ins.top - ins.bottom);
    this.cx = ins.left + this.availW / 2;
    this.cy = ins.top + this.availH / 2;
    this.baseR = Math.min(this.availW, this.availH) / 2 * 0.94;
    this.requestRender();
  };

  Globe.prototype._camera = function () {
    var rPx = this.baseR * this.zoom;
    var t = (rPx * 2 / this.h) * Math.tan(FOV / 2);
    var d = Math.max(1.012, Math.sqrt(1 + t * t) / t);
    var eyeDir = ll2v(this.lat, this.lon);
    var eye = [eyeDir[0] * d, eyeDir[1] * d, eyeDir[2] * d];
    var f = norm([-eye[0], -eye[1], -eye[2]]);
    var s = norm(cross(f, [0, 1, 0]));
    var u = cross(s, f);
    var near = Math.max(0.001, (d - 1) * 0.4), far = d + 2;
    var ff = 1 / Math.tan(FOV / 2), asp = this.w / this.h;
    var nf = 1 / (near - far);
    var V = [s[0], u[0], -f[0], 0, s[1], u[1], -f[1], 0, s[2], u[2], -f[2], 0,
      -dot(s, eye), -dot(u, eye), dot(f, eye), 1];
    var P = [ff / asp, 0, 0, 0, 0, ff, 0, 0, 0, 0, (far + near) * nf, -1, 0, 0, 2 * far * near * nf, 0];
    var M = new Float32Array(16);
    for (var c = 0; c < 4; c++) for (var r = 0; r < 4; r++) {
      var x = 0;
      for (var k = 0; k < 4; k++) x += P[k * 4 + r] * V[c * 4 + k];
      M[c * 4 + r] = x;
    }
    this.cam = {
      eye: eye, s: s, u: u, f: f, ff: ff, asp: asp, M: M, rPx: rPx,
      ox: (this.cx - this.w / 2) / (this.w / 2), oy: -(this.cy - this.h / 2) / (this.h / 2), d: d
    };
    return this.cam;
  };

  /* Returns screen position in CSS pixels and whether the point can be seen. */
  Globe.prototype.projectV = function (p) {
    var c = this.cam;
    var rel = [p[0] - c.eye[0], p[1] - c.eye[1], p[2] - c.eye[2]];
    var zv = dot(rel, c.f);
    if (zv <= 0.0005) return { x: 0, y: 0, visible: false };
    var xn = (dot(rel, c.s) / zv) * (c.ff / c.asp) + c.ox;
    var yn = (dot(rel, c.u) / zv) * c.ff + c.oy;
    var A = dot(rel, rel), B = 2 * dot(c.eye, rel), C = dot(c.eye, c.eye) - 1, disc = B * B - 4 * A * C;
    var vis = true;
    if (disc > 0) {
      var t = (-B - Math.sqrt(disc)) / (2 * A);
      if (t > 0 && t < 0.9985) vis = false;
    }
    return { x: (xn + 1) / 2 * this.w, y: (1 - yn) / 2 * this.h, visible: vis };
  };
  Globe.prototype.project = function (lat, lon) {
    if (!this.cam) this._camera();
    return this.projectV(ll2v(lat, lon));
  };

  Globe.prototype.flyTo = function (lat, lon, zoom, ms) {
    this.vel = null;
    if (this.reduced || ms === 0) {
      this.lat = lat; this.lon = lon; this.zoom = zoom; this.anim = null; this.requestRender();
      return;
    }
    var dl = wrap(lon - this.lon);
    var dist = Math.acos(clamp(dot(ll2v(this.lat, this.lon), ll2v(lat, lon)), -1, 1));
    this.anim = {
      t0: performance.now(), ms: ms || clamp(900 + dist * 900, 1000, 2600),
      lat0: this.lat, lon0: this.lon, z0: Math.log(this.zoom),
      lat1: lat, dlon: dl, z1: Math.log(zoom),
      dip: clamp(dist * 0.9, 0, 1.2) * (Math.min(this.zoom, zoom) > 1.4 ? 1 : 0.3)
    };
    this.requestRender();
  };

  Globe.prototype.zoomBy = function (f) {
    this.anim = null;
    this.zoom = clamp(this.zoom * f, 0.7, 26);
    this.requestRender();
  };

  /* Each arc: from, to, color, width, bend, alt, dash, delay, dur, label, done */
  Globe.prototype.setArcs = function (list) {
    this.arcs = list.map(function (a) {
      var A = ll2v(a.from[0], a.from[1]), B = ll2v(a.to[0], a.to[1]);
      var ang = Math.acos(clamp(dot(A, B), -1, 1)) || 1e-6;
      var n = norm(cross(A, B)), pts = [], N = a.segments || 96;
      var alt = a.alt === undefined ? 0.1 * ang : a.alt, bend = (a.bend || 0) * ang;
      for (var i = 0; i <= N; i++) {
        var t = i / N, s0 = Math.sin((1 - t) * ang) / Math.sin(ang), s1 = Math.sin(t * ang) / Math.sin(ang);
        var v = [A[0] * s0 + B[0] * s1, A[1] * s0 + B[1] * s1, A[2] * s0 + B[2] * s1];
        var h = Math.sin(Math.PI * t);
        v = norm([v[0] + n[0] * bend * h, v[1] + n[1] * bend * h, v[2] + n[2] * bend * h]);
        var r = 1.002 + alt * h;
        pts.push([v[0] * r, v[1] * r, v[2] * r]);
      }
      return Object.assign({ pts: pts }, a);
    });
    this.arcStart = performance.now();
    this.requestRender();
  };

  Globe.prototype._drawArcs = function (now) {
    var ctx = this.ctx, busy = false, self = this;
    this.arcs.forEach(function (a) {
      var p = 1;
      if (!a.done && !self.reduced) {
        p = clamp((now - self.arcStart - (a.delay || 0)) / (a.dur || 1800), 0, 1);
        if (p < 1) busy = true;
        p = ease(p);
      }
      if (p <= 0) return;
      var last = Math.round(p * (a.pts.length - 1)), segs = [], cur = null, i;
      for (i = 0; i <= last; i++) {
        var s = self.projectV(a.pts[i]);
        if (s.visible) { if (!cur) { cur = []; segs.push(cur); } cur.push(s); } else cur = null;
      }
      var w = a.width || 2.4;
      function stroke(style, lw, dash) {
        ctx.setLineDash(dash || []);
        ctx.strokeStyle = style; ctx.lineWidth = lw;
        segs.forEach(function (sg) {
          if (sg.length < 2) return;
          ctx.beginPath(); ctx.moveTo(sg[0].x, sg[0].y);
          for (var j = 1; j < sg.length; j++) ctx.lineTo(sg[j].x, sg[j].y);
          ctx.stroke();
        });
      }
      ctx.lineCap = "round"; ctx.lineJoin = "round";
      stroke("rgba(255,255,255,.72)", w + 2.2);
      stroke(a.color, w, a.dash ? [w * 2.4, w * 2.2] : null);
      ctx.setLineDash([]);
      var head = self.projectV(a.pts[last]);
      if (head.visible && last > 1) {
        var prev = self.projectV(a.pts[Math.max(0, last - 3)]);
        var ang = Math.atan2(head.y - prev.y, head.x - prev.x), L = 7 + w * 1.4;
        ctx.fillStyle = a.color;
        ctx.strokeStyle = "rgba(255,255,255,.85)"; ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(head.x + Math.cos(ang) * L * 0.55, head.y + Math.sin(ang) * L * 0.55);
        ctx.lineTo(head.x + Math.cos(ang + 2.5) * L * 0.75, head.y + Math.sin(ang + 2.5) * L * 0.75);
        ctx.lineTo(head.x + Math.cos(ang - 2.5) * L * 0.75, head.y + Math.sin(ang - 2.5) * L * 0.75);
        ctx.closePath(); ctx.stroke(); ctx.fill();
      }
      if (a.label && p > 0.72) {
        var mid = self.projectV(a.pts[Math.round((a.labelAt === undefined ? 0.55 : a.labelAt) * (a.pts.length - 1))]);
        if (mid.visible) {
          ctx.font = "600 13px " + (self.opts.font || "sans-serif");
          ctx.textAlign = a.labelAlign || "left"; ctx.textBaseline = "middle";
          var dx = a.labelDx === undefined ? 9 : a.labelDx, dy = a.labelDy || 0;
          ctx.lineWidth = 3.5; ctx.strokeStyle = "rgba(255,255,255,.9)";
          ctx.strokeText(a.label, mid.x + dx, mid.y + dy);
          ctx.fillStyle = a.color;
          ctx.fillText(a.label, mid.x + dx, mid.y + dy);
        }
      }
    });
    return busy;
  };

  Globe.prototype.requestRender = function () {
    this._dirty = true;
    if (!this._raf) this._raf = requestAnimationFrame(this._loop);
  };

  Globe.prototype._loop = function (now) {
    this._raf = 0;
    var keep = false;
    if (this.anim) {
      var a = this.anim, t = clamp((now - a.t0) / a.ms, 0, 1), e = ease(t);
      this.lat = a.lat0 + (a.lat1 - a.lat0) * e;
      this.lon = wrap(a.lon0 + a.dlon * e);
      this.zoom = Math.exp(a.z0 + (a.z1 - a.z0) * e - a.dip * Math.sin(Math.PI * t));
      if (t >= 1) this.anim = null;
      keep = true;
    }
    if (this.vel) {
      this.lon = wrap(this.lon + this.vel[0]); this.lat = clamp(this.lat + this.vel[1], -82, 82);
      this.vel[0] *= 0.92; this.vel[1] *= 0.92;
      if (Math.abs(this.vel[0]) + Math.abs(this.vel[1]) < 0.002) this.vel = null;
      keep = true;
    }
    this._camera();
    this._draw();
    var ctx = this.ctx;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, this.w, this.h);
    if (this._drawArcs(now)) keep = true;
    if (this.frameCb) this.frameCb();
    this._dirty = false;
    if (keep) this._raf = requestAnimationFrame(this._loop);
  };

  Globe.prototype._draw = function () {
    var gl = this.gl, c = this.cam;
    gl.viewport(0, 0, this.c.width, this.c.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    /* atmosphere */
    gl.useProgram(this.pHalo.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this._quad);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disableVertexAttribArray(1);
    gl.uniform2f(this.pHalo.u.c, this.cx * this.dpr, (this.h - this.cy) * this.dpr);
    var silh = (this.h / 2) * c.ff * Math.tan(Math.asin(Math.min(0.9999, 1 / c.d)));
    gl.uniform1f(this.pHalo.u.R, silh * this.dpr);
    gl.uniform3fv(this.pHalo.u.col, this.haloCol);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    /* sphere */
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.frontFace(gl.CW);
    gl.disable(gl.BLEND);
    gl.useProgram(this.pSphere.p);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.sVbo);
    gl.enableVertexAttribArray(0); gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 20, 12);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sIbo);
    gl.uniformMatrix4fv(this.pSphere.u.vp, false, c.M);
    gl.uniform2f(this.pSphere.u.off, c.ox, c.oy);
    gl.uniform3fv(this.pSphere.u.eye, c.eye);
    gl.uniform3fv(this.pSphere.u.limb, this.limb);
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.tex);
    gl.uniform1i(this.pSphere.u.tex, 0);
    if (this.hasLand) gl.drawElements(gl.TRIANGLES, this.sCount, gl.UNSIGNED_SHORT, 0);
    gl.disable(gl.CULL_FACE);
    gl.disableVertexAttribArray(1);
    /* coastline: stays crisp when the texture runs out of resolution */
    if (this.lineBuf && this.zoom > 1.6) {
      gl.enable(gl.BLEND);
      gl.useProgram(this.pLine.p);
      gl.bindBuffer(gl.ARRAY_BUFFER, this.lineBuf);
      gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0);
      gl.uniformMatrix4fv(this.pLine.u.vp, false, c.M);
      gl.uniform2f(this.pLine.u.off, c.ox, c.oy);
      gl.uniform3fv(this.pLine.u.eye, c.eye);
      gl.uniform4f(this.pLine.u.col, 0.36, 0.34, 0.24, clamp((this.zoom - 1.6) / 2, 0, 0.8));
      gl.drawArrays(gl.LINES, 0, this.lineCount);
    }
  };

  Globe.prototype._bind = function () {
    var self = this, el = this.o, ptrs = new Map(), pinch = 0, lastT = 0, moved = 0;
    el.style.touchAction = "none";
    el.addEventListener("pointerdown", function (e) {
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      el.setPointerCapture(e.pointerId);
      self.anim = null; self.vel = null; moved = 0;
      el.classList.add("grabbing");
      if (self.onInteract) self.onInteract();
    });
    el.addEventListener("pointermove", function (e) {
      if (!ptrs.has(e.pointerId)) return;
      var prev = ptrs.get(e.pointerId), dx = e.clientX - prev[0], dy = e.clientY - prev[1];
      ptrs.set(e.pointerId, [e.clientX, e.clientY]);
      if (ptrs.size === 1) {
        var k = (1 / (self.baseR * self.zoom)) / D2R;
        var cl = Math.max(0.2, Math.cos(self.lat * D2R));
        var vx = (-dx * k) / cl, vy = dy * k;
        self.lon = wrap(self.lon + vx); self.lat = clamp(self.lat + vy, -82, 82);
        self.vel = [vx, vy]; moved += Math.abs(dx) + Math.abs(dy); lastT = performance.now();
        self.requestRender();
      } else if (ptrs.size === 2) {
        var v = Array.from(ptrs.values()), dist = Math.hypot(v[0][0] - v[1][0], v[0][1] - v[1][1]);
        if (pinch) self.zoomBy(dist / pinch);
        pinch = dist;
      }
    });
    function up(e) {
      ptrs.delete(e.pointerId);
      if (ptrs.size < 2) pinch = 0;
      if (!ptrs.size) {
        el.classList.remove("grabbing");
        if (performance.now() - lastT > 80) self.vel = null;
        self.requestRender();
      }
    }
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("wheel", function (e) {
      e.preventDefault();
      self.zoomBy(Math.exp(-e.deltaY * 0.0016));
      if (self.onInteract) self.onInteract();
    }, { passive: false });
    window.addEventListener("resize", function () { self.resize(); });
  };

  window.Globe = Globe;
})();
