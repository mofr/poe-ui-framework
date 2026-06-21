// Make a texture tile seamlessly via Moisan's PERIODIC + SMOOTH decomposition (2011).
// Any image splits uniquely as u = p + s, where p is *periodic* (tiles with plain `repeat`,
// seamless BY CONSTRUCTION) and s is a *smooth* low-frequency field that absorbs the
// boundary mismatch. We keep p. It is detail-preserving: only a gentle gradient is removed,
// so all texture survives — NO blur, NO colour shift, NO mirror symmetry.
// Ideal for low-contrast non-tileable material (stone, paper). Native size in/out (drop-in).
//   node tools/make-seamless.mjs <in.png> <out.png> [--flatten] [--sigma=N]
//
// Pipeline per channel: periodic decomposition → DEBAND (Moisan's correction peaks at the border
// and reads as an inset-shadow rim once tiled; deband relocates it off the edge — see below) →
// optional --flatten (Fourier high-pass for broad tone). All three keep the tile exactly periodic.
//
// --flatten : optional broad-tone removal applied AFTER the decomposition, as a Fourier high-pass.
//   The periodic step trades a hard seam for a soft low-frequency RAMP, and any source illumination
//   (vignette, gradient) survives — both read as a broad tile band. We high-pass the periodic tile
//   in the frequency domain (gaussian, 1−exp(−c·f²)): exact, perfectly periodic, fast at any radius.
//   It flattens the broad tone (illumination + ramp) while the fine grain — the material feel —
//   survives; the channel mean is restored. --sigma is the gaussian radius in px (default min(W,H)/3,
//   enough to cancel the full-width ramp); smaller = flattens finer variation too (more uniform).
//
// p is computed in the Fourier domain: s solves the periodic Poisson equation Δs = v, where v
// is the cross-boundary jump field. Image side (1254) is not a power of two, so the 1-D DFTs
// use Bluestein (arbitrary-length DFT built on a radix-2 FFT) — keeps native size, no resize.
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const [inArg, outArg] = process.argv.slice(2).filter(a => !a.startsWith('--'));
if (!inArg || !outArg) { console.error('usage: node tools/make-seamless.mjs <in.png> <out.png>'); process.exit(1); }

// ---- radix-2 FFT (in-place, length = power of two). inverse just flips the exponent sign;
// caller divides by N when it wants a true inverse. ----
function fft(re, im, inverse) {
  const n = re.length;
  for (let i = 1, j = 0; i < n; i++) {            // bit-reversal permutation
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) { [re[i], re[j]] = [re[j], re[i]]; [im[i], im[j]] = [im[j], im[i]]; }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (inverse ? 2 : -2) * Math.PI / len;
    const wr = Math.cos(ang), wi = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let cr = 1, ci = 0;
      for (let k = 0; k < len / 2; k++) {
        const a = i + k, b = i + k + len / 2;
        const tr = re[b] * cr - im[b] * ci, ti = re[b] * ci + im[b] * cr;
        re[b] = re[a] - tr; im[b] = im[a] - ti;
        re[a] += tr; im[a] += ti;
        const ncr = cr * wr - ci * wi; ci = cr * wi + ci * wr; cr = ncr;
      }
    }
  }
}

