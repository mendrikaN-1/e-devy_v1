"use client";
import { useState, useCallback } from "react";

type Method = "rectangles_g" | "rectangles_d" | "rectangles_m" | "trapezes" | "simpson";

interface IntegSimProps {
  defaultMethod: Method;
  defaultExpr?: string;
  defaultA?: number;
  defaultB?: number;
}

type StepRow = { k: number; xk_1: number; xk: number; fval: number; contrib: number; cumul: number; extra?: string };

function evalFn(expr: string, x: number): number {
  try {
    return new Function("x", `"use strict"; const exp=Math.exp,cos=Math.cos,sin=Math.sin,sqrt=Math.sqrt,abs=Math.abs,pow=Math.pow,pi=Math.PI; return ${expr};`)(x);
  } catch { return NaN; }
}

const PRESETS = [
  { label: "∫₀¹ x² dx (exact=1/3)", expr: "x*x", a: 0, b: 1 },
  { label: "∫₀¹ exp(x) dx (exact≈1.718)", expr: "Math.exp(x)", a: 0, b: 1 },
  { label: "∫₀² sin(x) dx (exact≈1.416)", expr: "Math.sin(x)", a: 0, b: 2 },
  { label: "∫₁² 1/x dx (exact=ln2≈0.693)", expr: "1/x", a: 1, b: 2 },
];

