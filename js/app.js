(function () {
  "use strict";
  var S = window.STORY, CH = S.CHAPTERS;
  var srcOrder = Object.keys(S.SOURCES);
  var $ = function (id) { return document.getElementById(id); };
  function esc(s) { return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

  function cites(html) {
    return String(html).replace(/\{\{(\w+)\}\}/g, function (_, k) { return citeTag(k); });
  }
  function citeTag(k) {
    var i = srcOrder.indexOf(k);
    if (i < 0) throw new Error("Unknown source: " + k);
    return '<sup class="c"><button type="button" data-src="' + k + '" aria-label="Source ' + (i + 1) + '">' + (i + 1) + "</button></sup>";
  }

  /* ---------- Globe ---------- */
  var FONT = getComputedStyle(document.body).getPropertyValue("--sans") || "sans-serif";
  var globe = null, webgl = true;
  try {
    globe = new window.Globe($("gl"), $("overlay"), {
      font: FONT,
      colors: {
        sea: "#C6DEE3", shoal1: "#A8CFD7", shoal2: "#B9D8DE", land: "#EEDDAA", coast: "#8C8660",
        grid: "rgba(35,85,105,.24)", limb: "#E2F2F4", halo: "#94CBD6"
      }
    });
  } catch (e) {
    webgl = false;
    var n = $("mapnote");
    n.hidden = false;
    n.textContent = "This browser could not start the 3D globe. Turn on WebGL or try another browser. The story and data still work.";
  }

  function insets() {
    if (!globe) return;
    var mobile = window.innerWidth <= 760;
    var stage = $("stage").getBoundingClientRect(), panel = $("panel").getBoundingClientRect();
    var rail = $("rail").getBoundingClientRect().height;
    globe.setInsets(mobile
      ? { left: 0, right: 0, top: 4, bottom: stage.bottom - panel.top + 4 }
      : { left: panel.width + 8, right: 8, top: 8, bottom: rail + 8 });
  }

  /* ---------- Coastlines ---------- */
  function rewind(geo) {
    return {
      type: "MultiPolygon",
      coordinates: geo.coordinates.map(function (poly) {
        var a = d3geo.geoArea({ type: "Polygon", coordinates: [poly[0]] });
        if (a <= 2 * Math.PI) return poly;
        return poly.map(function (ring) { return ring.slice().reverse(); });
      })
    };
  }
  function decodeTopo(topo) {
    var tf = topo.transform;
    var arcs = topo.arcs.map(function (arc) {
      var x = 0, y = 0;
      return arc.map(function (p) {
        if (tf) {
          x += p[0]; y += p[1];
          return [x * tf.scale[0] + tf.translate[0], y * tf.scale[1] + tf.translate[1]];
        }
        return p;
      });
    });
    function ring(ids) {
      var out = [];
      ids.forEach(function (id) {
        var a = id < 0 ? arcs[~id].slice().reverse() : arcs[id];
        for (var i = out.length ? 1 : 0; i < a.length; i++) out.push(a[i]);
      });
      return out;
    }
    var coords = [];
    function add(g) {
      if (g.type === "GeometryCollection") g.geometries.forEach(add);
      else if (g.type === "Polygon") coords.push(g.arcs.map(ring));
      else if (g.type === "MultiPolygon") g.arcs.forEach(function (p) { coords.push(p.map(ring)); });
    }
    add(topo.objects.land);
    if (!coords.length) throw new Error("No land in map data");
    return { type: "MultiPolygon", coordinates: coords };
  }
  function loadOne(url) {
    return fetch(url).then(function (r) {
      if (!r.ok) throw new Error("HTTP " + r.status);
      return r.json();
    }).then(decodeTopo);
  }
  function loadLand() {
    if (!globe) return;
    globe.setLand(rewind(window.FALLBACK_LAND));
    var note = $("mapnote");
    var CDN = "https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/";
    var fine = window.innerWidth > 760 ? "land-10m.json" : "land-50m.json";
    function useFine() {
      setTimeout(function () {
        loadOne("data/" + fine).catch(function () { return loadOne(CDN + fine); })
          .then(function (g) { globe.setLand(rewind(g)); })
          .catch(function () { /* the coarser map stays */ });
      }, 400);
    }
    loadOne("data/land-50m.json").catch(function () { return loadOne(CDN + "land-50m.json"); })
      .then(function (g) { globe.setLand(rewind(g)); note.hidden = true; if (fine !== "land-50m.json") useFine(); })
      .catch(function () {
        note.hidden = false;
        note.textContent = "Showing a rough outline because the detailed coastline could not load. Check your connection and refresh.";
      });
  }

  /* ---------- Pins ---------- */
  var pinEls = {};
  Object.keys(S.PLACES).forEach(function (k) {
    var p = S.PLACES[k], b = document.createElement("button");
    b.type = "button";
    b.className = "pin " + (p.side === "left" ? "left" : "");
    b.innerHTML = "<span>" + esc(p.name.split(",")[0].split(" and ")[0]) + "</span>";
    b.setAttribute("aria-label", "Open details for " + p.name);
    b.style.visibility = "hidden";
    b.addEventListener("click", function () { openPlace(k); });
    $("pins").appendChild(b);
    pinEls[k] = b;
  });
  var activePins = [];
  function placePins() {
    if (!globe) return;
    Object.keys(pinEls).forEach(function (k) {
      var el = pinEls[k];
      if (activePins.indexOf(k) < 0) { el.style.visibility = "hidden"; return; }
      var ll = S.PLACES[k].ll, s = globe.project(ll[0], ll[1]);
      var inPanel = globe.insets.left > 0 && s.x < globe.insets.left - 4;
      if (!s.visible || inPanel) { el.style.visibility = "hidden"; return; }
      el.style.visibility = "visible";
      var left = S.PLACES[k].side === "left";
      el.style.transform = "translate(" + Math.round(s.x - (left ? el.offsetWidth - 7 : 7)) + "px," + Math.round(s.y - el.offsetHeight / 2) + "px)";
    });
  }
  if (globe) globe.frameCb = placePins;

  /* ---------- Chapters ---------- */
  var cur = 0, tour = null;
  function censusChart() {
    var d = [["Hokkien", 39.3, 1180599], ["Teochew", 19.4, 583963], ["Cantonese", 14.3, 429329], ["Hakka", 8.6, 259153],
      ["Hainanese", 6.1, 183312], ["Hokchew", 2.0, 59609], ["Henghua", 0.9, 26702], ["Shanghainese", 0.75, 22503], ["Hockchia", 0.6, 17070]];
    return '<div class="bars" role="img" aria-label="Share of Chinese residents by dialect group, 2020 census">' +
      d.map(function (r) {
        return '<div class="bar ' + (r[0] === "Shanghainese" ? "hi" : "") + '" data-tip="' + r[0] + ": " + r[2].toLocaleString("en-US") + ' residents"><span>' + r[0] + '</span><span class="tr"><i class="fl" style="width:' + (r[1] / 39.3 * 100) + '%"></i></span><span class="v">' + r[1] + "%</span></div>";
      }).join("") + '</div><p class="hint">Share of 3,006,769 Chinese residents, 2020 census.' + citeTag("census") + citeTag("roots") + "</p>";
  }
  function matrix() {
    var rows = [["English monolingual children", 1, 1], ["Mandarin monolingual children", 1, 1], ["Bilinguals speaking English", 1, 1], ["Bilinguals speaking Mandarin", 0, 1]];
    return '<table class="matrix"><caption class="hint" style="text-align:left;caption-side:bottom">Follows the given/new discourse principle? Samples of 6, 6 and 9 children.' + citeTag("so2014") + '</caption><tr><th></th><th>Speech</th><th>Gesture</th></tr>' +
      rows.map(function (r) {
        return "<tr><th>" + r[0] + "</th>" + [r[1], r[2]].map(function (v) { return v ? "<td>Yes</td>" : '<td class="no">No</td>'; }).join("") + "</tr>";
      }).join("") + "</table>";
  }
  function renderChapter(i) {
    var c = CH[i], h = "";
    if (c.when) h += '<p class="when">' + esc(c.when) + "</p>";
    h += i === 0 ? "<h1>" + esc(c.title) + "</h1>" : "<h2>" + esc(c.title) + "</h2>";
    if (c.byline) h += '<p class="byline">' + esc(c.byline) + "</p>";
    c.body.forEach(function (p) { h += "<p>" + cites(p) + "</p>"; });
    if (c.legend) {
      h += '<ul class="legend">' + c.legend.map(function (l) {
        return "<li>" + (l[0] ? '<i style="background:' + l[0] + '"></i>' : "") + esc(l[1]) + "</li>";
      }).join("") + "</ul>";
    }
    if (c.chart === "census") h += censusChart();
    if (c.chart === "matrix") h += matrix();
    if (c.words) {
      h += '<table class="words">' + c.words.map(function (w) {
        return "<tr><th>" + esc(w.w) + "</th><td><b>" + esc(w.o) + "</b>" + esc(w.g) + citeTag(w.c) + "</td></tr>";
      }).join("") + "</table>";
    }
    if (c.next) h += '<a class="nextbtn" href="#timeline">Explore the timeline</a>';
    if (i === 0) h += '<p class="hint">Use Next or the arrow keys to move through the story. Drag the globe to turn it, scroll to zoom, and select a place name for its speech, signs and gestures.</p>';
    var panel = $("panel");
    panel.innerHTML = h;
    panel.scrollTop = 0;
    document.title = (i === 0 ? "" : c.label + ": ") + "Three Ports, One Sign Language";
  }
  function go(i, instant) {
    i = Math.max(0, Math.min(CH.length - 1, i));
    cur = i;
    var c = CH[i];
    renderChapter(i);
    closePlace();
    activePins = c.pins || [];
    if (globe) {
      var mob = window.innerWidth <= 760;
      globe.flyTo(c.cam.lat, c.cam.lon, c.cam.z * (mob ? 0.92 : 1), instant ? 0 : undefined);
      globe.setArcs(c.arcs || []);
    }
    Array.prototype.forEach.call(document.querySelectorAll(".step"), function (s) {
      var on = +s.dataset.i === i;
      s.classList.toggle("on", on);
      if (on) s.setAttribute("aria-current", "step"); else s.removeAttribute("aria-current");
    });
    $("prev").disabled = i === 0;
    $("next").textContent = i === CH.length - 1 ? "Timeline" : "Next";
    try { history.replaceState(null, "", "#ch-" + c.id); } catch (e) { /* file:// on some browsers */ }
  }
  function next() {
    if (cur === CH.length - 1) { stopTour(); $("timeline").scrollIntoView(); return; }
    go(cur + 1);
  }
  function stopTour() { if (tour) { clearTimeout(tour); tour = null; $("play").textContent = "Play tour"; } }
  function tourStep() {
    var words = CH[cur].body.join(" ").split(/\s+/).length;
    tour = setTimeout(function () {
      if (cur === CH.length - 1) { stopTour(); return; }
      go(cur + 1); tourStep();
    }, Math.max(8000, words * 330));
  }
  $("play").addEventListener("click", function () {
    if (tour) { stopTour(); return; }
    $("play").textContent = "Pause tour";
    tourStep();
  });
  $("next").addEventListener("click", function () { stopTour(); next(); });
  $("prev").addEventListener("click", function () { stopTour(); go(cur - 1); });
  $("zoomin").addEventListener("click", function () { stopTour(); if (globe) globe.zoomBy(1.4); });
  $("zoomout").addEventListener("click", function () { stopTour(); if (globe) globe.zoomBy(1 / 1.4); });
  $("fs").addEventListener("click", function () {
    if (document.fullscreenElement) document.exitFullscreen();
    else if (document.documentElement.requestFullscreen) document.documentElement.requestFullscreen();
  });
  if (globe) globe.onInteract = stopTour;

  /* ---------- Story rail ---------- */
  function buildRail() {
    var track = $("track"), n = CH.length, h = '<div class="axis"></div>';
    CH.forEach(function (c, i) {
      var x = 3 + (i / (n - 1)) * 94;
      h += '<button type="button" class="tk step" style="left:' + x + '%" data-i="' + i + '" data-tip="' + esc(c.label) + '" aria-label="Chapter: ' + esc(c.label) + '">' + esc(c.rail) + "</button>";
    });
    track.innerHTML = h;
    track.addEventListener("click", function (e) {
      var b = e.target.closest(".step");
      if (b) { stopTour(); go(+b.dataset.i); }
    });
  }

  /* ---------- Place card ---------- */
  var openKey = null, placeTab = "spoken";
  var TAB_NAMES = { spoken: "Spoken", sign: "Sign", gesture: "Gesture" };
  function openPlace(k) {
    stopTour();
    openKey = k;
    var p = S.PLACES[k], el = $("place");
    Object.keys(pinEls).forEach(function (q) { pinEls[q].classList.toggle("on", q === k); });
    el.hidden = false;
    el.innerHTML = '<button class="x" type="button" aria-label="Close place details">×</button><h3>' + esc(p.name) + '</h3><div class="tabs" role="tablist">' +
      Object.keys(TAB_NAMES).map(function (t) {
        return '<button type="button" role="tab" data-t="' + t + '" aria-selected="' + (t === placeTab) + '">' + TAB_NAMES[t] + "</button>";
      }).join("") + '</div><div id="placebody">' + cites(p[placeTab]) + "</div>";
    el.querySelector(".x").focus({ preventScroll: true });
  }
  function closePlace() {
    openKey = null;
    $("place").hidden = true;
    Object.keys(pinEls).forEach(function (q) { pinEls[q].classList.remove("on"); });
  }
  $("place").addEventListener("click", function (e) {
    if (e.target.closest(".x")) { closePlace(); return; }
    var t = e.target.closest("[data-t]");
    if (t && openKey) { placeTab = t.dataset.t; openPlace(openKey); var again = $("place").querySelector('[data-t="' + placeTab + '"]'); if (again) again.focus(); }
  });

  /* ---------- Citations, tips, keyboard ---------- */
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-src]");
    if (!b) return;
    var k = b.dataset.src, s = S.SOURCES[k], el = $("cite");
    el.hidden = false;
    el.innerHTML = "<strong>" + (srcOrder.indexOf(k) + 1) + ".</strong> " + esc(s.t) + ' <a href="' + esc(s.u) + '" target="_blank" rel="noopener">Open source</a><button type="button" aria-label="Close source">×</button>';
    el.querySelector("button").addEventListener("click", function () { el.hidden = true; });
  });
  var tip = $("tip");
  document.addEventListener("pointermove", function (e) {
    var t = e.target.closest && e.target.closest("[data-tip]");
    if (!t) { tip.hidden = true; return; }
    tip.hidden = false;
    tip.textContent = t.dataset.tip;
    var x = Math.min(e.clientX + 12, window.innerWidth - tip.offsetWidth - 8);
    tip.style.left = x + "px";
    tip.style.top = Math.max(4, e.clientY - tip.offsetHeight - 10) + "px";
  });
  document.addEventListener("keydown", function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    var inJourney = window.scrollY < window.innerHeight * 0.5;
    if (e.key === "Escape") { closePlace(); $("cite").hidden = true; return; }
    if (e.key.toLowerCase() === "f" && inJourney) { $("fs").click(); return; }
    if (!inJourney) return;
    if (e.key === "ArrowRight" || e.key === "PageDown") { e.preventDefault(); stopTour(); next(); }
    else if (e.key === "ArrowLeft" || e.key === "PageUp") { e.preventDefault(); stopTour(); go(cur - 1); }
    else if (e.key === " " && !/BUTTON|A/.test(document.activeElement.tagName)) { e.preventDefault(); stopTour(); next(); }
  });

  /* ---------- Anatomy ---------- */
  function renderLayer(id) {
    var L = S.LAYERS.filter(function (x) { return x.id === id; })[0];
    Array.prototype.forEach.call($("stack").children, function (b) { b.setAttribute("aria-selected", b.dataset.l === id); });
    $("layer").innerHTML = "<h3>" + esc(L.name) + '</h3><p class="era">' + esc(L.era) + "</p><p>" + cites(L.how) + "</p>" +
      L.groups.map(function (g) {
        return "<h4>" + esc(g.h) + [].concat(g.c).map(citeTag).join("") + '</h4><ul class="terms">' + g.items.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>";
      }).join("") + '<p class="note">' + esc(L.note) + "</p>";
  }
  function buildAnatomy() {
    $("stack").innerHTML = S.LAYERS.map(function (L) {
      return '<button type="button" role="tab" data-l="' + L.id + '" style="--t:' + L.tone + '"><b>' + esc(L.short) + "</b><span>" + esc(L.era) + "</span></button>";
    }).join("");
    $("stack").addEventListener("click", function (e) {
      var b = e.target.closest("[data-l]");
      if (b) renderLayer(b.dataset.l);
    });
    renderLayer("ssl");
    $("journeys").innerHTML = S.JOURNEYS.map(function (j) {
      return '<div class="jr"><b>' + esc(j.name) + j.c.map(citeTag).join("") + "</b><ol>" + j.steps.map(function (s) { return "<li>" + esc(s) + "</li>"; }).join("") + "</ol>" +
        (j.note ? '<p class="small">' + esc(j.note) + "</p>" : "") + "</div>";
    }).join("");
    Array.prototype.forEach.call(document.querySelectorAll("[data-cite]"), function (n) { n.outerHTML = citeTag(n.dataset.cite); });
    $("srclist").innerHTML = srcOrder.map(function (k) {
      var s = S.SOURCES[k];
      return '<li id="src-' + k + '">' + esc(s.t) + ' <a href="' + esc(s.u) + '" target="_blank" rel="noopener">Open</a></li>';
    }).join("");
  }

  /* ---------- Evidence figures ---------- */
  function hbars(rows, opts) {
    opts = opts || {};
    var max = opts.max || Math.max.apply(null, rows.map(function (r) { return r[1]; }));
    return '<div class="bars" role="img" aria-label="' + esc(opts.alt || "") + '" style="font-size:14px">' + rows.map(function (r) {
      return '<div class="bar" style="grid-template-columns:' + (opts.lab || "180px") + ' 1fr 64px" data-tip="' + esc(r[2] || (r[0] + ": " + r[1])) + '"><span>' + esc(r[0]) + '</span><span class="tr"><i class="fl" style="width:' + (r[1] / max * 100) + "%;background:" + (opts.color || "var(--teal)") + '"></i></span><span class="v">' + r[1] + (opts.unit === undefined ? "%" : opts.unit) + "</span></div>";
    }).join("") + "</div>";
  }
  function dots(spec) {
    var out = "";
    spec.forEach(function (s) { for (var i = 0; i < s[0]; i++) out += '<i class="' + s[1] + '"></i>'; });
    return '<div class="dots" aria-hidden="true">' + out + "</div>";
  }
  function leeChart() {
    /* two groups, two series */
    var W = 520, H = 230, base = 186, scale = 1.75, g = [["By sign pair (n = 213)", 36.2, 34.7], ["By concept (n = 100)", 72, 64]], s = "";
    g.forEach(function (r, i) {
      var cx = 130 + i * 260, bw = 62;
      [[r[1], "#2A78D6", -bw - 2, "Participant judgment"], [r[2], "#EB6834", 2, "HamNoSys transcription"]].forEach(function (b) {
        var h = b[0] * scale, x = cx + b[2];
        s += '<g data-tip="' + b[3] + ": " + b[0] + '%"><path d="M' + x + " " + base + "V" + (base - h + 4) + "q0-4 4-4h" + (bw - 8) + "q4 0 4 4V" + base + 'z" fill="' + b[1] + '"/>' +
          '<text x="' + (x + bw / 2) + '" y="' + (base - h - 6) + '" text-anchor="middle" font-size="14" font-weight="600" fill="#14242F">' + b[0] + "%</text></g>";
      });
      s += '<text x="' + cx + '" y="' + (base + 22) + '" text-anchor="middle" font-size="14" fill="#14242F">' + r[0] + "</text>";
    });
    return '<div class="keyline"><span><i style="background:#2A78D6"></i>Participant judgment</span><span><i style="background:#EB6834"></i>HamNoSys transcription</span></div>' +
      '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Similar to ASL: 36.2 and 34.7 percent of sign pairs, 72 and 64 percent of concepts"><line x1="20" x2="500" y1="' + base + '" y2="' + base + '" stroke="#C9D2CD"/>' + s + "</svg>";
  }
  function slope() {
    var W = 520, H = 220, X0 = 150, X1 = 370, y = function (v) { return 196 - v * 2.5; };
    function line(a, b, col, name) {
      return '<g data-tip="' + name + ": " + a + "% in 1980, " + b + '% in 1989"><line x1="' + X0 + '" x2="' + X1 + '" y1="' + y(a) + '" y2="' + y(b) + '" stroke="' + col + '" stroke-width="3" stroke-linecap="round"/><circle cx="' + X0 + '" cy="' + y(a) + '" r="6" fill="' + col + '" stroke="#F5F7F2" stroke-width="2"/><circle cx="' + X1 + '" cy="' + y(b) + '" r="6" fill="' + col + '" stroke="#F5F7F2" stroke-width="2"/>' +
        '<text x="' + (X0 - 12) + '" y="' + (y(a) + 5) + '" text-anchor="end" font-size="14" fill="#14242F">' + name + " " + a + '%</text><text x="' + (X1 + 12) + '" y="' + (y(b) + 5) + '" font-size="14" fill="#14242F">' + b + "% " + name + "</text></g>";
    }
    return '<svg viewBox="0 0 ' + W + " " + H + '" role="img" aria-label="Primary One pupils: dialect homes fell from 64 to 7 percent; Mandarin homes rose from 26 to 69 percent, 1980 to 1989">' +
      '<text x="' + X0 + '" y="16" text-anchor="middle" font-size="14" font-weight="600" fill="#4C5D66">1980</text><text x="' + X1 + '" y="16" text-anchor="middle" font-size="14" font-weight="600" fill="#4C5D66">1989</text>' +
      line(64, 7, "#B0126F", "Dialect") + line(26, 69, "#0B6E7A", "Mandarin") + "</svg>";
  }
  function fig(title, sub, body, lim, wide) {
    return '<figure class="fig ' + (wide ? "wide" : "") + '" style="margin:0"><h3>' + title + "</h3>" + (sub ? '<p class="sub">' + cites(sub) + "</p>" : "") + body + (lim ? '<p class="lim">' + cites(lim) + "</p>" : "") + "</figure>";
  }
  function buildFigs() {
    var f = "";
    f += fig("The size of the picture", "", '<div class="stats">' + [
      ["~5,000", "self-identified sign language users{{ntu}}"], ["786", "signs documented in the Sign Bank and e-book by early 2025, and still growing{{hey}}{{signbank}}"],
      ["~700", "signs in <i>Sign for Singapore</i>, 1990{{biblio}}"], ["6", "full-time interpreters at SADeaf, 2020/21{{tayng}}"], ["Not yet", "official status; a government study was underway in Feb 2025{{msf}}"]
    ].map(function (x) { return "<div><b>" + x[0] + "</b><span>" + cites(x[1]) + "</span></div>"; }).join("") + "</div>", "", true);

    f += fig("How much looks like ASL?", "Most concepts have an ASL-like sign, but most individual signs are not ASL-like. Variants coexist.{{lee}}", leeChart(),
      "Lee 2016: 3 signers supplied the signs and 10 people judged them, using a 100-word list adapted for sign languages. Judgment means at least 60% rated form and meaning the same; transcription means a similarity score above 0.65. There is no SSL comparison, and similar form doesn't prove borrowing.");

    f += fig("What raters said", "2,130 judgments across 213 pairs of SgSL and ASL signs.{{lee}}", hbars([
      ["Same meaning, look different", 49.2, "1,049 judgments"], ["Same meaning, look the same", 39.7, "846 judgments"], ["Different meaning, look different", 6.4, "137 judgments"], ["Different meaning, look the same", 2.6, "56 judgments"], ["Could not identify", 2.0, "42 judgments"]
    ], { lab: "210px", alt: "Rater judgments" }),
      "Concepts with four SgSL variants on the list include BAD, COUNT, IF, SING, FISH, WOOD and ICE. No judged variant of DUST or LOUSE was rated the same as ASL by anyone, which makes them candidates for non-ASL sources.");

    f += fig("Negation: 7 of 13 forms resemble ASL", "Ang (2017) describes 13 manual negative forms. Grammar has not simply followed the words: SgSL still prefers manual negation, like Hong Kong Sign Language and unlike ASL.{{ang}}",
      dots([[7, "a"], [6, ""]]) + '<div class="keyline"><span><i style="background:var(--indigo)"></i>Similar to ASL negators</span><span><i style="background:var(--line)"></i>Other forms</span></div>', "One grammatical domain, one thesis. It should not be generalized to all of SgSL grammar.");

    f += fig("Signers disagree about what counts", "Which language practice do you support? Tay's 2016 interviews, n = 48.{{tayng}}", hbars([
      ["SgSL", 37.5], ["SEE", 27], ["SEE to teach, SgSL socially", 21], ["Don't know", 8.3], ["Undecided", 6.2]
    ], { lab: "190px", color: "var(--indigo)", alt: "Language practices supported" }), "Some see SgSL as “broken English,” the same stigma Singlish carries. Not a random sample.");

    f += fig("Whose voices are in the data", "Tay's interviewees by ethnicity. Most evidence about signers in Singapore comes from Chinese Singaporeans.{{tayng}}",
      dots([[45, "t"], [2, "m"], [1, "a"]]) + '<div class="keyline"><span><i style="background:var(--teal)"></i>Chinese, 45</span><span><i style="background:var(--amber)"></i>Malay, 2</span><span><i style="background:var(--indigo)"></i>Indian, 1</span></div>', "So the multicultural evidence is strongest for vocabulary and attitudes. Malay and Indian Deaf experience needs its own study.");

    f += fig("How fast speech changed at home", "Primary One pupils from homes mainly speaking each language.{{smc}}", slope(), "Dialect TV was banned in 1981 and dialect radio ended in 1983. Over the same years, Malaysian TV2 began airing Cantonese and Hokkien dramas.{{tv2}}");

    f += fig("Chinese Singaporeans by dialect group", "2020 census. The Shanghainese, Peng's group, are among the smallest.{{census}}", hbars([
      ["Hokkien", 39.3, "1,180,599"], ["Teochew", 19.4, "583,963"], ["Cantonese", 14.3, "429,329"], ["Hakka", 8.6, "259,153"], ["Hainanese", 6.1, "183,312"], ["Hokchew", 2, "59,609"], ["Henghua", 0.9, "26,702"], ["Shanghainese", 0.75, "22,503"], ["Hockchia", 0.6, "17,070"]
    ], { lab: "110px", alt: "Dialect groups" }), "Percentages are my calculations from census counts, out of 3,006,769 Chinese residents.");

    f += fig("Gesture research in Singapore", "These studies measure hearing speakers' co-speech gesture, not SgSL.", '<table class="table"><tr><th>Study</th><th>Who</th><th>Finding</th></tr>' +
      [["So 2010{{so2010}}", "English–Mandarin bilinguals in Singapore; monolingual comparison groups", "American English monolinguals gestured more than Mandarin monolinguals. Bilinguals gestured more in Mandarin than Mandarin monolinguals, and about the same as English monolinguals in English."],
       ["So, Kita & Goldin-Meadow 2013{{so2013}}", "50 Singaporean Chinese bilingual undergraduates, none of them signers", "Proficient speakers pointed at referents speech left unspecified and used iconic gestures for referents speech specified. Less proficient speakers did not separate them."],
       ["So, Lim & Tan 2014{{so2014}}", "6 English and 6 Mandarin monolingual children; 9 English-dominant bilingual children", "In their weaker language, children's gestures followed discourse rules that their speech did not."],
       ["So & Lim 2012{{solim}}", "10 Chinese-speaking and 8 English-speaking caregivers", "Chinese-speaking caregivers gestured more. Both groups gestured more for new referents, and children used those gestures."],
       ["Malay pointing study{{malaypoint}}", "10 direction-giving interactions among Malay speakers", "Pointing combines hand, gaze, torso and head, with some Malay-specific forms."]
      ].map(function (r) { return "<tr><td>" + cites(r[0]) + "</td><td>" + esc(r[1]) + "</td><td>" + esc(r[2]) + "</td></tr>"; }).join("") + "</table>",
      "Sampling location isn't stated in the abstracts of So, Lim & Tan or So & Lim; the authors were based in Singapore. The Malay study's location is also not stated in what I read. Claims about gestures by ethnic group mostly come from etiquette guides, so I left them out.", true);

    f += fig("Where the sources disagree", "Dates vary. This site follows the most detailed peer-reviewed account unless noted.{{tayng}}", '<table class="table"><tr><th>Event</th><th>Used here</th><th>Also reported</th></tr>' +
      [["Peng's birth and deafness", "Born 1926, deaf at about 5{{podcast}}", "Deaf at 6, in a Wikipedia account"],
       ["Peng reaches Singapore", "About 1948{{tayng}}{{biblio}}", "1950{{tayposter}}; 1951{{lee}}"],
       ["First signing school", "1954{{tayng}}{{biblio}}", "1952{{signbank}}"],
       ["Chinese sign section ends", "1978{{tayng}}", "1983{{lee}}"],
       ["Name “SgSL”", "2007{{tayng}}{{medium}}", "2008{{biblio}}; 2009{{signbank}}"]
      ].map(function (r) { return "<tr><td>" + r[0] + "</td><td>" + cites(r[1]) + "</td><td>" + cites(r[2]) + "</td></tr>"; }).join("") + "</table>", "", true);

    f += fig("What we still don't know", "", '<ul style="margin:0;padding-left:20px;max-width:70ch"><li>How large is the SSL share? A lexical count against SSL has not been done.</li><li>Did Chinese grammar or characters systematically shape SgSL? I found no evidence either way.</li><li>What are Malay and Indian Deaf signers\' practices, and where do the forms shared with BIM come from?</li><li>Have hearing Singaporeans\' gestures entered SgSL? A gesture inventory set against the Sign Bank could test this.</li></ul>', "", true);
    $("figs").innerHTML = f;
  }

  /* ---------- Interactive timeline ---------- */
  var tlSel = 0;
  function buildTimeline() {
    var ev = S.TIMELINE, W = 1400, Y0 = 1923, Y1 = 2030, axis = 186, H = 382;
    function x(y) { return 16 + ((y - Y0) / (Y1 - Y0)) * (W - 32); }
    var LV = [26, 64, 102, 140], s = "";
    s += '<line x1="16" x2="' + (W - 16) + '" y1="' + axis + '" y2="' + axis + '" stroke="#14242F" stroke-width="1.5"/>';
    for (var d = 1930; d <= 2020; d += 10) {
      s += '<line x1="' + x(d) + '" x2="' + x(d) + '" y1="' + (axis - 4) + '" y2="' + (axis + 4) + '" stroke="#14242F"/>';
    }
    ev.forEach(function (e, i) {
      var up = e.lane === "society", X = x(e.y), yy = up ? axis - LV[e.lv] : axis + LV[e.lv];
      var col = up ? "#0B6E7A" : "#B0126F", end = e.anchor === "end";
      var tx = end ? X - 6 : X + 6, ty = up ? yy - 16 : yy + 4, anchor = end ? "end" : "start";
      var year = e.when || String(Math.floor(e.y)), bw = Math.max(e.label.length * 7.1, year.length * 7.6) + 12;
      var bx = end ? X - bw : X, by = ty - 13;
      s += '<g class="ev" data-e="' + i + '" tabindex="0" role="button" aria-pressed="false" aria-label="' + esc(year + ": " + e.title) + '" style="--c:' + col + '">' +
        '<rect class="hit" x="' + (bx - 2) + '" y="' + by + '" width="' + (bw + 2) + '" height="35" rx="2"/>' +
        '<line class="hitline" x1="' + X + '" x2="' + X + '" y1="' + axis + '" y2="' + yy + '" stroke="transparent" stroke-width="12"/>' +
        '<line class="lead" x1="' + X + '" x2="' + X + '" y1="' + axis + '" y2="' + yy + '" stroke="' + col + '"/>' +
        '<circle class="dot" cx="' + X + '" cy="' + axis + '" r="6" fill="' + col + '"/>' +
        '<text x="' + tx + '" y="' + ty + '" text-anchor="' + anchor + '"><tspan class="yr" x="' + tx + '">' + esc(year) + '</tspan><tspan x="' + tx + '" dy="16">' + esc(e.label) + "</tspan></text></g>";
    });
    $("tlsvg").innerHTML = '<svg viewBox="0 0 ' + W + " " + H + '" role="group" aria-label="Timeline, 1926 to 2024. Select an event to read about it.">' + s + "</svg>";
    selectEvent(0);
    function moveBy(n) { selectEvent(Math.max(0, Math.min(ev.length - 1, tlSel + n))); }
    $("tlsvg").addEventListener("click", function (e) {
      var g = e.target.closest(".ev");
      if (g) selectEvent(+g.dataset.e);
    });
    $("tlsvg").addEventListener("keydown", function (e) {
      var g = e.target.closest(".ev");
      if (!g) return;
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectEvent(+g.dataset.e); }
      else if (e.key === "ArrowRight") { e.preventDefault(); moveBy(1); focusEvent(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); moveBy(-1); focusEvent(); }
    });
    function focusEvent() { var g = document.querySelector('.ev[data-e="' + tlSel + '"]'); if (g) g.focus(); }
    $("tlprev").addEventListener("click", function () { moveBy(-1); });
    $("tlnext").addEventListener("click", function () { moveBy(1); });
    $("tlglobe").addEventListener("click", function () {
      var c = ev[tlSel].ch;
      CH.forEach(function (ch, i) { if (ch.id === c) go(i); });
      $("journey").scrollIntoView();
    });
  }
  function selectEvent(i) {
    tlSel = i;
    var e = S.TIMELINE[i], up = e.lane === "society";
    Array.prototype.forEach.call(document.querySelectorAll(".ev"), function (g) {
      var on = +g.dataset.e === i;
      g.classList.toggle("on", on);
      g.setAttribute("aria-pressed", on);
      if (on) {
        var wrap = $("tlsvg"), r = g.getBoundingClientRect(), wr = wrap.getBoundingClientRect();
        if (wrap.scrollWidth > wrap.clientWidth && (r.left < wr.left || r.right > wr.right)) wrap.scrollLeft += r.left - wr.left - 40;
      }
    });
    var card = $("tlcard");
    card.style.setProperty("--c", up ? "#0B6E7A" : "#B0126F");
    $("tlyear").textContent = e.when || String(Math.floor(e.y));
    $("tllane").textContent = up ? "Society and policy" : "Peng and Deaf history";
    $("tltitle").textContent = e.title;
    $("tlbody").innerHTML = cites(e.body);
    $("tlwhy").innerHTML = cites(e.why);
    $("tlcount").textContent = "Event " + (i + 1) + " of " + S.TIMELINE.length;
    $("tlprev").disabled = i === 0;
    $("tlnext").disabled = i === S.TIMELINE.length - 1;
    var ch = CH.filter(function (c) { return c.id === e.ch; })[0];
    $("tlglobe").textContent = "See “" + ch.label + "” on the globe";
  }

  /* ---------- Start ---------- */
  buildRail();
  buildTimeline();
  buildAnatomy();
  buildFigs();
  insets();
  loadLand();
  var start = 0, m = /^#ch-(\w+)/.exec(location.hash);
  if (m) CH.forEach(function (c, i) { if (c.id === m[1]) start = i; });
  go(start, true);
  window.addEventListener("resize", function () { insets(); go(cur, true); });
  window.__tp = { globe: globe, go: go };
})();
