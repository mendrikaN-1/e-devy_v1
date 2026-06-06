"use client";
import { useState, useCallback } from "react";

/* ─── Types ─────────────────────────────────────────── */
type VarMap = Record<string, number | string>;
type Step = {
  lineIdx: number;
  line: string;
  vars: VarMap;
  output: string[];
  iteration: number;
  explanation: string;
};

/* ─── Preset examples ────────────────────────────────── */
const PRESETS = [
  {
    label: "Somme 1 à 5",
    code: `somme <- 0
Pour i <- 1 à 5
  somme <- somme + i
FinPour
Ecrire(somme)`,
  },
  {
    label: "Factorielle 5",
    code: `n <- 5
f <- 1
Pour i <- 2 à n
  f <- f * i
FinPour
Ecrire(f)`,
  },
  {
    label: "Maximum a,b,c",
    code: `a <- 12
b <- 7
c <- 19
Si a > b Alors
  max <- a
Sinon
  max <- b
FinSi
Si c > max Alors
  max <- c
FinSi
Ecrire(max)`,
  },
  {
    label: "Nombres pairs",
    code: `Pour i <- 1 à 10
  Si i mod 2 = 0 Alors
    Ecrire(i)
  FinSi
FinPour`,
  },
  {
    label: "Boucle TantQue",
    code: `n <- 1
TantQue n <= 5 Faire
  Ecrire(n)
  n <- n + 1
FinTantQue`,
  },
  {
    label: "Fibonacci 8 termes",
    code: `a <- 0
b <- 1
Ecrire(a)
Ecrire(b)
Pour i <- 3 à 8
  c <- a + b
  Ecrire(c)
  a <- b
  b <- c
FinPour`,
  },
];