export default function IntegSimulator({ defaultMethod, defaultExpr = "x*x", defaultA = 0, defaultB = 1 }: IntegSimProps) {
  const [method, setMethod] = useState<Method>(defaultMethod);
  const [expr, setExpr] = useState(defaultExpr);
  const [a, setA] = useState(defaultA);
  const [b, setB] = useState(defaultB);
  const [M, setM] = useState(4);
  const [rows, setRows] = useState<StepRow[]>([]);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const run = useCallback(() => {
    setError(""); setResult("");
    const H = (b - a) / M;
    let I = 0;
    const newRows: StepRow[] = [];

    for (let k = 1; k <= M; k++) {
      const xk_1 = a + (k - 1) * H;
      const xk = a + k * H;
      let fval = 0, contrib = 0, extra = "";

      if (method === "rectangles_g") {
        fval = evalFn(expr, xk);
        contrib = H * fval;
        extra = `H×f(x${k}) = ${H.toFixed(4)}×${fval.toFixed(6)}`;
      } else if (method === "rectangles_d") {
        fval = evalFn(expr, xk_1);
        contrib = H * fval;
        extra = `H×f(x${k-1}) = ${H.toFixed(4)}×${fval.toFixed(6)}`;
      } else if (method === "rectangles_m") {
        const xm = (xk_1 + xk) / 2;
        fval = evalFn(expr, xm);
        contrib = H * fval;
        extra = `H×f(${xm.toFixed(4)}) = ${H.toFixed(4)}×${fval.toFixed(6)}`;
      } else if (method === "trapezes") {
        const fk_1 = evalFn(expr, xk_1);
        const fk = evalFn(expr, xk);
        contrib = H / 2 * (fk_1 + fk);
        fval = (fk_1 + fk) / 2;
        extra = `H/2×[${fk_1.toFixed(4)}+${fk.toFixed(4)}]`;
      } else if (method === "simpson") {
        const fk_1 = evalFn(expr, xk_1);
        const xbar = (xk_1 + xk) / 2;
        const fbar = evalFn(expr, xbar);
        const fk = evalFn(expr, xk);
        contrib = H / 6 * (fk_1 + 4 * fbar + fk);
        fval = fk_1;
        extra = `H/6×[${fk_1.toFixed(3)}+4×${fbar.toFixed(3)}+${fk.toFixed(3)}]`;
      }

      if (isNaN(contrib)) { setError("Expression invalide."); return; }
      I += contrib;
      newRows.push({ k, xk_1, xk, fval, contrib, cumul: I, extra });
    }

    setRows(newRows);
    setResult(`I ≈ ${I.toFixed(10)}`);
  }, [method, expr, a, b, M]);

  const methodLabel = {
    rectangles_g: "Rectangles à gauche",
    rectangles_d: "Rectangles à droite",
    rectangles_m: "Rectangles point milieu",
    trapezes: "Trapèzes",
    simpson: "Simpson",
  }[method];

  return (
    <div className="border border-gray-200 rounded p-4">
      <div className="mb-4">
        <p className="text-xs text-gray-500 mb-2 font-semibold">EXEMPLES :</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.label} onClick={() => { setExpr(p.expr); setA(p.a); setB(p.b); setRows([]); setResult(""); setError(""); }}
              className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-[#04aa6d] hover:text-white border border-gray-200 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">f(x) =</label>
          <input value={expr} onChange={e => setExpr(e.target.value)}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm font-mono" />
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
          <label className="text-xs font-semibold text-gray-600 block mb-1">M (sous-intervalles)</label>
          <input type="number" min={1} max={100} value={M} onChange={e => setM(Number(e.target.value))}
            className="w-full border border-gray-300 rounded px-2 py-1 text-sm" />
        </div>
      </div>

      <div className="mb-4">
        <label className="text-xs font-semibold text-gray-600 block mb-1">Variante :</label>
        <div className="flex flex-wrap gap-2">
          {(["rectangles_g","rectangles_d","rectangles_m","trapezes","simpson"] as Method[]).map(m => (
            <button key={m} onClick={() => setMethod(m)}
              className={`text-xs px-3 py-1 rounded border transition-colors ${method === m ? "bg-[#04aa6d] text-white border-[#04aa6d]" : "border-gray-300 hover:bg-gray-100"}`}>
              {{ rectangles_g:"Rect. gauche", rectangles_d:"Rect. droite", rectangles_m:"Rect. milieu", trapezes:"Trapèzes", simpson:"Simpson" }[m]}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={run} className="bg-[#04aa6d] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#088a5b] transition-colors">
          ▶ Calculer
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-3">{error}</div>}

      {result && (
        <div className="success-box text-sm mb-3">
          <strong>✓ {methodLabel} avec M={M} : {result}</strong>
          <p className="text-xs mt-1 text-gray-600">
            H = (b−a)/M = ({b}−{a})/{M} = {((b-a)/M).toFixed(6)}
          </p>
        </div>
      )}

      {rows.length > 0 && (
        <>
          <div className="overflow-x-auto">
            <table className="data-table text-xs">
              <thead>
                <tr>
                  <th>k</th><th>xₖ₋₁</th><th>xₖ</th><th>Calcul</th><th>Contribution</th><th>∑ cumulée</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.k}>
                    <td className="font-bold">{r.k}</td>
                    <td>{r.xk_1.toFixed(6)}</td>
                    <td>{r.xk.toFixed(6)}</td>
                    <td className="font-mono text-gray-600">{r.extra}</td>
                    <td className="font-bold text-green-700">{r.contrib.toFixed(8)}</td>
                    <td className="font-bold text-blue-700">{r.cumul.toFixed(8)}</td>
                  </tr>
                ))}
                <tr className="bg-green-50 font-bold">
                  <td colSpan={5} className="text-right text-sm">Total I ≈</td>
                  <td className="text-green-800 text-sm">{rows[rows.length-1]?.cumul.toFixed(10)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-green-50 border border-green-200 rounded p-3 text-sm">
            <p className="font-bold mb-1">💡 Ce que fait réellement l'algorithme</p>
            <p>
              {method.startsWith("rectangles") && `On divise [${a}, ${b}] en ${M} rectangles de largeur H=${((b-a)/M).toFixed(4)}. Sur chaque sous-intervalle, on approxime f par une constante (hauteur du rectangle). La somme de toutes les aires donne l'approximation de l'intégrale.`}
              {method === "trapezes" && `On divise [${a}, ${b}] en ${M} trapèzes. Sur chaque sous-intervalle [xₖ₋₁, xₖ], on trace la droite reliant (xₖ₋₁, f(xₖ₋₁)) à (xₖ, f(xₖ)). L'aire du trapèze = H/2×[f(xₖ₋₁)+f(xₖ)]. C'est plus précis que les rectangles car on suit mieux la courbe.`}
              {method === "simpson" && `On divise [${a}, ${b}] en ${M} sous-intervalles. Sur chaque intervalle, on ajuste une parabole passant par 3 points (xₖ₋₁, milieu, xₖ) et on intègre cette parabole. La pondération 1-4-1 donne un résultat très précis, surtout pour les fonctions régulières.`}
            </p>
          </div>
        </>
      )}
    </div>
  );
}
