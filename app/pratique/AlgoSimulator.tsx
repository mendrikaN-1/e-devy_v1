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
type LintError = {
  line: number; // 1-indexed
  message: string;
  severity: "error" | "warning";
};

/* ─── Syntax highlighting ────────────────────────────── */
const RULES: { re: RegExp; cls: string }[] = [
  { re: /(\/\/.*)/g,                                                           cls: "text-[#6a9955]" },
  { re: /('.*?'|".*?")/g,                                                      cls: "text-[#ce9178]" },
  { re: /\b(Pour|FinPour|TantQue|FinTantQue|Faire|Si|Alors|Sinon|FinSi|Repeter|JusquA|à|de|par)\b/gi, cls: "text-[#c586c0]" },
  { re: /\b(Ecrire|Lire|sqrt|abs|mod)\b/gi,                                   cls: "text-[#dcdcaa]" },
  { re: /\b(\d+(\.\d+)?)\b/g,                                                 cls: "text-[#b5cea8]" },
  { re: /(<-|←|>=|<=|!=|=|>|<|\+|-|\*|\/)/g,                                 cls: "text-[#569cd6]" },
];

function highlightLine(line: string): React.ReactNode {
  type Token = { text: string; cls: string };
  const tokens: Token[] = [];
  let remaining = line;
  while (remaining.length > 0) {
    let earliest: { index: number; len: number; cls: string } | null = null;
    for (const rule of RULES) {
      rule.re.lastIndex = 0;
      const m = rule.re.exec(remaining);
      if (m && (earliest === null || m.index < earliest.index))
        earliest = { index: m.index, len: m[0].length, cls: rule.cls };
    }
    if (!earliest) { tokens.push({ text: remaining, cls: "text-[#d4d4d4]" }); break; }
    if (earliest.index > 0) tokens.push({ text: remaining.slice(0, earliest.index), cls: "text-[#d4d4d4]" });
    tokens.push({ text: remaining.slice(earliest.index, earliest.index + earliest.len), cls: earliest.cls });
    remaining = remaining.slice(earliest.index + earliest.len);
  }
  return <>{tokens.map((t, i) => <span key={i} className={t.cls}>{t.text}</span>)}</>;
}