/* ─── Safe expression evaluator ─────────────────────── */
function evalExpr(expr: string, vars: VarMap): number | string {
  let e = expr.trim();

  // String literal
  if ((e.startsWith("'") && e.endsWith("'")) || (e.startsWith('"') && e.endsWith('"'))) {
    return e.slice(1, -1);
  }

  // Replace variable names
  const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of sortedKeys) {
    const val = vars[k];
    const safeVal = typeof val === "string" ? `"${val}"` : String(val);
    e = e.replace(new RegExp(`\\b${k}\\b`, "gi"), safeVal);
  }

  // Normalize operators
  e = e.replace(/\bmod\b/gi, "%")
       .replace(/\bET\b/gi, "&&")
       .replace(/\bOU\b/gi, "||")
       .replace(/\bNON\b/gi, "!")
       .replace(/←/g, "")
       .replace(/π/g, "Math.PI")
       .replace(/sqrt\(/gi, "Math.sqrt(")
       .replace(/abs\(/gi, "Math.abs(");

  try {
    // eslint-disable-next-line no-new-func
    const result = new Function(`"use strict"; return (${e});`)();
    return result;
  } catch {
    return NaN;
  }
}

/* ─── Main interpreter ──────────────────────────────── */
function interpret(code: string): Step[] {
  const rawLines = code.split("\n");
  const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
  const steps: Step[] = [];
  let vars: VarMap = {};
  let output: string[] = [];
  let iteration = 0;
  let ip = 0; // instruction pointer
  const MAX_STEPS = 200;

  // Simple recursive interpreter
  function execLines(lineList: string[], startIp: number): number {
    let i = startIp;
    while (i < lineList.length && steps.length < MAX_STEPS) {
      const raw = lineList[i];
      const line = raw.trim();

      // Skip empty / comments
      if (!line || line.startsWith("//") || line.startsWith("/*")) { i++; continue; }

      // ── Assignment: var <- expr  or  var = expr
      const assignMatch = line.match(/^(\w+)\s*(?:<-|←|=)\s*(.+)$/i);
      if (assignMatch && !line.match(/^(Si|TantQue|Pour|Sinon|FinSi|FinTantQue|FinPour|Ecrire|Lire|Repeter|JusquA)/i)) {
        const [, varName, exprRaw] = assignMatch;
        const val = evalExpr(exprRaw, vars);
        vars = { ...vars, [varName.toLowerCase()]: val };
        steps.push({
          lineIdx: i, line: raw,
          vars: { ...vars },
          output: [...output],
          iteration,
          explanation: `Variable "${varName}" reçoit la valeur ${val}`,
        });
        i++; continue;
      }

      // ── Ecrire(...)
      const ecrireMatch = line.match(/^Ecrire\s*\((.+)\)$/i);
      if (ecrireMatch) {
        const args = ecrireMatch[1].split(",").map(a => {
          const v = evalExpr(a.trim(), vars);
          return String(v);
        });
        const msg = args.join(" ");
        output = [...output, msg];
        steps.push({
          lineIdx: i, line: raw,
          vars: { ...vars },
          output: [...output],
          iteration,
          explanation: `Affichage : "${msg}"`,
        });
        i++; continue;
      }

      // ── Pour var <- debut à fin
      const pourMatch = line.match(/^Pour\s+(\w+)\s*(?:<-|←|=)\s*(.+?)\s+[àa]\s+(.+)$/i);
      if (pourMatch) {
        const [, counter, startExpr, endExpr] = pourMatch;
        const start = Number(evalExpr(startExpr, vars));
        const end = Number(evalExpr(endExpr, vars));

        // Find matching FinPour
        let depth = 1, j = i + 1;
        const bodyLines: string[] = [];
        while (j < lineList.length && depth > 0) {
          const bl = lineList[j].trim();
          if (/^Pour\b/i.test(bl)) depth++;
          if (/^FinPour$/i.test(bl)) { depth--; if (depth === 0) break; }
          bodyLines.push(lineList[j]);
          j++;
        }

        vars = { ...vars, [counter.toLowerCase()]: start };
        steps.push({
          lineIdx: i, line: raw,
          vars: { ...vars },
          output: [...output],
          iteration,
          explanation: `Initialisation boucle POUR : ${counter} de ${start} à ${end}`,
        });

        for (let cv = start; cv <= end && steps.length < MAX_STEPS; cv++) {
          iteration++;
          vars = { ...vars, [counter.toLowerCase()]: cv };
          steps.push({
            lineIdx: i, line: raw,
            vars: { ...vars },
            output: [...output],
            iteration,
            explanation: `Itération ${cv - start + 1} : ${counter} = ${cv}`,
          });
          execLines(bodyLines, 0);
        }
        i = j + 1; continue;
      }

      // ── TantQue condition Faire
      const tantqueMatch = line.match(/^TantQue\s+(.+?)\s+Faire$/i);
      if (tantqueMatch) {
        const [, condExpr] = tantqueMatch;
        let depth2 = 1; let j2 = i + 1;
        const bodyLines2: string[] = [];
        while (j2 < lineList.length && depth2 > 0) {
          const bl = lineList[j2].trim();
          if (/^TantQue\b/i.test(bl)) depth2++;
          if (/^FinTantQue$/i.test(bl)) { depth2--; if (depth2 === 0) break; }
          bodyLines2.push(lineList[j2]);
          j2++;
        }

        steps.push({
          lineIdx: i, line: raw,
          vars: { ...vars },
          output: [...output],
          iteration,
          explanation: `Début boucle TANTQUE : vérifier "${condExpr}"`,
        });

        while (steps.length < MAX_STEPS) {
          const cond = evalExpr(condExpr, vars);
          if (!cond) {
            steps.push({
              lineIdx: i, line: raw,
              vars: { ...vars },
              output: [...output],
              iteration,
              explanation: `Condition TANTQUE fausse : "${condExpr}" → fin de boucle`,
            });
            break;
          }
          iteration++;
          steps.push({
            lineIdx: i, line: raw,
            vars: { ...vars },
            output: [...output],
            iteration,
            explanation: `Condition TANTQUE vraie (itération ${iteration}) → exécution du bloc`,
          });
          execLines(bodyLines2, 0);
        }
        i = j2 + 1; continue;
      }

      // ── Si condition Alors
      const siMatch = line.match(/^Si\s+(.+?)\s+Alors$/i);
      if (siMatch) {
        const [, condExpr] = siMatch;
        // Find Sinon / FinSi
        let depth3 = 1, j3 = i + 1;
        const thenLines: string[] = [];
        const elseLines: string[] = [];
        let inElse = false;
        while (j3 < lineList.length && depth3 > 0) {
          const bl = lineList[j3].trim();
          if (/^Si\b/i.test(bl)) depth3++;
          if (/^FinSi$/i.test(bl)) { depth3--; if (depth3 === 0) break; }
          if (/^Sinon$/i.test(bl) && depth3 === 1) { inElse = true; j3++; continue; }
          if (!inElse) thenLines.push(lineList[j3]);
          else elseLines.push(lineList[j3]);
          j3++;
        }

        const condResult = evalExpr(condExpr, vars);
        steps.push({
          lineIdx: i, line: raw,
          vars: { ...vars },
          output: [...output],
          iteration,
          explanation: `Test SI : "${condExpr}" → ${condResult ? "VRAI → branche ALORS" : "FAUX → branche SINON"}`,
        });

        if (condResult) execLines(thenLines, 0);
        else if (elseLines.length > 0) execLines(elseLines, 0);

        i = j3 + 1; continue;
      }

      // ── Skip structural keywords
      if (/^(FinSi|FinTantQue|FinPour|Sinon|Lire)$/i.test(line)) { i++; continue; }

      i++;
    }
    return i;
  }

  try {
    execLines(lines, ip);
  } catch (e) {
    // execution error — return what we have
  }

  return steps;
}

/* ─── Component ─────────────────────────────────────── */
export default function AlgoSimulator() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [mode, setMode] = useState<"idle" | "all" | "step">("idle");
  const [error, setError] = useState("");

  const run = useCallback((runMode: "all" | "step") => {
    setError("");
    try {
      const s = interpret(code);
      if (s.length === 0) { setError("Aucune étape détectée. Vérifiez la syntaxe."); return; }
      setSteps(s);
      setMode(runMode);
      setStepIdx(runMode === "step" ? 0 : s.length - 1);
    } catch {
      setError("Erreur d'exécution.");
    }
  }, [code]);

  const reset = () => { setSteps([]); setStepIdx(-1); setMode("idle"); setError(""); };

  const currentStep = steps[stepIdx] ?? null;
  const displayedSteps = mode === "all" ? steps : steps.slice(0, stepIdx + 1);
  const finalOutput = steps.length > 0 ? steps[steps.length - 1].output : [];

  // Generate natural explanation from all steps
  const generateExplanation = () => {
    if (steps.length === 0) return "";
    const iterCount = steps.filter(s => s.explanation.startsWith("Itération") || s.explanation.startsWith("Condition TANTQUE vraie")).length;
    const outputs = finalOutput;
    const varNames = Object.keys(steps[steps.length - 1]?.vars ?? {});
    let expl = `Cet algorithme s'exécute en ${steps.length} étapes`;
    if (iterCount > 0) expl += ` dont ${iterCount} itération(s) de boucle`;
    expl += ".";
    if (outputs.length > 0) expl += ` Il affiche : ${outputs.join(", ")}.`;
    if (varNames.length > 0) {
      const last = steps[steps.length - 1].vars;
      expl += ` À la fin, les variables sont : ${varNames.map(k => `${k} = ${last[k]}`).join(", ")}.`;
    }
    return expl;
  };

  return (
    <div className="space-y-4">
      {/* Presets */}
      <div>
        <p className="text-xs font-semibold text-gray-500 mb-2">EXEMPLES :</p>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map(p => (
            <button key={p.label}
              onClick={() => { setCode(p.code); reset(); }}
              className="text-xs px-3 py-1 bg-gray-100 hover:bg-[#04aa6d] hover:text-white rounded border border-gray-200 transition-colors">
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: editor */}
        <div>
          <label className="text-xs font-semibold text-gray-600 block mb-1">
            Pseudo-code (syntaxe inspirée du cours S3) :
          </label>
          <textarea
            value={code}
            onChange={e => { setCode(e.target.value); reset(); }}
            rows={14}
            className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm resize-y focus:outline-none focus:border-[#04aa6d]"
            spellCheck={false}
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            <button onClick={() => run("all")}
              className="bg-[#04aa6d] text-white px-4 py-1.5 rounded text-sm font-semibold hover:bg-[#088a5b] transition-colors">
              ▶ Exécuter
            </button>
            <button onClick={() => run("step")}
              className="border border-[#04aa6d] text-[#04aa6d] px-4 py-1.5 rounded text-sm font-semibold hover:bg-green-50 transition-colors">
              ▷ Pas à Pas
            </button>
            {mode === "step" && steps.length > 0 && (
              <>
                <button onClick={() => setStepIdx(i => Math.max(0, i - 1))}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                  disabled={stepIdx === 0}>◀</button>
                <span className="text-xs text-gray-500 self-center">
                  Étape {stepIdx + 1}/{steps.length}
                </span>
                <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                  disabled={stepIdx === steps.length - 1}>▶</button>
              </>
            )}
            {mode !== "idle" && (
              <button onClick={reset}
                className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 text-gray-600">
                ↺ Reset
              </button>
            )}
          </div>

          {error && (
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded">
              {error}
            </div>
          )}

          {/* Syntax helper */}
          <div className="mt-4 border border-gray-200 rounded p-3 bg-gray-50">
            <p className="text-xs font-bold text-gray-500 mb-2">SYNTAXE SUPPORTÉE :</p>
            <pre className="text-xs text-gray-600 leading-relaxed">{`variable <- expression     (affectation)
Ecrire(variable)           (affichage)
Pour i <- 1 à n            (boucle POUR)
FinPour
TantQue condition Faire    (boucle TANTQUE)
FinTantQue
Si condition Alors         (condition)
Sinon
FinSi
Opérateurs : + - * / mod
Comparateurs : > < >= <= = !=`}</pre>
          </div>
        </div>

        {/* Right: current step visualization */}
        <div>
          {currentStep ? (
            <div className="space-y-3">
              {/* Current line */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">LIGNE EN COURS :</p>
                <div className="bg-yellow-50 border border-yellow-400 rounded px-3 py-2">
                  <code className="text-sm font-mono font-bold">{currentStep.line}</code>
                </div>
                <p className="text-xs text-gray-600 mt-1 italic">→ {currentStep.explanation}</p>
              </div>

              {/* Memory table */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  MÉMOIRE DES VARIABLES {mode === "step" ? `(étape ${stepIdx + 1})` : "(final)"} :
                </p>
                {Object.keys(currentStep.vars).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Aucune variable encore</p>
                ) : (
                  <table className="data-table text-sm w-full">
                    <thead>
                      <tr><th>Variable</th><th>Valeur</th><th>Type</th></tr>
                    </thead>
                    <tbody>
                      {Object.entries(currentStep.vars).map(([k, v]) => (
                        <tr key={k}>
                          <td className="font-mono font-bold">{k}</td>
                          <td className="font-mono text-blue-700 font-bold">{String(v)}</td>
                          <td className="text-gray-500 text-xs">{typeof v === "number" ? (Number.isInteger(v) ? "Entier" : "Réel") : "Chaîne"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Output so far */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  SORTIES {mode === "step" ? "JUSQU'ICI" : "FINALES"} :
                </p>
                {currentStep.output.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Rien affiché encore</p>
                ) : (
                  <div className="bg-gray-900 text-green-400 rounded p-3 font-mono text-sm">
                    {currentStep.output.map((o, i) => (
                      <div key={i}>› {o}</div>
                    ))}
                  </div>
                )}
              </div>

              {/* Iteration count */}
              {currentStep.iteration > 0 && (
                <div className="text-xs text-gray-600 bg-blue-50 border border-blue-200 rounded px-3 py-1">
                  Itération de boucle n° <strong>{currentStep.iteration}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
              <p className="text-sm">Cliquez sur <strong>Exécuter</strong> ou <strong>Pas à Pas</strong></p>
              <p className="text-xs mt-1">pour voir la simulation</p>
            </div>
          )}
        </div>
      </div>

      {/* All steps history */}
      {displayedSteps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            HISTORIQUE DES ÉTAPES ({displayedSteps.length}/{steps.length}) :
          </p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              <table className="data-table text-xs w-full">
                <thead className="sticky top-0">
                  <tr>
                    <th className="w-8">#</th>
                    <th>Ligne exécutée</th>
                    <th>Explication</th>
                    <th>Variables clés</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedSteps.map((s, i) => (
                    <tr key={i}
                      className={`cursor-pointer transition-colors ${i === stepIdx ? "bg-yellow-100" : "hover:bg-gray-50"}`}
                      onClick={() => { setStepIdx(i); setMode("step"); }}>
                      <td className="font-bold text-gray-500">{i + 1}</td>
                      <td><code className="font-mono">{s.line.trim()}</code></td>
                      <td className="text-gray-600">{s.explanation}</td>
                      <td className="font-mono text-blue-700">
                        {Object.entries(s.vars).slice(0, 3).map(([k, v]) => `${k}=${v}`).join(", ")}
                        {Object.keys(s.vars).length > 3 ? "…" : ""}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Logical explanation */}
      {steps.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="font-bold text-sm mb-1">💡 Explication logique</p>
          <p className="text-sm text-gray-700">{generateExplanation()}</p>
          {finalOutput.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-500">RÉSULTAT FINAL :</p>
              <div className="bg-gray-900 text-green-400 rounded p-2 font-mono text-sm mt-1">
                {finalOutput.map((o, i) => <div key={i}>› {o}</div>)}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Total : <strong>{steps.length} étapes</strong> •{" "}
            <strong>{Object.keys(steps[steps.length - 1]?.vars ?? {}).length} variables</strong> •{" "}
            <strong>{finalOutput.length} sortie(s)</strong>
          </p>
        </div>
      )}
    </div>
  );
}
