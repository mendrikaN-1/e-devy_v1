import AlgoSimulator from "./AlgoSimulator";

export const metadata = { title: "Pratique Algo - E-DEVY" };

export default function PratiquePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Pratique Algo — Simulateur Pas à Pas</h1>
      <p className="text-gray-500 text-sm mb-4">
        Écrivez votre algorithme en pseudo-code et visualisez son exécution ligne par ligne,
        avec le tableau mémoire des variables à chaque étape.
      </p>
      <div className="info-box text-sm mb-6">
        <strong>Comment utiliser :</strong> Choisissez un exemple ou écrivez votre pseudo-code.
        Cliquez sur <strong>Exécuter</strong> pour voir toutes les étapes, ou <strong>Pas à Pas</strong>
        pour avancer étape par étape avec la visualisation mémoire.
      </div>
      <AlgoSimulator />
    </div>
  );
}
