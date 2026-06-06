"use client";
import { useState } from "react";

interface CodeBlockProps {
  code: string;
  type?: "algo" | "matlab" | "dark";
  title?: string;
}

export default function CodeBlock({
  code,
  type = "algo",
  title,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const className =
    type === "matlab"
      ? "code-matlab"
      : type === "dark"
      ? "code-block"
      : "code-algo";

  return (
    <div className="my-3 rounded overflow-hidden border border-gray-200">
      <div className="flex items-center justify-between bg-gray-100 px-3 py-1.5 text-xs text-gray-600 border-b border-gray-200">
        <span className="font-medium">
          {title ||
            (type === "matlab" ? "MATLAB" : type === "dark" ? "Code" : "Algorithme")}
        </span>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-0.5 rounded bg-gray-200 hover:bg-gray-300 transition-colors"
        >
          {copied ? "✓ Copié" : "Copier"}
        </button>
      </div>
      <div className={className}>{code}</div>
    </div>
  );
}
