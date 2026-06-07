"use client";
import { useState, useCallback } from "react";
import exercicesData from "@/data/exercises.json";

/* ─── Types ─────────────────────────────────────── */
type TestCase = { entree: string; sortie: string };
type Exercice = {
  id: number;
  titre: string;
  categorie: string;
  niveau: string;
  enonce: string;
  entree: string;
  sortie_attendue: string;
  variables_suggerees: string[];
  pseudocode_solution: string;
  solution: string;
  explication: string;
  tests: TestCase[];
};

const NIVEAUX = ["Tous", "Débutant", "Intermédiaire", "Avancé", "Expert"];
const CATEGORIES = ["Toutes","Variables","Conditions","Boucles","Fonctions","Tableaux","Matrices","Méthodes numériques"];
const NIVEAU_COLOR: Record<string, string> = {
  Débutant: "bg-green-100 text-green-800 border-green-200",
  Intermédiaire: "bg-blue-100 text-blue-800 border-blue-200",
  Avancé: "bg-orange-100 text-orange-800 border-orange-200",
  Expert: "bg-red-100 text-red-800 border-red-200",
};
const NIVEAU_DOT: Record<string, string> = {
  Débutant: "bg-green-500",
  Intermédiaire: "bg-blue-500",
  Avancé: "bg-orange-500",
  Expert: "bg-red-500",
};

/* ─── Interpreter ─────────────────────────────── */
type VarMap = Record<string, number | string>;

function evalExpr(expr: string, vars: VarMap): number | string {
  let e = expr.trim();
  if ((e.startsWith("'") && e.endsWith("'")) || (e.startsWith('"') && e.endsWith('"')))
    return e.slice(1, -1);
  const sorted = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of sorted) {
    const v = vars[k];
    const safe = typeof v === "string" ? `"${v}"` : String(v);
    e = e.replace(new RegExp(`\\b${k}\\b`, "gi"), safe);
  }
  e = e
    .replace(/\bmod\b/gi, "%").replace(/\bET\b/gi, "&&").replace(/\bOU\b/gi, "||")
    .replace(/\bNON\b/gi, "!").replace(/←|<-/g, "").replace(/\bpi\b/gi, "Math.PI")
    .replace(/\bsqrt\b/gi, "Math.sqrt").replace(/\babs\b/gi, "Math.abs")
    .replace(/\bsin\b/gi, "Math.sin").replace(/\bcos\b/gi, "Math.cos")
    .replace(/\bexp\b/gi, "Math.exp").replace(/\bln\b/gi, "Math.log");
  try { return new Function('"use strict"; return (' + e + ');')(); } catch { return NaN; }
}

