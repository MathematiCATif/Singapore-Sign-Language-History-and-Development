# Three Ports, One Sign Language

An interactive 3D globe by **Tiffany He**. It follows Peng Tsu Ying from Shanghai to Hong Kong to Singapore, then shows how migration and policy shaped Singapore's spoken languages, gestures and Singapore Sign Language (SgSL).

It is a static site, with nothing to install or build.

## Publish on GitHub Pages

1. Sign in at [github.com](https://github.com) and create a new **public** repository, for example `three-ports`. Don't add a README.
2. On the empty repository page, select **uploading an existing file**.
3. Unzip the project. Open the folder and drag **everything inside it** into the browser, so that `index.html` sits at the top level of the repository. Then select **Commit changes**.
4. Go to **Settings > Pages**. Under **Build and deployment**, set Source to **Deploy from a branch**, Branch to **main**, and folder to **/ (root)**. Select **Save**.
5. Wait a minute or two, then refresh that page. Your site address appears at the top: `https://YOUR-USERNAME.github.io/three-ports/`.

Using the command line instead:

```bash
cd three-ports
git init -b main
git add .
git commit -m "Publish Three Ports site"
git remote add origin https://github.com/YOUR-USERNAME/three-ports.git
git push -u origin main
```

Then do step 4.

## Check it before you present

1. Open the published address with an internet connection.
2. Make sure the coastlines look detailed, and that no "rough outline" message appears at the bottom right.
3. Open the Malaysia chapter and check that Penang and Singapore sit correctly on the map.

Detailed coastlines load from jsDelivr when the page opens.

### To present without relying on that connection

Run this once inside the project folder, then commit the two new files:

```bash
curl -o data/land-50m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-50m.json
curl -o data/land-10m.json https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-10m.json
```

The site uses these copies first. To run it locally with them, use `python3 -m http.server` and open `http://localhost:8000`.

## Presenting

| Action | Control |
| --- | --- |
| Next or previous chapter | Right or left arrow, or the Next and Back buttons |
| Turn the globe | Drag |
| Zoom | Scroll, pinch, or the + and − buttons |
| Speech, sign and gesture details for a place | Select its name on the globe |
| Show a source | Select a small number in the text |
| Full screen | F, or the Full screen button |
| Move through the story automatically | Play tour |
| Read about a timeline event | Select it, or use Earlier and Later |
| Link to a chapter | Add a chapter id to the address, such as `#ch-malaysia` |

## Editing

All the text, routes, examples and sources are in `js/content.js`. Open it in any text editor, or use the pencil icon on GitHub. Save and commit, and the site updates within a minute or two.

- `{{tayng}}` in text creates a numbered citation from the `SOURCES` list.
- To change the camera for a chapter, edit its `cam`: `lat`, `lon` and zoom `z`.
- Timeline events are in `TIMELINE` in `js/content.js`. Adjust `lv` (0 to 3) if labels collide.
- The charts in **The evidence** are in `buildFigs` in `js/app.js`.

## Project files

| Path | Purpose |
| --- | --- |
| `index.html` | Page structure |
| `css/style.css` | Design |
| `js/content.js` | All content |
| `js/app.js` | Chapters, interactions and charts |
| `js/globe.js` | The 3D globe, written in plain WebGL |
| `data/fallback-land.js` | Rough outline used only if coastlines fail to load |
| `vendor/d3-geo.min.js` | Map drawing library (ISC license, see `vendor/d3-geo.LICENSE`) |

Detailed coastlines come from [Natural Earth](https://www.naturalearthdata.com/) (public domain) through [world-atlas](https://github.com/topojson/world-atlas).
