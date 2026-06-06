"use client";
import { useState, useCallback, useRef, useEffect } from "react";

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

/* ─── VS Code-style syntax highlighting ─────────────── */
const KEYWORDS_MOT  = /\b(Pour|FinPour|TantQue|FinTantQue|Faire|Si|Alors|Sinon|FinSi|Repeter|JusquA|à|de|par)\b/gi;
const KEYWORDS_FN   = /\b(Ecrire|Lire|sqrt|abs|mod)\b/gi;
const KEYWORDS_OP   = /(<-|←|>=|<=|!=|=|>|<|\+|-|\*|\/)/g;
const KEYWORDS_NUM  = /\b(\d+(\.\d+)?)\b/g;
const KEYWORDS_STR  = /('.*?'|".*?")/g;
const KEYWORDS_CMT  = /(\/\/.*|\/\*.*?\*\/)/g;

function highlightLine(line: string): React.ReactNode {
  // We'll tokenize character by character using regex splits
  // Build an array of {text, color} tokens
  type Token = { text: string; cls: string };
  const tokens: Token[] = [];

  // Process with ordered regex replacements
  // Strategy: find first match, emit plain text before it, emit colored token, advance
  const rules: { re: RegExp; cls: string }[] = [
    { re: KEYWORDS_CMT,  cls: "text-[#6a9955]" },   // green - comments
    { re: KEYWORDS_STR,  cls: "text-[#ce9178]" },   // orange - strings
    { re: KEYWORDS_MOT,  cls: "text-[#c586c0]" },   // purple - keywords
    { re: KEYWORDS_FN,   cls: "text-[#dcdcaa]" },   // yellow - functions
    { re: KEYWORDS_NUM,  cls: "text-[#b5cea8]" },   // light green - numbers
    { re: KEYWORDS_OP,   cls: "text-[#569cd6]" },   // blue - operators
  ];

  let remaining = line;
  let key = 0;

  while (remaining.length > 0) {
    let earliest: { index: number; len: number; cls: string } | null = null;

    for (const rule of rules) {
      rule.re.lastIndex = 0;
      const m = rule.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index)) {
        earliest = { index: m.index, len: m[0].length, cls: rule.cls };
      }
    }

    if (!earliest) {
      tokens.push({ text: remaining, cls: "text-[#d4d4d4]" });
      break;
    }

    if (earliest.index > 0) {
      tokens.push({ text: remaining.slice(0, earliest.index), cls: "text-[#d4d4d4]" });
    }
    tokens.push({ text: remaining.slice(earliest.index, earliest.index + earliest.len), cls: earliest.cls });
    remaining = remaining.slice(earliest.index + earliest.len);
  }

  return (
    <>
      {tokens.map((t, i) => (
        <span key={i} className={t.cls}>{t.text}</span>
      ))}
    </>
  );
}

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
  if ((e.startsWith("'") && e.endsWith("'")) || (e.startsWith('"') && e.endsWith('"'))) {
    return e.slice(1, -1);
  }
  const sortedKeys = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of sortedKeys) {
    const val = vars[k];
    const safeVal = typeof val === "string" ? `"${val}"` : String(val);
    e = e.replace(new RegExp(`\\b${k}\\b`, "gi"), safeVal);
  }
  e = e.replace(/\bmod\b/gi, "%")
       .replace(/\bET\b/gi, "&&")
       .replace(/\bOU\b/gi, "||")
       .replace(/\bNON\b/gi, "!")
       .replace(/←/g, "")
       .replace(/π/g, "Math.PI")
       .replace(/sqrt\(/gi, "Math.sqrt(")
       .replace(/abs\(/gi, "Math.abs(");
  try {
    const result = new Function(`"use strict"; return (${e});`)();
    return result;
  } catch {
    return NaN;
  }
}

/* ─── Main interpreter ──────────────────────────────── */
function interpret(code: string, breakpoints: Set<number>): { steps: Step[]; breakHit: number | null } {
  const rawLines = code.split("\n");
  const lines = rawLines.map(l => l.trim()).filter(l => l.length > 0);
  const steps: Step[] = [];
  let vars: VarMap = {};
  let output: string[] = [];
  let iteration = 0;
  const MAX_STEPS = 300;

  function execLines(lineList: string[], startIp: number): void {
    let i = startIp;
    while (i < lineList.length && steps.length < MAX_STEPS) {
      const raw = lineList[i];
      const line = raw.trim();

      if (!line || line.startsWith("//") || line.startsWith("/*")) { i++; continue; }

      const assignMatch = line.match(/^(\w+)\s*(?:<-|←|=)\s*(.+)$/i);
      if (assignMatch && !line.match(/^(Si|TantQue|Pour|Sinon|FinSi|FinTantQue|FinPour|Ecrire|Lire|Repeter|JusquA)/i)) {
        const [, varName, exprRaw] = assignMatch;
        const val = evalExpr(exprRaw, vars);
        vars = { ...vars, [varName.toLowerCase()]: val };
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Variable "${varName}" reçoit la valeur ${val}` });
        i++; continue;
      }

      const ecrireMatch = line.match(/^Ecrire\s*\((.+)\)$/i);
      if (ecrireMatch) {
        const args = ecrireMatch[1].split(",").map(a => String(evalExpr(a.trim(), vars)));
        const msg = args.join(" ");
        output = [...output, msg];
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Affichage : "${msg}"` });
        i++; continue;
      }

      const pourMatch = line.match(/^Pour\s+(\w+)\s*(?:<-|←|=)\s*(.+?)\s+[àa]\s+(.+)$/i);
      if (pourMatch) {
        const [, counter, startExpr, endExpr] = pourMatch;
        const start = Number(evalExpr(startExpr, vars));
        const end = Number(evalExpr(endExpr, vars));
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
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Initialisation boucle POUR : ${counter} de ${start} à ${end}` });
        for (let cv = start; cv <= end && steps.length < MAX_STEPS; cv++) {
          iteration++;
          vars = { ...vars, [counter.toLowerCase()]: cv };
          steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Itération ${cv - start + 1} : ${counter} = ${cv}` });
          execLines(bodyLines, 0);
        }
        i = j + 1; continue;
      }

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
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Début boucle TANTQUE : vérifier "${condExpr}"` });
        while (steps.length < MAX_STEPS) {
          const cond = evalExpr(condExpr, vars);
          if (!cond) {
            steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Condition TANTQUE fausse → fin de boucle` });
            break;
          }
          iteration++;
          steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Condition TANTQUE vraie (itération ${iteration}) → bloc exécuté` });
          execLines(bodyLines2, 0);
        }
        i = j2 + 1; continue;
      }

      const siMatch = line.match(/^Si\s+(.+?)\s+Alors$/i);
      if (siMatch) {
        const [, condExpr] = siMatch;
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
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Test SI : "${condExpr}" → ${condResult ? "VRAI → branche ALORS" : "FAUX → branche SINON"}` });
        if (condResult) execLines(thenLines, 0);
        else if (elseLines.length > 0) execLines(elseLines, 0);
        i = j3 + 1; continue;
      }

      if (/^(FinSi|FinTantQue|FinPour|Sinon|Lire)$/i.test(line)) { i++; continue; }
      i++;
    }
  }

  try { execLines(lines, 0); } catch { /* return what we have */ }
  return { steps, breakHit: null };
}

