"use client";
import { useState, useCallback } from "react";

type Iteration = {
  n: number;
  a: number;
  b: number;
  c: number;
  fa: number;
  fc: number;
  diff: number;
};

const PRESETS = [
  { label: "eˣ+3x−2=0  [0,1]", expr: "exp(x)+3*x-2", a: 0, b: 1, eps: 1e-6 },
  { label: "x²−2=0  [1,2]", expr: "x*x-2", a: 1, b: 2, eps: 1e-6 },
  { label: "cos(x)−x=0  [0,1]", expr: "Math.cos(x)-x", a: 0, b: 1, eps: 1e-6 },
];

function evalF(expr: string, x: number): number {
  try {
    // Safe eval with limited scope
    const fn = new Function("x", `"use strict"; const exp=Math.exp, cos=Math.cos, sin=Math.sin, sqrt=Math.sqrt, abs=Math.abs, pi=Math.PI; return ${expr};`);
    return fn(x);
  } catch {
    return NaN;
  }
}

export default function DichotomieSimulator() {
  const [expr, setExpr] = useState("exp(x)+3*x-2");
  const [a, setA] = useState(0);
  const [b, setB] = useState(1);
  const [eps, setEps] = useState(1e-6);
  const [iterations, setIterations] = useState<Iteration[]>([]);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [stepIdx, setStepIdx] = useState(-1);

  const runAll = useCallback(() => {
    setError("");
    const fa = evalF(expr, a);
    const fb = evalF(expr, b);
    if (isNaN(fa) || isNaN(fb)) { setError("Expression invalide."); return; }
    if (fa * fb > 0) { setError("f(a)×f(b) > 0 : pas de garantie de racine dans [a,b]."); return; }

    const iters: Iteration[] = [];
    let la = a, lb = b, lya = fa;
    let maxIter = 100;
    while (Math.abs(la - lb) > eps && maxIter-- > 0) {
      const c = (la + lb) / 2;
      const yc = evalF(expr, c);
      iters.push({ n: iters.length + 1, a: la, b: lb, c, fa: lya, fc: yc, diff: Math.abs(la - lb) });
      if (lya * yc < 0) { lb = c; }
      else { la = c; lya = yc; }
    }
    setIterations(iters);
    setResult(`Racine ≈ ${((a + b) / 2 + (iters.length > 0 ? iters[iters.length-1].c : 0)).toFixed(8)} — ${iters.length} itérations`);
    const last = iters[iters.length - 1];
    if (last) setResult(`Racine ≈ ${last.c.toFixed(10)} — ${iters.length} itérations`);
    setStepIdx(-1);
  }, [expr, a, b, eps]);

  return (
    <div className="border border-gray-200 rounded p-4">
      {/* Presets */}
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">EXEMPLES DU COURS :</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button key={p.label} onClick={() => { setExpr(p.expr); setA(p.a); setB(p.b); setEps(p.eps); setIterations([]); setResult(""); setError(""); }}
              className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-[#04aa6d] hover:text-white transition-colors border border-gray-200">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">f(x) =</label>
          <input value={expr} onChange={e => setExpr(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono"
            placeholder="exp(x)+3*x-2" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">a =</label>
          <input type="number" value={a} onChange={e => setA(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">b =</label>
          <input type="number" value={b} onChange={e => setB(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">ε =</label>
          <select value={eps} onChange={e => setEps(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm">
            <option value={1e-4}>10⁻⁴</option>
            <option value={1e-6}>10⁻⁶</option>
            <option value={1e-8}>10⁻⁸</option>
            <option value={1e-10}>10⁻¹⁰</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={runAll}
          className="bg-[#04aa6d] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#088a5b] transition-colors">
          ▶ Exécuter
        </button>
        {iterations.length > 0 && (
          <>
            <button onClick={() => setStepIdx(Math.max(0, stepIdx === -1 ? 0 : stepIdx - 1))}
              className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100">
              ◀ Précédent
            </button>
            <button onClick={() => setStepIdx(Math.min(iterations.length - 1, stepIdx + 1))}
              className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100">
              Suivant ▶
            </button>
            <span className="text-xs text-gray-500 self-center">
              {stepIdx >= 0 ? `Étape ${stepIdx + 1} / ${iterations.length}` : "Toutes les étapes"}
            </span>
          </>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-3">{error}</div>}

      {result && (
        <div className="success-box text-sm mb-3">
          <strong>✓ {result}</strong>
        </div>
      )}

      {iterations.length > 0 && (
        <>
          {/* Step detail */}
          {stepIdx >= 0 && (
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3 mb-3 text-sm">
              <p className="font-bold mb-1">Étape {stepIdx + 1} — Détail</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                <div><span className="text-gray-500">a =</span> <strong>{iterations[stepIdx].a.toFixed(8)}</strong></div>
                <div><span className="text-gray-500">b =</span> <strong>{iterations[stepIdx].b.toFixed(8)}</strong></div>
                <div><span className="text-gray-500">c = (a+b)/2 =</span> <strong>{iterations[stepIdx].c.toFixed(8)}</strong></div>
                <div><span className="text-gray-500">f(a) =</span> <strong>{iterations[stepIdx].fa.toFixed(6)}</strong></div>
                <div><span className="text-gray-500">f(c) =</span> <strong className={iterations[stepIdx].fc < 0 ? "text-red-600" : "text-blue-600"}>{iterations[stepIdx].fc.toFixed(6)}</strong></div>
                <div><span className="text-gray-500">|a−b| =</span> <strong>{iterations[stepIdx].diff.toExponential(3)}</strong></div>
              </div>
              <p className="mt-2 text-gray-600">
                {iterations[stepIdx].fa * iterations[stepIdx].fc < 0
                  ? "➜ f(a)×f(c) < 0 : la racine est dans [a, c] → b = c"
                  : "➜ f(a)×f(c) ≥ 0 : la racine est dans [c, b] → a = c"}
              </p>
            </div>
          )}

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="data-table text-xs">
              <thead>
                <tr>
                  <th>n</th><th>a</th><th>b</th><th>c = (a+b)/2</th><th>f(c)</th><th>|a−b|</th>
                </tr>
              </thead>
              <tbody>
                {(stepIdx >= 0 ? iterations.slice(0, stepIdx + 1) : iterations).map((it, idx) => (
                  <tr key={idx} className={idx === stepIdx ? "bg-yellow-100" : ""}>
                    <td className="font-bold">{it.n}</td>
                    <td>{it.a.toFixed(8)}</td>
                    <td>{it.b.toFixed(8)}</td>
                    <td className="font-bold text-blue-700">{it.c.toFixed(8)}</td>
                    <td className={it.fc < 0 ? "text-red-600" : "text-green-600"}>{it.fc.toFixed(6)}</td>
                    <td>{it.diff.toExponential(3)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Logical explanation */}
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded p-3 text-sm">
            <p className="font-bold mb-1">💡 Ce que fait réellement l'algorithme</p>
            <p>
              La méthode coupe l'intervalle [a,b] en deux à chaque étape et conserve
              la moitié qui contient la racine (là où f change de signe).
              Après <strong>{iterations.length} itérations</strong>, l'intervalle a une largeur de{" "}
              <strong>{Math.abs(iterations[iterations.length - 1]?.diff ?? 0).toExponential(2)}</strong>,
              ce qui donne une précision suffisante pour la racine.
              C'est comme chercher un nombre dans un dictionnaire en commençant toujours par le milieu.
            </p>
          </div>
        </>
      )}
    </div>
  );
}
