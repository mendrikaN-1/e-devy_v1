import Link from "next/link";

export const metadata = { title: "Méthodes Numériques - E-DEVY" };

const methods = [
  {
    id: "dichotomie",
    title: "Méthode de Dichotomie",
    cat: "Résolution d'équations",
    desc: "Trouver la racine de f(x)=0 par réduction successive de l'intervalle.",
    formula: "c = (a + b) / 2",
    color: "border-blue-500 bg-blue-50",
  },
  {
    id: "newton",
    title: "Méthode de Newton",
    cat: "Résolution d'équations",
    desc: "Approximation par tangentes successives — convergence très rapide.",
    formula: "xₙ₊₁ = xₙ − f(xₙ)/f'(xₙ)",
    color: "border-purple-500 bg-purple-50",
  },
  {
    id: "rectangles",
    title: "Méthode des Rectangles",
    cat: "Intégration numérique",
    desc: "Approximer ∫f(x)dx par la somme d'aires de rectangles.",
    formula: "I = H × Σ f(xₖ)",
    color: "border-green-500 bg-green-50",
  },
  {
    id: "trapezes",
    title: "Méthode des Trapèzes",
    cat: "Intégration numérique",
    desc: "Remplacer la courbe par des droites entre les points — plus précis que rectangles.",
    formula: "I = (H/2) × [f(a)+f(b)] + H × Σ f(xₖ)",
    color: "border-orange-500 bg-orange-50",
  },
  {
    id: "simpson",
    title: "Méthode de Simpson",
    cat: "Intégration numérique",
    desc: "Approximation par paraboles — très haute précision (ordre 4).",
    formula: "I = (H/6) × Σ [f(xₖ₋₁) + 4f(x̄ₖ) + f(xₖ)]",
    color: "border-red-500 bg-red-50",
  },
];

export default function MethodesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Chap. III — Calculs Approchés</h1>
      <p className="text-gray-500 text-sm mb-2">Source : support de cours S3 — Université d'Antananarivo</p>
      <p className="text-gray-600 text-sm mb-6">
        Pour chaque méthode : théorie, démonstration de la formule, visualisation graphique,
        algorithme pas à pas et explication logique.
      </p>

      <div className="info-box text-sm mb-6">
        <strong>Objectif :</strong> comprendre <em>pourquoi</em> la méthode existe,
        <em> comment</em> elle fonctionne, <em>d'où vient</em> la formule,
        et <em>ce qui se passe</em> à chaque itération.
      </div>

      <h2 className="font-bold text-lg mb-3 text-gray-700">I. Résolution approchée d'une équation</h2>
      <div className="grid gap-4 mb-6">
        {methods.slice(0, 2).map((m) => (
          <Link key={m.id} href={`/methodes/${m.id}`}
            className={`border-l-4 ${m.color} border border-gray-200 p-4 rounded hover:shadow-sm transition-shadow`}>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{m.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.desc}</p>
              </div>
              <div className="text-sm font-mono bg-white border border-gray-200 rounded px-3 py-1 whitespace-nowrap">
                {m.formula}
              </div>
            </div>
            <span className="text-xs text-[#04aa6d] mt-2 inline-block">Voir la méthode complète →</span>
          </Link>
        ))}
      </div>

      <h2 className="font-bold text-lg mb-3 text-gray-700">II. Intégration approchée d'une fonction</h2>
      <div className="info-box text-sm mb-4">
        <strong>Principe commun :</strong> On subdivise l'intervalle [a, b] en <strong>M sous-intervalles</strong> de
        largeur <strong>H = (b−a)/M</strong>, puis on somme les contributions de chaque sous-intervalle.
      </div>
      <div className="grid gap-4">
        {methods.slice(2).map((m) => (
          <Link key={m.id} href={`/methodes/${m.id}`}
            className={`border-l-4 ${m.color} border border-gray-200 p-4 rounded hover:shadow-sm transition-shadow`}>
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <div className="flex-1">
                <h3 className="font-bold text-gray-800">{m.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{m.desc}</p>
              </div>
              <div className="text-sm font-mono bg-white border border-gray-200 rounded px-3 py-1 whitespace-nowrap text-center">
                {m.formula}
              </div>
            </div>
            <span className="text-xs text-[#04aa6d] mt-2 inline-block">Voir la méthode complète →</span>
          </Link>
        ))}
      </div>

      <div className="mt-8 border border-gray-200 rounded p-5">
        <h2 className="font-bold mb-2">Comparaison des méthodes</h2>
        <table className="data-table text-sm">
          <thead>
            <tr><th>Méthode</th><th>Type</th><th>Ordre d'erreur</th><th>Avantage principal</th></tr>
          </thead>
          <tbody>
            <tr><td>Dichotomie</td><td>Résolution</td><td>O(1/2ⁿ)</td><td>Robuste, toujours convergente</td></tr>
            <tr><td>Newton</td><td>Résolution</td><td>O(erreur²)</td><td>Très rapide (quadratique)</td></tr>
            <tr><td>Rectangles</td><td>Intégration</td><td>O(H)</td><td>Simple à implémenter</td></tr>
            <tr><td>Trapèzes</td><td>Intégration</td><td>O(H²)</td><td>Meilleur que rectangles</td></tr>
            <tr><td>Simpson</td><td>Intégration</td><td>O(H⁴)</td><td>Très précis, exact sur polynômes ≤3</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