function runCode(code: string, inputs: string[]): string[] {
  const lines = code.split("\n").map(l => l.trim()).filter(Boolean);
  const output: string[] = [];
  let vars: VarMap = {};
  let inputIdx = 0;
  const nextInput = () => inputs[inputIdx++] ?? "0";

  function execLines(lineList: string[]): void {
    let i = 0, safety = 0;
    while (i < lineList.length && safety++ < 2000) {
      const line = lineList[i].trim();
      if (!line || line.startsWith("//")) { i++; continue; }

      const assign = line.match(/^(\w+)\s*(?:<-|←|=)\s*(.+)$/i);
      if (assign && !/^(Si|TantQue|Pour|Sinon|FinSi|FinTantQue|FinPour|Ecrire|Lire|Repeter|JusquA)/i.test(line)) {
        const [, name, expr] = assign;
        vars = { ...vars, [name.toLowerCase()]: evalExpr(expr, vars) };
        i++; continue;
      }

      const lire = line.match(/^Lire\s*\((.+)\)$/i);
      if (lire) {
        const names = lire[1].split(",").map(s => s.trim());
        for (const name of names) {
          const raw = nextInput();
          const num = Number(raw);
          vars = { ...vars, [name.toLowerCase()]: isNaN(num) ? raw : num };
        }
        i++; continue;
      }

      const ecr = line.match(/^Ecrire\s*\((.+)\)$/i);
      if (ecr) {
        const args = ecr[1].split(",").map(a => {
          const v = evalExpr(a.trim(), vars);
          return typeof v === "number" && !Number.isInteger(v) ? v.toFixed(4) : String(v);
        });
        output.push(args.join(" "));
        i++; continue;
      }

      const pour = line.match(/^Pour\s+(\w+)\s*(?:<-|←|=)\s*(.+?)\s+[àa]\s+(.+?)(?:\s+par\s+(.+))?$/i);
      if (pour) {
        const [, counter, startExpr, endExpr, stepExpr] = pour;
        const start = Number(evalExpr(startExpr, vars));
        const end   = Number(evalExpr(endExpr, vars));
        const step  = stepExpr ? Number(evalExpr(stepExpr, vars)) : 1;
        let depth = 1, j = i + 1;
        const body: string[] = [];
        while (j < lineList.length && depth > 0) {
          const bl = lineList[j].trim();
          if (/^Pour\b/i.test(bl)) depth++;
          if (/^FinPour$/i.test(bl)) { depth--; if (depth === 0) break; }
          body.push(lineList[j]); j++;
        }
        for (let cv = start; step > 0 ? cv <= end : cv >= end; cv += step) {
          vars = { ...vars, [counter.toLowerCase()]: cv };
          execLines(body);
          if (safety > 2000) break;
        }
        i = j + 1; continue;
      }

      const tantque = line.match(/^TantQue\s+(.+?)\s+Faire$/i);
      if (tantque) {
        const [, cond] = tantque;
        let depth2 = 1, j2 = i + 1;
        const body2: string[] = [];
        while (j2 < lineList.length && depth2 > 0) {
          const bl = lineList[j2].trim();
          if (/^TantQue\b/i.test(bl)) depth2++;
          if (/^FinTantQue$/i.test(bl)) { depth2--; if (depth2 === 0) break; }
          body2.push(lineList[j2]); j2++;
        }
        let loops = 0;
        while (evalExpr(cond, vars) && loops++ < 1000) execLines(body2);
        i = j2 + 1; continue;
      }

      const si = line.match(/^Si\s+(.+?)\s+Alors$/i);
      if (si) {
        const [, cond] = si;
        let depth3 = 1, j3 = i + 1;
        const thenL: string[] = [], elseL: string[] = [];
        let inElse = false;
        while (j3 < lineList.length && depth3 > 0) {
          const bl = lineList[j3].trim();
          if (/^Si\b/i.test(bl)) depth3++;
          if (/^FinSi$/i.test(bl)) { depth3--; if (depth3 === 0) break; }
          if (/^Sinon$/i.test(bl) && depth3 === 1) { inElse = true; j3++; continue; }
          if (!inElse) thenL.push(lineList[j3]); else elseL.push(lineList[j3]);
          j3++;
        }
        if (evalExpr(cond, vars)) execLines(thenL);
        else if (elseL.length) execLines(elseL);
        i = j3 + 1; continue;
      }

      if (/^(FinSi|FinTantQue|FinPour|Sinon|Début|Fin)$/i.test(line)) { i++; continue; }
      if (/^Variables?\b/i.test(line)) { i++; continue; }
      i++;
    }
  }

  try { execLines(lines); } catch { /* ignore */ }
  return output;
}

function normalize(s: string): string {
  return s.trim().replace(/\r/g, "").replace(/  +/g, " ").toLowerCase();
}

function checkOutput(actual: string[], expected: string): boolean {
  const act = normalize(actual.join("\n"));
  const exp = normalize(expected);
  if (act === exp) return true;
  const actR = act.replace(/\d+\.\d+/g, n => parseFloat(n).toFixed(2));
  const expR = exp.replace(/\d+\.\d+/g, n => parseFloat(n).toFixed(2));
  return actR === expR;
}

