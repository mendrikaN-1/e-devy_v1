import AlgoSimulator from "./AlgoSimulator";

export const metadata = { title: "Pratique Algo - E-DEVY" };

export default function PratiquePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Pratique Algo — Simulateur Pas à Pas</h1>
      <p className="text-gray-500 text-sm mb-4">
        Écrivez votre algorithme en pseudo-code et visualisez son exécution ligne par ligne,
        avec coloration syntaxique, tableau mémoire et débogueur intégré.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 text-sm">
        <div className="info-box">
          <strong>✏️ Éditeur</strong> — Coloration syntaxique style VS Code.
          Mots-clés en violet, nombres en vert, opérateurs en bleu.
        </div>
        <div className="success-box">
          <strong>▶ Exécuteur</strong> — Cliquez sur <strong>Exécuter</strong> ou
          <strong> Pas à Pas</strong> pour avancer étape par étape.
        </div>
        <div className="note-box">
          <strong>🐛 Débogueur</strong> — Posez des <span className="text-red-500 font-bold">●</span> breakpoints
          sur les lignes. L'onglet Débogueur affiche les variables en temps réel.
        </div>
      </div>

      <AlgoSimulator />
    </div>
  );
}