/* ─── Static linter ──────────────────────────────────── */
function lintCode(code: string): LintError[] {
  const errors: LintError[] = [];
  const lines = code.split("\n");
  let pourDepth = 0, tantqueDepth = 0, siDepth = 0;
  const pourLines: number[] = [], tantqueLines: number[] = [], siLines: number[] = [];

  lines.forEach((rawLine, idx) => {
    const lineNum = idx + 1;
    const line = rawLine.trim();
    if (!line || line.startsWith("//")) return;

    // Track structure openings
    if (/^Pour\b/i.test(line)) { pourDepth++; pourLines.push(lineNum); }
    if (/^FinPour$/i.test(line)) {
      if (pourDepth === 0) errors.push({ line: lineNum, message: "FinPour sans Pour correspondant", severity: "error" });
      else { pourDepth--; pourLines.pop(); }
    }
    if (/^TantQue\b/i.test(line)) { tantqueDepth++; tantqueLines.push(lineNum); }
    if (/^FinTantQue$/i.test(line)) {
      if (tantqueDepth === 0) errors.push({ line: lineNum, message: "FinTantQue sans TantQue correspondant", severity: "error" });
      else { tantqueDepth--; tantqueLines.pop(); }
    }
    if (/^Si\b/i.test(line)) { siDepth++; siLines.push(lineNum); }
    if (/^FinSi$/i.test(line)) {
      if (siDepth === 0) errors.push({ line: lineNum, message: "FinSi sans Si correspondant", severity: "error" });
      else { siDepth--; siLines.pop(); }
    }

    // Pour syntax check
    if (/^Pour\b/i.test(line) && !/^Pour\s+\w+\s*(<-|←|=)\s*.+\s+[àa]\s+.+/i.test(line))
      errors.push({ line: lineNum, message: "Syntaxe Pour incorrecte — attendu : Pour i <- debut à fin", severity: "error" });

    // TantQue syntax check
    if (/^TantQue\b/i.test(line) && !/^TantQue\s+.+\s+Faire$/i.test(line))
      errors.push({ line: lineNum, message: "Syntaxe TantQue incorrecte — attendu : TantQue condition Faire", severity: "error" });

    // Si syntax check
    if (/^Si\b/i.test(line) && !/^Si\s+.+\s+Alors$/i.test(line))
      errors.push({ line: lineNum, message: "Syntaxe Si incorrecte — attendu : Si condition Alors", severity: "error" });

    // Ecrire without parentheses
    if (/^Ecrire\s+[^(]/i.test(line))
      errors.push({ line: lineNum, message: "Ecrire nécessite des parenthèses — ex: Ecrire(x)", severity: "error" });

    // Lire without parentheses
    if (/^Lire\s+[^(]/i.test(line))
      errors.push({ line: lineNum, message: "Lire nécessite des parenthèses — ex: Lire(x)", severity: "error" });

    // Assignment check: something <- but bad right side
    const assign = line.match(/^(\w+)\s*(<-|←)\s*(.*)$/);
    if (assign && assign[3].trim() === "")
      errors.push({ line: lineNum, message: `Affectation incomplète — la valeur après '<-' est manquante`, severity: "error" });

    // Unclosed parenthesis
    const opens = (line.match(/\(/g) || []).length;
    const closes = (line.match(/\)/g) || []).length;
    if (opens > closes)
      errors.push({ line: lineNum, message: `Parenthèse ouvrante non fermée '('`, severity: "error" });
    if (closes > opens)
      errors.push({ line: lineNum, message: `Parenthèse fermante en trop ')'`, severity: "error" });
  });

  // Unclosed blocks at end
  if (pourDepth > 0)
    pourLines.forEach(l => errors.push({ line: l, message: "Pour sans FinPour — bloc non fermé", severity: "error" }));
  if (tantqueDepth > 0)
    tantqueLines.forEach(l => errors.push({ line: l, message: "TantQue sans FinTantQue — bloc non fermé", severity: "error" }));
  if (siDepth > 0)
    siLines.forEach(l => errors.push({ line: l, message: "Si sans FinSi — bloc non fermé", severity: "error" }));

  return errors;
}

/* ─── Presets ────────────────────────────────────────── */
const PRESETS = [
  { label: "Somme 1 à 5", code: `somme <- 0\nPour i <- 1 à 5\n  somme <- somme + i\nFinPour\nEcrire(somme)` },
  { label: "Factorielle 5", code: `n <- 5\nf <- 1\nPour i <- 2 à n\n  f <- f * i\nFinPour\nEcrire(f)` },
  { label: "Maximum a,b,c", code: `a <- 12\nb <- 7\nc <- 19\nSi a > b Alors\n  max <- a\nSinon\n  max <- b\nFinSi\nSi c > max Alors\n  max <- c\nFinSi\nEcrire(max)` },
  { label: "Nombres pairs", code: `Pour i <- 1 à 10\n  Si i mod 2 = 0 Alors\n    Ecrire(i)\n  FinSi\nFinPour` },
  { label: "Boucle TantQue", code: `n <- 1\nTantQue n <= 5 Faire\n  Ecrire(n)\n  n <- n + 1\nFinTantQue` },
  { label: "Fibonacci 8 termes", code: `a <- 0\nb <- 1\nEcrire(a)\nEcrire(b)\nPour i <- 3 à 8\n  c <- a + b\n  Ecrire(c)\n  a <- b\n  b <- c\nFinPour` },
];

/* ─── Expression evaluator ───────────────────────────── */
function evalExpr(expr: string, vars: VarMap): number | string {
  let e = expr.trim();
  if ((e.startsWith("'") && e.endsWith("'")) || (e.startsWith('"') && e.endsWith('"')))
    return e.slice(1, -1);
  const sorted = Object.keys(vars).sort((a, b) => b.length - a.length);
  for (const k of sorted) {
    const v = vars[k];
    e = e.replace(new RegExp(`\\b${k}\\b`, "gi"), typeof v === "string" ? `"${v}"` : String(v));
  }
  e = e.replace(/\bmod\b/gi, "%").replace(/\bET\b/gi, "&&").replace(/\bOU\b/gi, "||")
       .replace(/\bNON\b/gi, "!").replace(/←/g, "").replace(/π/g, "Math.PI")
       .replace(/sqrt\(/gi, "Math.sqrt(").replace(/abs\(/gi, "Math.abs(");
  try { return new Function(`"use strict"; return (${e});`)(); } catch { return NaN; }
}

/* ─── Interpreter ────────────────────────────────────── */
function interpret(code: string): Step[] {
  const lines = code.split("\n").map(l => l.trim()).filter(l => l.length > 0);
  const steps: Step[] = [];
  let vars: VarMap = {};
  let output: string[] = [];
  let iteration = 0;

  function execLines(lineList: string[]): void {
    let i = 0;
    while (i < lineList.length && steps.length < 300) {
      const raw = lineList[i];
      const line = raw.trim();
      if (!line || line.startsWith("//")) { i++; continue; }

      const assignMatch = line.match(/^(\w+)\s*(?:<-|←|=)\s*(.+)$/i);
      if (assignMatch && !/^(Si|TantQue|Pour|Sinon|FinSi|FinTantQue|FinPour|Ecrire|Lire|Repeter|JusquA)/i.test(line)) {
        const [, varName, exprRaw] = assignMatch;
        const val = evalExpr(exprRaw, vars);
        vars = { ...vars, [varName.toLowerCase()]: val };
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `"${varName}" reçoit ${val}` });
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
        const body: string[] = [];
        while (j < lineList.length && depth > 0) {
          const bl = lineList[j].trim();
          if (/^Pour\b/i.test(bl)) depth++;
          if (/^FinPour$/i.test(bl)) { depth--; if (depth === 0) break; }
          body.push(lineList[j]); j++;
        }
        vars = { ...vars, [counter.toLowerCase()]: start };
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Boucle POUR : ${counter} de ${start} à ${end}` });
        for (let cv = start; cv <= end && steps.length < 300; cv++) {
          iteration++;
          vars = { ...vars, [counter.toLowerCase()]: cv };
          steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Itération ${cv - start + 1} : ${counter} = ${cv}` });
          execLines(body);
        }
        i = j + 1; continue;
      }

      const tantqueMatch = line.match(/^TantQue\s+(.+?)\s+Faire$/i);
      if (tantqueMatch) {
        const [, condExpr] = tantqueMatch;
        let depth2 = 1, j2 = i + 1;
        const body2: string[] = [];
        while (j2 < lineList.length && depth2 > 0) {
          const bl = lineList[j2].trim();
          if (/^TantQue\b/i.test(bl)) depth2++;
          if (/^FinTantQue$/i.test(bl)) { depth2--; if (depth2 === 0) break; }
          body2.push(lineList[j2]); j2++;
        }
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Début TantQue : "${condExpr}"` });
        let loops = 0;
        while (evalExpr(condExpr, vars) && loops++ < 500 && steps.length < 300) {
          iteration++;
          steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `TantQue vraie (itération ${iteration})` });
          execLines(body2);
        }
        if (!evalExpr(condExpr, vars))
          steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `TantQue fausse → fin de boucle` });
        i = j2 + 1; continue;
      }

      const siMatch = line.match(/^Si\s+(.+?)\s+Alors$/i);
      if (siMatch) {
        const [, condExpr] = siMatch;
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
        const condResult = evalExpr(condExpr, vars);
        steps.push({ lineIdx: i, line: raw, vars: { ...vars }, output: [...output], iteration, explanation: `Si "${condExpr}" → ${condResult ? "VRAI (branche Alors)" : "FAUX (branche Sinon)"}` });
        if (condResult) execLines(thenL);
        else if (elseL.length) execLines(elseL);
        i = j3 + 1; continue;
      }

      if (/^(FinSi|FinTantQue|FinPour|Sinon|Lire)$/i.test(line)) { i++; continue; }
      i++;
    }
  }

  try { execLines(lines); } catch { /* return what we have */ }
  return steps;
}

/* ─── Editable code editor with line numbers ─────────── */
function CodeEditor({
  code,
  onChange,
  currentLine,
  errorLines,
}: {
  code: string;
  onChange: (v: string) => void;
  currentLine: number | null;
  errorLines: Set<number>;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const codeLines = code.split("\n");
  const lineCount = codeLines.length;

  // Sync scroll between textarea, overlay and gutter
  const syncScroll = () => {
    const ta = textareaRef.current;
    const ov = overlayRef.current;
    const gu = gutterRef.current;
    if (!ta || !ov || !gu) return;
    ov.scrollTop = ta.scrollTop;
    ov.scrollLeft = ta.scrollLeft;
    gu.scrollTop = ta.scrollTop;
  };

  // Tab key support
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      const newVal = code.slice(0, start) + "  " + code.slice(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className="rounded overflow-hidden border border-[#3c3c3c] font-mono text-sm bg-[#1e1e1e]" ref={containerRef}>
      {/* Title bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c] select-none">
        <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
        <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
        <div className="w-3 h-3 rounded-full bg-[#28c840]" />
        <span className="text-[#858585] text-xs ml-2">algorithme.pseudo</span>
        <span className="text-[#858585] text-xs ml-auto">{lineCount} ligne{lineCount > 1 ? "s" : ""}</span>
      </div>

      {/* Editor body */}
      <div className="flex overflow-hidden" style={{ maxHeight: "380px" }}>
        {/* Gutter — line numbers */}
        <div
          ref={gutterRef}
          className="select-none overflow-hidden shrink-0 bg-[#1e1e1e] border-r border-[#3c3c3c]"
          style={{ width: "44px", overflowY: "hidden" }}
        >
          {codeLines.map((_, idx) => {
            const lineNum = idx + 1;
            const isCurrentLine = currentLine === lineNum;
            const hasError = errorLines.has(lineNum);
            return (
              <div
                key={idx}
                className={`flex items-center justify-end pr-2 leading-6 text-xs
                  ${isCurrentLine ? "text-yellow-300 bg-[#264f78]" : hasError ? "text-red-400" : "text-[#858585]"}
                `}
                style={{ height: "24px" }}
              >
                {hasError && <span className="mr-1 text-red-500">●</span>}
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Code area — stacked: highlighted overlay + transparent textarea */}
        <div className="relative flex-1 overflow-hidden">
          {/* Highlighted overlay (read-only visual) */}
          <div
            ref={overlayRef}
            aria-hidden="true"
            className="absolute inset-0 overflow-auto pointer-events-none px-3 py-0"
            style={{ whiteSpace: "pre", lineHeight: "24px", fontSize: "13px" }}
          >
            {codeLines.map((line, idx) => {
              const lineNum = idx + 1;
              const isCurrentLine = currentLine === lineNum;
              const hasError = errorLines.has(lineNum);
              return (
                <div
                  key={idx}
                  className={`
                    ${isCurrentLine ? "bg-[#264f78]" : ""}
                    ${hasError && !isCurrentLine ? "bg-red-950/30" : ""}
                  `}
                  style={{ height: "24px", display: "flex", alignItems: "center" }}
                >
                  <span>{highlightLine(line || " ")}</span>
                </div>
              );
            })}
          </div>

          {/* Actual editable textarea — transparent text, caret visible */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={e => onChange(e.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            autoCapitalize="none"
            autoCorrect="off"
            className="absolute inset-0 w-full h-full resize-none bg-transparent outline-none px-3 py-0 caret-white"
            style={{
              color: "transparent",
              lineHeight: "24px",
              fontSize: "13px",
              fontFamily: "inherit",
              whiteSpace: "pre",
              overflowWrap: "normal",
              overflow: "auto",
              caretColor: "white",
            }}
          />
        </div>
      </div>
    </div>
  );
}

/* ─── Main component ─────────────────────────────────── */
export default function AlgoSimulator() {
  const [code, setCode] = useState(PRESETS[0].code);
  const [steps, setSteps] = useState<Step[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [mode, setMode] = useState<"idle" | "all" | "step">("idle");
  const [lintErrors, setLintErrors] = useState<LintError[]>([]);

  // Run linter on every code change
  useEffect(() => {
    setLintErrors(lintCode(code));
  }, [code]);

  const reset = useCallback(() => {
    setSteps([]); setStepIdx(-1); setMode("idle");
  }, []);

  const run = useCallback((runMode: "all" | "step") => {
    const errors = lintCode(code).filter(e => e.severity === "error");
    if (errors.length > 0) return; // block execution on errors
    const s = interpret(code);
    if (s.length === 0) return;
    setSteps(s);
    setMode(runMode);
    setStepIdx(runMode === "step" ? 0 : s.length - 1);
  }, [code]);

  const currentStep = steps[stepIdx] ?? null;
  const displayedSteps = mode === "all" ? steps : steps.slice(0, stepIdx + 1);
  const finalOutput = steps.length > 0 ? steps[steps.length - 1].output : [];

  // Error lines set (1-indexed)
  const errorLineSet = new Set(lintErrors.filter(e => e.severity === "error").map(e => e.line));
  const warnLineSet  = new Set(lintErrors.filter(e => e.severity === "warning").map(e => e.line));
  const allErrorLines = new Set([...errorLineSet, ...warnLineSet]);

  // Current line for highlighting (1-indexed)
  const currentHighlightLine: number | null = (() => {
    if (!currentStep) return null;
    const codeLines = code.split("\n");
    const idx = codeLines.findIndex(l => l.trim() === currentStep.line.trim() && l.trim().length > 0);
    return idx >= 0 ? idx + 1 : null;
  })();

  const hasErrors = lintErrors.some(e => e.severity === "error");

  const generateExplanation = () => {
    if (steps.length === 0) return "";
    const iterCount = steps.filter(s => s.explanation.startsWith("Itération") || s.explanation.startsWith("TantQue vraie")).length;
    let expl = `Algorithme exécuté en ${steps.length} étapes`;
    if (iterCount > 0) expl += `, ${iterCount} itération(s) de boucle`;
    if (finalOutput.length > 0) expl += `. Résultat : ${finalOutput.join(", ")}`;
    expl += ".";
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
        {/* ── Left : editor ── */}
        <div className="space-y-3">
          <CodeEditor
            code={code}
            onChange={v => { setCode(v); reset(); }}
            currentLine={currentHighlightLine}
            errorLines={allErrorLines}
          />

          {/* Error panel */}
          {lintErrors.length > 0 && (
            <div className="rounded border border-[#3c3c3c] bg-[#1e1e1e] overflow-hidden">
              <div className="px-3 py-1.5 bg-[#2d2d2d] border-b border-[#3c3c3c] flex items-center gap-2">
                <span className="text-red-400 text-xs font-bold uppercase">
                  ⚠ {lintErrors.filter(e => e.severity === "error").length} erreur(s)
                  {lintErrors.filter(e => e.severity === "warning").length > 0 &&
                    ` · ${lintErrors.filter(e => e.severity === "warning").length} avertissement(s)`}
                </span>
              </div>
              <div className="divide-y divide-[#3c3c3c]">
                {lintErrors.map((err, i) => (
                  <div key={i} className="flex items-start gap-3 px-3 py-2">
                    <span className={`text-xs font-mono shrink-0 mt-0.5 ${err.severity === "error" ? "text-red-400" : "text-yellow-400"}`}>
                      Ligne {err.line}
                    </span>
                    <span className={`text-xs ${err.severity === "error" ? "text-red-300" : "text-yellow-300"}`}>
                      {err.message}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => run("all")}
              disabled={hasErrors}
              className={`px-4 py-1.5 rounded text-sm font-semibold transition-colors ${
                hasErrors
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-[#04aa6d] text-white hover:bg-[#088a5b]"
              }`}
              title={hasErrors ? "Corrigez les erreurs avant d'exécuter" : ""}
            >
              ▶ Exécuter
            </button>
            <button
              onClick={() => run("step")}
              disabled={hasErrors}
              className={`px-4 py-1.5 rounded text-sm font-semibold border transition-colors ${
                hasErrors
                  ? "border-gray-300 text-gray-400 cursor-not-allowed"
                  : "border-[#04aa6d] text-[#04aa6d] hover:bg-green-50"
              }`}
            >
              ▷ Pas à Pas
            </button>

            {mode === "step" && steps.length > 0 && (
              <>
                <button onClick={() => setStepIdx(i => Math.max(0, i - 1))} disabled={stepIdx === 0}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40">⏮</button>
                <span className="text-xs text-gray-500 self-center">{stepIdx + 1}/{steps.length}</span>
                <button onClick={() => setStepIdx(i => Math.min(steps.length - 1, i + 1))} disabled={stepIdx === steps.length - 1}
                  className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 disabled:opacity-40">⏭</button>
              </>
            )}

            {mode !== "idle" && (
              <button onClick={reset} className="px-3 py-1.5 rounded text-sm border border-gray-300 hover:bg-gray-100 text-gray-600">
                ↺ Reset
              </button>
            )}
          </div>

          {/* Syntax reference */}
          <div className="border border-[#3c3c3c] rounded p-3 bg-[#1e1e1e]">
            <p className="text-xs font-bold text-[#858585] mb-2 uppercase">Syntaxe</p>
            <pre className="text-xs leading-relaxed">
              <span className="text-[#9cdcfe]">variable</span><span className="text-[#569cd6]"> &lt;- </span><span className="text-[#d4d4d4]">expression     </span><span className="text-[#6a9955]">// affectation{"\n"}</span>
              <span className="text-[#dcdcaa]">Ecrire</span><span className="text-[#d4d4d4]">(x)            </span><span className="text-[#6a9955]">// affichage{"\n"}</span>
              <span className="text-[#c586c0]">Pour </span><span className="text-[#9cdcfe]">i</span><span className="text-[#569cd6]"> &lt;- </span><span className="text-[#b5cea8]">1 </span><span className="text-[#c586c0]">à </span><span className="text-[#9cdcfe]">n  </span><span className="text-[#6a9955]">/ </span><span className="text-[#c586c0]">FinPour{"\n"}</span>
              <span className="text-[#c586c0]">TantQue </span><span className="text-[#d4d4d4]">cond </span><span className="text-[#c586c0]">Faire  </span><span className="text-[#6a9955]">/ </span><span className="text-[#c586c0]">FinTantQue{"\n"}</span>
              <span className="text-[#c586c0]">Si </span><span className="text-[#d4d4d4]">cond </span><span className="text-[#c586c0]">Alors </span><span className="text-[#6a9955]">/ </span><span className="text-[#c586c0]">Sinon </span><span className="text-[#6a9955]">/ </span><span className="text-[#c586c0]">FinSi{"\n"}</span>
              <span className="text-[#6a9955]">Opérateurs : + - * /   Comparateurs : {">"} {"<"} {"<="} {">="} = !=</span>
            </pre>
          </div>
        </div>

        {/* ── Right : execution panel ── */}
        <div>
          {currentStep ? (
            <div className="space-y-3">
              {/* Current line */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">LIGNE EN COURS :</p>
                <div className="bg-[#264f78] border border-[#4a8fb5] rounded px-3 py-2 font-mono text-sm flex items-center gap-2">
                  <span className="text-[#858585] text-xs">{currentHighlightLine}</span>
                  <span className="text-[#3c3c3c]">│</span>
                  {highlightLine(currentStep.line.trim())}
                </div>
                <p className="text-xs text-gray-600 mt-1 italic">→ {currentStep.explanation}</p>
              </div>

              {/* Memory */}
              <div>
                <p className="text-xs font-semibold text-gray-500 mb-1">
                  MÉMOIRE {mode === "step" ? `(étape ${stepIdx + 1})` : "(final)"} :
                </p>
                {Object.keys(currentStep.vars).length === 0 ? (
                  <p className="text-xs text-gray-400 italic">Aucune variable encore</p>
                ) : (
                  <table className="data-table text-sm w-full">
                    <thead><tr><th>Variable</th><th>Valeur</th><th>Type</th></tr></thead>
                    <tbody>
                      {Object.entries(currentStep.vars).map(([k, v]) => (
                        <tr key={k}>
                          <td className="font-mono font-bold text-[#9cdcfe] bg-[#1e1e1e]">{k}</td>
                          <td className="font-mono font-bold text-blue-700">{String(v)}</td>
                          <td className="text-gray-500 text-xs">{typeof v === "number" ? (Number.isInteger(v) ? "Entier" : "Réel") : "Chaîne"}</td>
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
              <p className="text-3xl mb-2">🖥️</p>
              <p className="text-sm font-medium">
                {hasErrors ? "Corrigez les erreurs pour exécuter" : "Cliquez sur Exécuter ou Pas à Pas"}
              </p>
              <p className="text-xs mt-1 text-gray-400">
                {hasErrors ? `${lintErrors.filter(e => e.severity === "error").length} erreur(s) détectée(s)` : "pour voir la simulation"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* History */}
      {displayedSteps.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-2">HISTORIQUE ({displayedSteps.length}/{steps.length}) :</p>
          <div className="border border-gray-200 rounded overflow-hidden">
            <div className="max-h-52 overflow-y-auto">
              <table className="data-table text-xs w-full">
                <thead className="sticky top-0">
                  <tr><th className="w-8">#</th><th>Ligne</th><th>Action</th><th>Variables</th></tr>
                </thead>
                <tbody>
                  {displayedSteps.map((s, i) => (
                    <tr key={i}
                      className={`cursor-pointer ${i === stepIdx ? "bg-yellow-100" : "hover:bg-gray-50"}`}
                      onClick={() => { setStepIdx(i); setMode("step"); }}>
                      <td className="font-bold text-gray-400">{i + 1}</td>
                      <td><code className="font-mono text-xs">{s.line.trim()}</code></td>
                      <td className="text-gray-600">{s.explanation}</td>
                      <td className="font-mono text-blue-700 text-xs">
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

      {/* Explanation */}
      {steps.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <p className="font-bold text-sm mb-1">💡 Explication logique</p>
          <p className="text-sm text-gray-700">{generateExplanation()}</p>
          {finalOutput.length > 0 && (
            <div className="mt-2">
              <p className="text-xs font-semibold text-gray-500 mb-1">RÉSULTAT FINAL :</p>
              <div className="bg-[#1e1e1e] rounded p-2 font-mono text-sm border border-[#3c3c3c]">
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
            <strong>{steps.length} étapes</strong> · <strong>{Object.keys(steps[steps.length - 1]?.vars ?? {}).length} variables</strong> · <strong>{finalOutput.length} sortie(s)</strong>
          </p>
        </div>
      )}
    </div>
  );
}
