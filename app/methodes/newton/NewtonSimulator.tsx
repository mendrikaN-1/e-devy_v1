"use client";
import { useState, useCallback } from "react";

type Iter = { n: number; xn: number; fxn: number; fpxn: number; xn1: number; err: number };

const PRESETS = [
  { label: "cos(x)−x³=0, x₀=0.5", fx: "Math.cos(x)-Math.pow(x,3)", fpx: "-Math.sin(x)-3*x*x", x0: 0.5 },
  { label: "eˣ+3x−2=0, x₀=0", fx: "Math.exp(x)+3*x-2", fpx: "Math.exp(x)+3", x0: 0 },
  { label: "x²−2=0, x₀=1", fx: "x*x-2", fpx: "2*x", x0: 1 },
];

function evalFn(expr: string, x: number): number {
  try {
    return new Function("x", `"use strict"; const exp=Math.exp,cos=Math.cos,sin=Math.sin,sqrt=Math.sqrt,abs=Math.abs,pow=Math.pow; return ${expr};`)(x);
  } catch { return NaN; }
}

export default function NewtonSimulator() {
  const [fx, setFx] = useState("Math.cos(x)-Math.pow(x,3)");
  const [fpx, setFpx] = useState("-Math.sin(x)-3*x*x");
  const [x0, setX0] = useState(0.5);
  const [eps, setEps] = useState(1e-8);
  const [iters, setIters] = useState<Iter[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [stepIdx, setStepIdx] = useState(-1);

  const run = useCallback(() => {
    setError(""); setResult(""); setIters([]);
    let xn = x0;
    const rows: Iter[] = [];
    let maxIt = 50;
    while (maxIt-- > 0) {
      const fxn = evalFn(fx, xn);
      const fpxn = evalFn(fpx, xn);
      if (isNaN(fxn) || isNaN(fpxn)) { setError("Expression invalide."); return; }
      if (Math.abs(fpxn) < 1e-15) { setError("f′(xₙ) ≈ 0 : division impossible."); return; }
      const xn1 = xn - fxn / fpxn;
      const err = Math.abs(xn1 - xn);
      rows.push({ n: rows.length + 1, xn, fxn, fpxn, xn1, err });
      if (err < eps) { setIters(rows); setResult(`Racine ≈ ${xn1.toFixed(12)} en ${rows.length} itérations`); setStepIdx(-1); return; }
      xn = xn1;
    }
    setIters(rows);
    setResult(`Attention : ${rows.length} itérations atteintes — résultat approximatif`);
    setStepIdx(-1);
  }, [fx, fpx, x0, eps]);

  return (
    <div className="border border-gray-200 rounded p-4">
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">EXEMPLES DU COURS :</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setFx(p.fx); setFpx(p.fpx); setX0(p.x0); setIters([]); setResult(""); setError(""); }}
              className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-[#04aa6d] hover:text-white border border-gray-200 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">f(x) =</label>
          <input value={fx} onChange={e => setFx(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">f′(x) =</label>
          <input value={fpx} onChange={e => setFpx(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">x₀ =</label>
          <input type="number" step="0.1" value={x0} onChange={e => setX0(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ε =</label>
          <select value={eps} onChange={e => setEps(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
            <option value={1e-4}>10⁻⁴</option><option value={1e-6}>10⁻⁶</option>
            <option value={1e-8}>10⁻⁸</option><option value={1e-10}>10⁻¹⁰</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={run} className="bg-[#04aa6d] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#088a5b] transition-colors">
          ▶ Exécuter
        </button>
        {iters.length > 0 && (
          <>
            <button onClick={() => setStepIdx(Math.max(0, stepIdx <= 0 ? 0 : stepIdx - 1))}
              className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100">◀ Précédent</button>
            <button onClick={() => setStepIdx(Math.min(iters.length - 1, stepIdx + 1))}
              className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100">Suivant ▶</button>
          </>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-3">{error}</div>}
      {result && <div className="success-box text-sm mb-3"><strong>✓ {result}</strong></div>}

      {iters.length > 0 && (
        <>
          {stepIdx >= 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3 text-sm">
              <p className="font-bold mb-2">Étape {stepIdx + 1}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div><span className="text-gray-500">xₙ =</span> <strong>{iters[stepIdx].xn.toFixed(8)}</strong></div>
                <div><span className="text-gray-500">f(xₙ) =</span> <strong>{iters[stepIdx].fxn.toFixed(8)}</strong></div>
                <div><span className="text-gray-500">f′(xₙ) =</span> <strong>{iters[stepIdx].fpxn.toFixed(8)}</strong></div>
                <div className="col-span-2"><span className="text-gray-500">xₙ₊₁ = xₙ − f(xₙ)/f′(xₙ) =</span> <strong className="text-purple-700">{iters[stepIdx].xn1.toFixed(10)}</strong></div>
                <div><span className="text-gray-500">erreur =</span> <strong>{iters[stepIdx].err.toExponential(3)}</strong></div>
              </div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="data-table text-xs">
              <thead>
                <tr><th>n</th><th>xₙ</th><th>f(xₙ)</th><th>f′(xₙ)</th><th>xₙ₊₁</th><th>|xₙ₊₁−xₙ|</th></tr>
              </thead>
              <tbody>
                {(stepIdx >= 0 ? iters.slice(0, stepIdx + 1) : iters).map((it, i) => (
                  <tr key={i} className={i === stepIdx ? "bg-yellow-100" : ""}>
                    <td className="font-bold">{it.n}</td>
                    <td>{it.xn.toFixed(8)}</td>
                    <td>{it.fxn.toFixed(8)}</td>
                    <td>{it.fpxn.toFixed(6)}</td>
                    <td className="font-bold text-purple-700">{it.xn1.toFixed(10)}</td>
                    <td>{it.err.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-purple-50 border border-purple-200 rounded p-3 text-sm">
            <p className="font-bold mb-1">💡 Ce que fait réellement l'algorithme</p>
            <p>
              À chaque étape, on trace la tangente à la courbe f au point xₙ,
              et on calcule où cette tangente croise l'axe des x. Ce point de croisement
              devient la nouvelle approximation xₙ₊₁. La méthode converge{" "}
              <strong>quadratiquement</strong> : si l'erreur est 10⁻³, après une itération
              elle devient 10⁻⁶, puis 10⁻¹², etc. C'est pourquoi Newton est
              beaucoup plus rapide que la dichotomie.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