/* ─── Syntax-highlighted read-only code viewer ─────── */
function CodeViewer({
  code,
  currentLineIdx,
  breakpoints,
  onToggleBreakpoint,
}: {
  code: string;
  currentLineIdx: number | null;
  breakpoints: Set<number>;
  onToggleBreakpoint: (idx: number) => void;
}) {
  const codeLines = code.split("\n");

  return (
    <div className="rounded overflow-hidden border border-[#3c3c3c] font-mono text-sm bg-[#1e1e1e] select-none">
      {/* VS Code top bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c]">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="text-[#858585] text-xs ml-2">algorithme.pseudo</span>
      </div>

      <div className="overflow-auto max-h-72">
        {codeLines.map((line, idx) => {
          const isCurrent = currentLineIdx === idx;
          const isBreakpoint = breakpoints.has(idx);
          return (
            <div
              key={idx}
              className={`flex items-stretch group ${isCurrent ? "bg-[#264f78]" : "hover:bg-[#2a2d2e]"}`}
            >
              {/* Breakpoint dot column */}
              <div
                className="w-5 flex items-center justify-center cursor-pointer shrink-0"
                onClick={() => onToggleBreakpoint(idx)}
                title="Cliquer pour ajouter/retirer un point d'arrêt"
              >
                {isBreakpoint ? (
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 block" />
                ) : (
                  <span className="w-2.5 h-2.5 rounded-full bg-transparent group-hover:bg-red-800 block" />
                )}
              </div>

              {/* Line number */}
              <div className="w-8 text-right pr-2 text-[#858585] text-xs leading-6 shrink-0 select-none">
                {idx + 1}
              </div>

              {/* Arrow for current line */}
              <div className="w-4 text-center leading-6 shrink-0 text-yellow-400 text-xs">
                {isCurrent ? "→" : " "}
              </div>

              {/* Code content */}
              <div className="flex-1 leading-6 pl-1 whitespace-pre">
                {highlightLine(line || " ")}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────── */
export default function AlgoSimulator() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [mode, setMode] = useState<"idle" | "all" | "step">("idle");
  const [error, setError] = useState("");
  const [breakpoints, setBreakpoints] = useState<Set<number>>(new Set());
  const [activeTab, setActiveTab] = useState<"editor" | "debug">("editor");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const toggleBreakpoint = useCallback((idx: number) => {
    setBreakpoints(prev => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setSteps([]); setStepIdx(-1); setMode("idle"); setError("");
  }, []);

  const run = useCallback((runMode: "all" | "step") => {
    setError("");
    try {
      const { steps: s } = interpret(code, breakpoints);
      if (s.length === 0) { setError("Aucune étape détectée. Vérifiez la syntaxe."); return; }
      setSteps(s);
      setMode(runMode);
      setStepIdx(runMode === "step" ? 0 : s.length - 1);
      if (runMode === "step") setActiveTab("debug");
    } catch {
      setError("Erreur d'exécution.");
    }
  }, [code, breakpoints]);

  // Run to next breakpoint
  const runToBreakpoint = useCallback(() => {
    if (steps.length === 0) return;
    const codeLines = code.split("\n");
    let next = stepIdx + 1;
    while (next < steps.length) {
      // find the original line index in code
      const lineText = steps[next].line.trim();
      const lineIdx = codeLines.findIndex(l => l.trim() === lineText && breakpoints.has(codeLines.indexOf(l)));
      if (lineIdx >= 0 && breakpoints.has(lineIdx)) break;
      next++;
    }
    setStepIdx(Math.min(next, steps.length - 1));
  }, [steps, stepIdx, code, breakpoints]);

  const currentStep = steps[stepIdx] ?? null;
  const displayedSteps = mode === "all" ? steps : steps.slice(0, stepIdx + 1);
  const finalOutput = steps.length > 0 ? steps[steps.length - 1].output : [];

  // Current line in the original code (0-indexed)
  const currentCodeLine = currentStep
    ? code.split("\n").findIndex(l => l.trim() === currentStep.line.trim() && l.trim().length > 0)
    : null;

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
        {/* ── Left panel : Editor + Viewer ── */}
        <div>
          {/* Tab toggle */}
          <div className="flex border-b border-gray-200 mb-2">
            {(["editor", "debug"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`text-xs px-4 py-1.5 font-semibold transition-colors ${activeTab === tab ? "border-b-2 border-[#04aa6d] text-[#04aa6d]" : "text-gray-500 hover:text-gray-700"}`}>
                {tab === "editor" ? "✏️ Éditeur" : "🐛 Débogueur"}
              </button>
            ))}
          </div>

          {activeTab === "editor" ? (
            <>
              <label className="text-xs font-semibold text-gray-600 block mb-1">
                Pseudo-code (syntaxe S3) — cliquez sur un numéro de ligne pour un breakpoint :
              </label>
              {/* Highlighted view (read-only, shows breakpoints) */}
              <CodeViewer
                code={code}
                currentLineIdx={mode !== "idle" ? currentCodeLine : null}
                breakpoints={breakpoints}
                onToggleBreakpoint={toggleBreakpoint}
              />
              {/* Editable textarea below */}
              <textarea
                ref={textareaRef}
                value={code}
                onChange={e => { setCode(e.target.value); reset(); }}
                rows={5}
                className="w-full border border-gray-300 rounded px-3 py-2 font-mono text-sm resize-y focus:outline-none focus:border-[#04aa6d] mt-2 bg-gray-50"
                spellCheck={false}
                placeholder="Modifiez votre code ici..."
              />
            </>
          ) : (
            /* ── Debugger panel ── */
            <div className="space-y-3">
              {/* Breakpoints list */}
              <div className="border border-gray-200 rounded p-3 bg-[#1e1e1e]">
                <p className="text-xs font-bold text-[#858585] mb-2 uppercase">● Points d'arrêt (breakpoints)</p>
                {breakpoints.size === 0 ? (
                  <p className="text-xs text-[#6a9955] italic">
                    Aucun breakpoint — cliquez sur ● à gauche d'une ligne dans l'éditeur
                  </p>
                ) : (
                  <div className="space-y-1">
                    {Array.from(breakpoints).sort((a, b) => a - b).map(bp => {
                      const lineText = code.split("\n")[bp] ?? "";
                      return (
                        <div key={bp} className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-red-500 shrink-0" />
                          <span className="text-[#858585] text-xs w-6">L{bp + 1}</span>
                          <span className="text-[#d4d4d4] text-xs font-mono truncate">{lineText.trim()}</span>
                          <button onClick={() => toggleBreakpoint(bp)}
                            className="ml-auto text-[#858585] hover:text-red-400 text-xs">✕</button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Watch variables */}
              {currentStep && (
                <div className="border border-gray-200 rounded p-3 bg-[#1e1e1e]">
                  <p className="text-xs font-bold text-[#858585] mb-2 uppercase">👁 Variables (Watch)</p>
                  {Object.keys(currentStep.vars).length === 0 ? (
                    <p className="text-xs text-[#6a9955] italic">Aucune variable encore définie</p>
                  ) : (
                    <div className="space-y-1">
                      {Object.entries(currentStep.vars).map(([k, v]) => (
                        <div key={k} className="flex items-center gap-2 font-mono text-xs">
                          <span className="text-[#9cdcfe]">{k}</span>
                          <span className="text-[#858585]">=</span>
                          <span className={typeof v === "number" ? "text-[#b5cea8]" : "text-[#ce9178]"}>
                            {String(v)}
                          </span>
                          <span className="text-[#6a9955] ml-auto">
                            {typeof v === "number" ? (Number.isInteger(v) ? "entier" : "réel") : "chaîne"}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Call stack / current step */}
              {currentStep && (
                <div className="border border-gray-200 rounded p-3 bg-[#1e1e1e]">
                  <p className="text-xs font-bold text-[#858585] mb-2 uppercase">📍 Étape courante</p>
                  <div className="font-mono text-xs text-[#d4d4d4] bg-[#264f78] rounded px-2 py-1 mb-1">
                    → {currentStep.line.trim()}
                  </div>
                  <p className="text-xs text-[#6a9955] italic">{currentStep.explanation}</p>
                  {currentStep.iteration > 0 && (
                    <p className="text-xs text-[#dcdcaa] mt-1">Itération de boucle : {currentStep.iteration}</p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 mt-3 flex-wrap">
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
                  disabled={stepIdx === 0} title="Étape précédente">⏮</button>
                <span className="text-xs text-gray-500 self-center whitespace-nowrap">
                  {stepIdx + 1}/{steps.length}
                </span>
                <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40"
                  disabled={stepIdx === steps.length - 1} title="Étape suivante">⏭</button>
                {breakpoints.size > 0 && (
                  <button onClick={runToBreakpoint}
                    className="px-3 py-1.5 rounded text-sm border border-red-400 text-red-600 hover:bg-red-50 transition-colors"
                    title="Avancer jusqu'au prochain breakpoint">
                    ⏩ Breakpoint
                  </button>
                )}
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
            <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded flex items-start gap-2">
              <span>⚠</span><span>{error}</span>
            </div>
          )}

          {/* Syntax reference */}
          <div className="mt-4 border border-[#3c3c3c] rounded p-3 bg-[#1e1e1e]">
            <p className="text-xs font-bold text-[#858585] mb-2 uppercase">Syntaxe supportée</p>
            <pre className="text-xs leading-relaxed">
              <span className="text-[#9cdcfe]">variable</span>
              <span className="text-[#569cd6]"> &lt;- </span>
              <span className="text-[#d4d4d4]">expression</span>
              <span className="text-[#6a9955]">   // affectation{"\n"}</span>
              <span className="text-[#dcdcaa]">Ecrire</span>
              <span className="text-[#d4d4d4]">(variable)     </span>
              <span className="text-[#6a9955]">// affichage{"\n"}</span>
              <span className="text-[#c586c0]">Pour </span>
              <span className="text-[#9cdcfe]">i </span>
              <span className="text-[#569cd6]">&lt;- </span>
              <span className="text-[#b5cea8]">1 </span>
              <span className="text-[#c586c0]">à </span>
              <span className="text-[#9cdcfe]">n</span>
              <span className="text-[#6a9955]">    // boucle POUR{"\n"}</span>
              <span className="text-[#c586c0]">FinPour{"\n"}</span>
              <span className="text-[#c586c0]">TantQue </span>
              <span className="text-[#d4d4d4]">condition </span>
              <span className="text-[#c586c0]">Faire{"\n"}</span>
              <span className="text-[#c586c0]">FinTantQue{"\n"}</span>
              <span className="text-[#c586c0]">Si </span>
              <span className="text-[#d4d4d4]">condition </span>
              <span className="text-[#c586c0]">Alors </span>
              <span className="text-[#569cd6]">/ </span>
              <span className="text-[#c586c0]">Sinon </span>
              <span className="text-[#569cd6]">/ </span>
              <span className="text-[#c586c0]">FinSi{"\n"}</span>
              <span className="text-[#6a9955]">Opérateurs : + - * / mod{"\n"}</span>
              <span className="text-[#6a9955]">Comparateurs : {">"} {"<"} {"<="} {">="} = !={"\n"}</span>
              <span className="text-[#6a9955]">// commentaire sur une ligne</span>
            </pre>
          </div>
        </div>

        {/* ── Right panel : step visualization ── */}
        <div>
          {currentStep ? (
            <div className="space-y-3">
              {/* Current line highlight */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">LIGNE EN COURS :</p>
                <div className="bg-[#264f78] border border-[#4a8fb5] rounded px-3 py-2 font-mono text-sm">
                  {highlightLine(currentStep.line.trim())}
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
                          <td className="font-mono font-bold text-[#9cdcfe] bg-[#1e1e1e]">{k}</td>
                          <td className="font-mono font-bold text-blue-700">{String(v)}</td>
                          <td className="text-gray-500 text-xs">
                            {typeof v === "number" ? (Number.isInteger(v) ? "Entier" : "Réel") : "Chaîne"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Output */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  SORTIES {mode === "step" ? "JUSQU'ICI" : "FINALES"} :
                </p>
                {currentStep.output.length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Rien affiché encore</p>
                ) : (
                  <div className="bg-[#1e1e1e] rounded p-3 font-mono text-sm border border-[#3c3c3c]">
                    {currentStep.output.map((o, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-[#569cd6]">›</span>
                        <span className="text-[#4ec9b0]">{o}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {currentStep.iteration > 0 && (
                <div className="text-xs text-[#dcdcaa] bg-[#1e1e1e] border border-[#3c3c3c] rounded px-3 py-1">
                  Itération de boucle n° <strong>{currentStep.iteration}</strong>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 rounded p-8 text-center text-gray-400">
              <p className="text-2xl mb-2">🖥️</p>
              <p className="text-sm">Cliquez sur <strong>Exécuter</strong> ou <strong>Pas à Pas</strong></p>
              <p className="text-xs mt-1">pour voir la simulation</p>
            </div>
          )}
        </div>
      </div>

      {/* History table */}
      {displayedSteps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">
            HISTORIQUE DES ÉTAPES ({displayedSteps.length}/{steps.length}) :
          </p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="max-h-56 overflow-y-auto">
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
                      onClick={() => { setStepIdx(i); setMode("step"); setActiveTab("debug"); }}>
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
              <div className="bg-[#1e1e1e] rounded p-2 font-mono text-sm mt-1 border border-[#3c3c3c]">
                {finalOutput.map((o, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-[#569cd6]">›</span>
                    <span className="text-[#4ec9b0]">{o}</span>
                  </div>
                ))}
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