// ---- Bluestein: DFT of arbitrary length N, dir=-1 forward / +1 inverse (unnormalised). ----
function makeBluestein(N) {
  let M = 1; while (M < 2 * N - 1) M <<= 1;
  const tab = {};                                  // per-direction precompute
  for (const dir of [-1, 1]) {
    const br = new Float64Array(N), bi = new Float64Array(N);
    const Cr = new Float64Array(M), Ci = new Float64Array(M);
    for (let n = 0; n < N; n++) {
      const a = dir * Math.PI * ((n * n) % (2 * N)) / N;  // chirp b[n] = exp(dir·πi·n²/N)
      br[n] = Math.cos(a); bi[n] = Math.sin(a);
      Cr[n] = br[n]; Ci[n] = -bi[n];                       // c[m] = conj(b[m]); C[m]=c[m]
      if (n) { Cr[M - n] = br[n]; Ci[M - n] = -bi[n]; }    // and C[M-m]=c[m] (c even in m)
    }
    fft(Cr, Ci, false);
    tab[dir] = { M, br, bi, Cr, Ci };
  }
  return function transform(re, im, dir) {
    const { M, br, bi, Cr, Ci } = tab[dir];
    const ar = new Float64Array(M), ai = new Float64Array(M);
    for (let n = 0; n < N; n++) {                   // a[n] = x[n]·b[n]
      ar[n] = re[n] * br[n] - im[n] * bi[n];
      ai[n] = re[n] * bi[n] + im[n] * br[n];
    }
    fft(ar, ai, false);
    for (let k = 0; k < M; k++) {                   // pointwise a·C
      const r = ar[k] * Cr[k] - ai[k] * Ci[k];
      ai[k] = ar[k] * Ci[k] + ai[k] * Cr[k]; ar[k] = r;
    }
    fft(ar, ai, true);
    for (let k = 0; k < N; k++) {                   // ifft (÷M) then ·b[k]
      const cr = ar[k] / M, ci = ai[k] / M;
      re[k] = cr * br[k] - ci * bi[k];
      im[k] = cr * bi[k] + ci * br[k];
    }
  };
}

// ---- 2-D DFT over a H×W plane (row-major), dir forward(-1)/inverse(+1), unnormalised. ----
function fft2(re, im, H, W, dftW, dftH, dir) {
  const rr = new Float64Array(W), ri = new Float64Array(W);
  for (let y = 0; y < H; y++) {
    const o = y * W;
    for (let x = 0; x < W; x++) { rr[x] = re[o + x]; ri[x] = im[o + x]; }
    dftW(rr, ri, dir);
    for (let x = 0; x < W; x++) { re[o + x] = rr[x]; im[o + x] = ri[x]; }
  }
  const cr = new Float64Array(H), ci = new Float64Array(H);
  for (let x = 0; x < W; x++) {
    for (let y = 0; y < H; y++) { cr[y] = re[y * W + x]; ci[y] = im[y * W + x]; }
    dftH(cr, ci, dir);
    for (let y = 0; y < H; y++) { re[y * W + x] = cr[y]; im[y * W + x] = ci[y]; }
  }
}

// ---- Gaussian high-pass of one periodic plane, done in the Fourier domain (exact, perfectly
// periodic, fast at any sigma). Removes broad tonal variation (illumination + the periodic step's
// smooth ramp) coarser than ~sigma px, keeps the fine grain, restores the channel mean. ----
function highpass(plane, H, W, dftW, dftH, sigma) {
  const n = H * W, re = new Float64Array(n), im = new Float64Array(n);
  let mean = 0; for (let i = 0; i < n; i++) { re[i] = plane[i]; mean += plane[i]; } mean /= n;
  fft2(re, im, H, W, dftW, dftH, -1);
  const c = 2 * Math.PI * Math.PI * sigma * sigma;   // gaussian lowpass L=exp(-c·f²); highpass=1-L
  for (let q = 0; q < H; q++) {
    const fy = (q <= H / 2 ? q : q - H) / H;
    for (let r = 0; r < W; r++) {
      const fx = (r <= W / 2 ? r : r - W) / W, i = q * W + r;
      const g = 1 - Math.exp(-c * (fx * fx + fy * fy));
      re[i] *= g; im[i] *= g;
    }
  }
  fft2(re, im, H, W, dftW, dftH, 1);                 // unnormalised inverse → ÷ n, then re-add mean
  const out = new Float64Array(n);
  for (let i = 0; i < n; i++) out[i] = re[i] / n + mean;
  return out;
}

