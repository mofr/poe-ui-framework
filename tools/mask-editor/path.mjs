// Shared by the browser editor (preview) and tools/cut-mask.mjs (rasterise).
// A mask is a set of CLOSED contours: { points:[{x,y} 0..1], round?, name?, op?, note? }.
// Base shape is a straight-segment POLYGON (simple, fully local — moving a point only
// changes its two edges). `round` (0..1, fraction of width) optionally FILLETS every
// corner with an arc, so one point per corner gives a smooth bend instead of needing
// ten points. Rounding is local (a corner's fillet is bounded by half its two edges).
// Antialiasing comes from the rasteriser. HOLES are explicit: a contour with op:'hole'
// is punched out of the op:'keep' contours (the caller fills keeps then erases holes) —
// so an outer keep + inner hole = a frame band, with no nesting/ordering subtlety.
// buildPathD just turns a list of contours into one path string; op is the caller's job.

function roundedD(pts, W, H, r) {
  const n = pts.length;
  const P = pts.map(p => ({ x: p.x * W, y: p.y * H }));
  const A = [], B = [];  // A[i]=trim point entering corner i, B[i]=trim point leaving it
  for (let i = 0; i < n; i++) {
    const p = P[i], pr = P[(i - 1 + n) % n], nx = P[(i + 1) % n];
    const d1 = Math.hypot(p.x - pr.x, p.y - pr.y) || 1;
    const d2 = Math.hypot(nx.x - p.x, nx.y - p.y) || 1;
    const t = Math.min(r, d1 / 2, d2 / 2);
    A[i] = { x: p.x + (pr.x - p.x) / d1 * t, y: p.y + (pr.y - p.y) / d1 * t };
    B[i] = { x: p.x + (nx.x - p.x) / d2 * t, y: p.y + (nx.y - p.y) / d2 * t };
  }
  let d = `M ${A[0].x} ${A[0].y} `;
  for (let i = 0; i < n; i++)
    d += `Q ${P[i].x} ${P[i].y} ${B[i].x} ${B[i].y} L ${A[(i + 1) % n].x} ${A[(i + 1) % n].y} `;
  return d + 'Z ';
}

export function buildPathD(contours, W = 1, H = 1) {
  let d = '';
  for (const c of contours) {
    const pts = c.points || [];
    if (pts.length < 2) continue;
    const r = (c.round || 0) * W;
    if (r > 0 && pts.length >= 3) { d += roundedD(pts, W, H, r); continue; }
    d += `M ${pts[0].x * W} ${pts[0].y * H} `;
    for (let i = 1; i < pts.length; i++) d += `L ${pts[i].x * W} ${pts[i].y * H} `;
    d += 'Z ';
  }
  return d.trim();
}
