import AlgoSimulator from "./AlgoSimulator";

export const metadata = { title: "Pratique Algo - E-DEVY" };

export default function PratiquePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Pratique Algo — Simulateur Pas à Pas</h1>
      <p className="text-gray-500 text-sm mb-6">
        Écrivez directement votre algorithme dans l'éditeur ci-dessous. Les erreurs de syntaxe
        sont signalées ligne par ligne en temps réel. Utilisez <strong>Pas à Pas</strong> pour
        visualiser l'exécution étape par étape.
      </p>
      <AlgoSimulator />
    </div>
  );
}
