# Parity harness (old build ↔ Angular app)

Used on 14 Sep 2026 to compare every screen of the retired single-file build with the Angular app at the same window size.
1. `python3 collector.py` — a tiny POST collector on 127.0.0.1:4299 writing `data/<app>-<screen>.json`.
2. In each app's page (Browser pane, javascript_tool) inject the capture harness (see the session transcript of 14 Sep, or
   rebuild it: for every visible element inside the active screen record tag + sorted classes (state classes stripped),
   rect relative to the screen (÷ --z), own text, font-size/weight/family, colour, background, border-radius; hook
   `HTMLMediaElement.prototype.play` to log clip keys). Old build: `kratuGo(name,{noSample:true})` jumps to a block
   (shim requestAnimationFrame with setTimeout while the pane is hidden). Angular: `ng.getComponent(app-root).router`.
3. `python3 compare.py` — pairs old/new screens, scales the old build's layout-px rects by its zoom (legacy CSS zoom
   semantics), lists missing/extra elements, position/size deltas over 4 px, text and style differences, clip order.
Known noise: Laila's breathing animation (±6 % on `.lm`), `x-laila`/`obj-go` class labels, the spot hand during a tour.