/* ─── Exercise Card ─────────────────────────────── */
function ExerciceCard({ ex }: { ex: Exercice }) {
  const [open, setOpen] = useState(false);
  const [userCode, setUserCode] = useState(
    `// Variables suggérées : ${ex.variables_suggerees.join(", ")}\n\n`
  );
  const [testResults, setTestResults] = useState<{ ok: boolean; actual: string; expected: string; label: string }[]>([]);
  const [showSolution, setShowSolution] = useState(false);
  const [ran, setRan] = useState(false);

  const runTests = useCallback(() => {
    setRan(true);
    const results = ex.tests.map((tc, idx) => {
      const inputs = tc.entree.split("\n").filter(Boolean);
      const actual = runCode(userCode, inputs);
      return { ok: checkOutput(actual, tc.sortie), actual: actual.join("\n"), expected: tc.sortie, label: `Test ${idx + 1}` };
    });
    setTestResults(results);
  }, [userCode, ex.tests]);

  const allPassed = ran && testResults.length > 0 && testResults.every(r => r.ok);
  const somePassed = ran && testResults.some(r => r.ok);

  return (
    <div className={`border rounded overflow-hidden ${allPassed ? "border-green-400" : "border-gray-200"}`}>
      {/* Header */}
      <button onClick={() => setOpen(o => !o)}
        className="w-full text-left p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
        <div className={`w-3 h-3 rounded-full shrink-0 ${
          allPassed ? "bg-green-500" : somePassed ? "bg-yellow-400" : ran ? "bg-red-400" : NIVEAU_DOT[ex.niveau] ?? "bg-gray-300"
        }`} />
        <span className="text-gray-400 font-mono text-xs w-8 shrink-0">#{ex.id}</span>
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-0.5">
            <span className="font-semibold text-sm">{ex.titre}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${NIVEAU_COLOR[ex.niveau]}`}>{ex.niveau}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{ex.categorie}</span>
          </div>
          <p className="text-xs text-gray-500 truncate">{ex.enonce}</p>
        </div>
        {ran && (
          <span className={`text-xs px-2 py-0.5 rounded font-bold shrink-0 ${allPassed ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {testResults.filter(r => r.ok).length}/{testResults.length}
          </span>
        )}
        <span className="text-gray-400 text-xs shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

            {/* Left — problem */}
            <div className="p-4 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1">📋 Énoncé</h3>
                <p className="text-sm text-gray-800">{ex.enonce}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">📥 Exemple d'entrée</h3>
                  <pre className="bg-[#1e1e1e] text-[#4ec9b0] rounded p-2 text-xs font-mono leading-relaxed">{ex.entree}</pre>
                </div>
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">📤 Sortie attendue</h3>
                  <pre className="bg-[#1e1e1e] text-[#4ec9b0] rounded p-2 text-xs font-mono leading-relaxed">{ex.sortie_attendue}</pre>
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-1">💡 Variables suggérées</h3>
                <div className="flex flex-wrap gap-1.5">
                  {ex.variables_suggerees.map(v => (
                    <span key={v} className="text-xs px-2 py-0.5 rounded bg-[#1e1e1e] text-[#9cdcfe] font-mono border border-[#3c3c3c]">{v}</span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase mb-2">🧪 Cas de tests ({ex.tests.length})</h3>
                <div className="space-y-1.5">
                  {ex.tests.slice(0, 3).map((tc, i) => (
                    <div key={i} className="bg-gray-50 border border-gray-200 rounded p-2 text-xs grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-400 block mb-0.5">Entrée :</span>
                        <code className="text-gray-700 font-mono">{tc.entree.replace(/\n/g, " ")}</code>
                      </div>
                      <div>
                        <span className="text-gray-400 block mb-0.5">Sortie :</span>
                        <code className="text-green-700 font-mono font-bold">{tc.sortie.replace(/\n/g, " ↵ ")}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — editor + results */}
            <div className="p-4 space-y-3">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wide">✏️ Votre pseudo-code</h3>

              <div className="rounded overflow-hidden border border-[#3c3c3c]">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c]">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
                  <span className="text-[#858585] text-xs ml-2 font-mono">exercice_{ex.id}.pseudo</span>
                </div>
                <textarea
                  value={userCode}
                  onChange={e => { setUserCode(e.target.value); setRan(false); setTestResults([]); }}
                  rows={10} spellCheck={false}
                  className="w-full bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-3 resize-y focus:outline-none leading-relaxed"
                  placeholder={`// Écrivez votre algorithme\n// Variables : ${ex.variables_suggerees.join(", ")}\n\nDébut\n  ...\nFin`}
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <button onClick={runTests}
                  className="bg-[#04aa6d] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#088a5b] transition-colors">
                  ▶ Tester
                </button>
                <button onClick={() => { setUserCode(`// Variables suggérées : ${ex.variables_suggerees.join(", ")}\n\n`); setRan(false); setTestResults([]); }}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 text-gray-600">
                  ↺ Reset
                </button>
                <button onClick={() => setShowSolution(s => !s)}
                  className={`px-3 py-1.5 rounded text-sm border transition-colors ${showSolution ? "bg-gray-700 text-white border-gray-700" : "border-gray-300 text-gray-600 hover:bg-gray-100"}`}>
                  {showSolution ? "▲ Cacher" : "💡 Solution"}
                </button>
              </div>

              {/* Results */}
              {ran && testResults.length > 0 && (
                <div className="space-y-2">
                  <div className={`rounded p-2.5 text-sm font-semibold flex items-center gap-2 ${
                    allPassed ? "bg-green-50 border border-green-300 text-green-800" : "bg-red-50 border border-red-300 text-red-800"
                  }`}>
                    <span>{allPassed ? "🎉" : "❌"}</span>
                    {allPassed
                      ? `Bravo ! Tous les tests passent (${testResults.length}/${testResults.length})`
                      : `${testResults.filter(r => r.ok).length}/${testResults.length} test(s) réussi(s)`}
                  </div>
                  {testResults.map((r, i) => (
                    <div key={i} className={`rounded border text-xs p-2.5 ${r.ok ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
                      <div className="flex items-center gap-2 font-semibold mb-1">
                        <span>{r.ok ? "✓" : "✗"}</span>
                        <span className={r.ok ? "text-green-700" : "text-red-700"}>{r.label}</span>
                      </div>
                      {!r.ok && (
                        <div className="grid grid-cols-2 gap-2 mt-1">
                          <div>
                            <span className="text-gray-500 block mb-0.5">Votre sortie :</span>
                            <code className="text-red-700 font-mono">{r.actual || "(vide)"}</code>
                          </div>
                          <div>
                            <span className="text-gray-500 block mb-0.5">Attendu :</span>
                            <code className="text-green-700 font-mono">{r.expected}</code>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Solution */}
              {showSolution && (
                <div className="space-y-2">
                  <div className="rounded overflow-hidden border border-[#3c3c3c]">
                    <div className="px-3 py-1.5 bg-[#2d2d2d] text-[#858585] text-xs">💡 Solution</div>
                    <pre className="bg-[#1e1e1e] text-[#d4d4d4] font-mono text-xs p-3 overflow-x-auto leading-relaxed">{ex.pseudocode_solution}</pre>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded p-3 text-xs">
                    <p className="font-bold text-blue-800 mb-1">Explication</p>
                    <p className="text-blue-900">{ex.explication}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Page ─────────────────────────────────── */
export default function ExercicesPage() {
  const [niveau, setNiveau] = useState("Tous");
  const [categorie, setCategorie] = useState("Toutes");
  const [search, setSearch] = useState("");

  const exercices = exercicesData.exercices as Exercice[];
  const filtered = exercices.filter(ex => {
    const mN = niveau === "Tous" || ex.niveau === niveau;
    const mC = categorie === "Toutes" || ex.categorie === categorie;
    const mS = !search || ex.titre.toLowerCase().includes(search.toLowerCase()) || ex.enonce.toLowerCase().includes(search.toLowerCase());
    return mN && mC && mS;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Exercices</h1>
      <p className="text-gray-500 text-sm mb-5">
        {exercices.length} exercices progressifs — Écrivez votre pseudo-code et validez-le contre des cas de test.
      </p>

      {/* Level pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["Débutant","Intermédiaire","Avancé","Expert"].map(n => (
          <button key={n} onClick={() => setNiveau(p => p === n ? "Tous" : n)}
            className={`text-xs px-3 py-1.5 rounded-full border font-semibold transition-colors ${
              niveau === n ? "bg-gray-800 text-white border-gray-800" : NIVEAU_COLOR[n]
            }`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-1.5 ${NIVEAU_DOT[n]}`} />
            {n} ({exercices.filter(e => e.niveau === n).length})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">🔍 Rechercher</label>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Titre, mot-clé..."
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:border-[#04aa6d]" />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">📊 Niveau</label>
            <select value={niveau} onChange={e => setNiveau(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
              {NIVEAUX.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 block mb-1">📁 Catégorie</label>
            <select value={categorie} onChange={e => setCategorie(e.target.value)} className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{filtered.length} exercice(s) affiché(s)</p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" />Tous réussis</span>
        <span cl