// ---- periodic component of one channel (Float64 plane, length H*W) ----
function periodic(U, H, W, dftW, dftH) {
  const vr = new Float64Array(H * W), vi = new Float64Array(H * W);
  for (let x = 0; x < W; x++) {                    // column boundary jumps (top/bottom rows)
    const d = U[(H - 1) * W + x] - U[x];
    vr[x] += d; vr[(H - 1) * W + x] -= d;
  }
  for (let y = 0; y < H; y++) {                    // row boundary jumps (left/right cols)
    const o = y * W, d = U[o + W - 1] - U[o];
    vr[o] += d; vr[o + W - 1] -= d;
  }
  fft2(vr, vi, H, W, dftW, dftH, -1);              // V = FFT2(v)
  for (let q = 0; q < H; q++) {                    // S = V / (2cos+2cos-4); S[0,0]=0
    const cq = 2 * Math.cos(2 * Math.PI * q / H);
    for (let r = 0; r < W; r++) {
      const den = cq + 2 * Math.cos(2 * Math.PI * r / W) - 4;
      const i = q * W + r;
      if (den === 0) { vr[i] = 0; vi[i] = 0; } else { vr[i] /= den; vi[i] /= den; }
    }
  }
  fft2(vr, vi, H, W, dftW, dftH, 1);               // s = IFFT2(S) (unnormalised → ÷ H*W)
  const out = new Float64Array(H * W), n = H * W;
  for (let i = 0; i < n; i++) out[i] = U[i] - vr[i] / n;   // p = u − s
  return out;
}

// ---- deband: remove the boundary band the periodic step leaves at the tile edges (its seam
// correction is forced to peak at the border, reading as a ~10-20px inset-shadow rim once tiled).
// A periodic tile can be rolled half a period without breaking periodicity — that moves the band
// from the edge to the centre. So near each edge we take the ROLLED copy (which is pristine there)
// and in the interior we keep the ORIGINAL (pristine there), blended with a smooth weight. Every
// output pixel comes from a region with no band; done separably per axis. Stays exactly periodic. ----
function deband(plane, H, W) {
  const smooth = t => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
  const wEdge = (d, span) => 1 - smooth(d / span);   // 1 at the edge, 0 by `span` px inward
  const Tx = Math.round(W / 8), Ty = Math.round(H / 8);
  const A = plane, Q = new Float64Array(W * H), R = new Float64Array(W * H);
  for (let y = 0; y < H; y++)                          // pass 1: vertical edges, roll x by W/2
    for (let x = 0; x < W; x++) {
      const w = wEdge(Math.min(x, W - 1 - x), Tx), xr = (x + (W >> 1)) % W;
      Q[y * W + x] = w * A[y * W + xr] + (1 - w) * A[y * W + x];
    }
  for (let y = 0; y < H; y++) {                        // pass 2: horizontal edges, roll y by H/2
    const w = wEdge(Math.min(y, H - 1 - y), Ty), yr = (y + (H >> 1)) % H;
    for (let x = 0; x < W; x++) R[y * W + x] = w * Q[yr * W + x] + (1 - w) * Q[y * W + x];
  }
  return R;
}

const flatten = process.argv.includes('--flatten');
const sigmaArg = process.argv.find(a => a.startsWith('--sigma='));

const img = sharp(resolve(ROOT, inArg)).removeAlpha();
const { width: W, height: H } = await img.metadata();
const raw = await img.raw().toBuffer();            // RGB, H*W*3
const dftW = makeBluestein(W), dftH = W === H ? dftW : makeBluestein(H);

const planes = [];                                 // periodic component per channel (float)
for (let c = 0; c < 3; c++) {
  const U = new Float64Array(W * H);
  for (let i = 0; i < W * H; i++) U[i] = raw[i * 3 + c];
  planes[c] = periodic(U, H, W, dftW, dftH);
}

for (let c = 0; c < 3; c++) planes[c] = deband(planes[c], H, W);   // kill the periodic step's edge band

if (flatten) {   // then flatten any broad variation that's left (illumination, ramp, deband's redistribution)
  const sigma = sigmaArg ? Number(sigmaArg.slice('--sigma='.length)) : Math.round(Math.min(W, H) / 3);
  for (let c = 0; c < 3; c++) planes[c] = highpass(planes[c], H, W, dftW, dftH, sigma);
  console.log(`flatten: Fourier high-pass (sigma ${sigma}) — removed broad tonal variation, kept grain`);
}

const result = Buffer.alloc(W * H * 3);
for (let c = 0; c < 3; c++)
  for (let i = 0; i < W * H; i++) result[i * 3 + c] = Math.max(0, Math.min(255, Math.round(planes[c][i])));
await sharp(result, { raw: { width: W, height: H, channels: 3 } }).png().toFile(resolve(ROOT, outArg));
console.log(`periodic+smooth ${W}x${H} (seamless, detail-preserving) -> ${outArg}`);
