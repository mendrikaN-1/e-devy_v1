import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import NewtonSimulator from "./NewtonSimulator";

export const metadata = { title: "Méthode de Newton - E-DEVY" };

export default function NewtonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/methodes" className="hover:underline">Méthodes Numériques</Link> › Newton
      </div>
      <h1 className="text-2xl font-bold mb-1">I.2. Méthode de Newton (Newton-Raphson)</h1>
      <p className="text-gray-500 text-sm mb-6">Source : Chap. III — Calculs approchés, support S3</p>

      {/* PARTIE 1 */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 1 — Théorie
        </h2>
        <p className="text-sm mb-3">
          La méthode de Newton (ou Newton-Raphson) est un algorithme pour trouver numériquement
          une <strong>approximation précise d'un zéro (racine)</strong> d'une fonction réelle f(x).
        </p>
        <p className="text-sm mb-3">
          On cherche à construire une bonne approximation d'un zéro de f(x) en considérant son
          <strong> développement de Taylor au premier ordre</strong> — autrement dit, on approche
          la courbe par sa <strong>tangente</strong> en un point proche de la racine.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="success-box text-sm">
            <strong>✓ Avantages</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Convergence <strong>quadratique</strong> (très rapide)</li>
              <li>Très peu d'itérations nécessaires</li>
              <li>Précision excellente</li>
            </ul>
          </div>
          <div className="note-box text-sm">
            <strong>⚠ Limites</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Nécessite de calculer f'(x)</li>
              <li>Peut diverger si x₀ mal choisi</li>
              <li>Problème si f'(xₙ) = 0</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PARTIE 2 : DEMO */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 2 — D'où vient la formule ?
        </h2>
        <div className="space-y-3 text-sm">
          <div className="border-l-4 border-purple-400 pl-4 py-1">
            <strong>Étape 1 :</strong> On part d'un point x₀ proche de la racine.
            On approche f par sa tangente en x₀ (développement de Taylor ordre 1) :
            <div className="bg-gray-100 rounded px-3 py-2 mt-1 font-mono text-center">
              f(x) ≈ f(x₀) + f′(x₀) × (x − x₀)
            </div>
          </div>
          <div className="border-l-4 border-purple-400 pl-4 py-1">
            <strong>Étape 2 :</strong> Pour trouver le zéro de cette tangente, on pose f(x) = 0 :
            <div className="bg-gray-100 rounded px-3 py-2 mt-1 font-mono text-center">
              0 = f(x₀) + f′(x₀) × (x − x₀)
            </div>
          </div>
          <div className="border-l-4 border-purple-400 pl-4 py-1">
            <strong>Étape 3 :</strong> On résout pour x → on obtient x₁ :
            <div className="bg-gray-100 rounded px-3 py-2 mt-1 font-mono text-center font-bold text-lg">
              x₁ = x₀ − f(x₀) / f′(x₀)
            </div>
          </div>
          <div className="border-l-4 border-purple-400 pl-4 py-1">
            <strong>Étape 4 :</strong> On répète en remplaçant x₀ par x₁.
            La récurrence générale est :
            <div className="bg-purple-50 border border-purple-200 rounded px-3 py-2 mt-1 font-mono text-center font-bold text-base">
              xₙ₊₁ = xₙ − f(xₙ) / f′(xₙ)
            </div>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-1 bg-green-50">
            <strong>Arrêt :</strong> On s'arrête quand <strong>|xₙ₊₁ − xₙ| &lt; ε</strong>.
            La convergence est <em>quadratique</em> : l'erreur est élevée au carré à chaque étape !
          </div>
        </div>

        {/* SVG illustration tangentes */}
        <div className="mt-5 border border-gray-200 rounded p-4 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2 font-semibold text-center">ILLUSTRATION — Tangentes successives</p>
          <svg viewBox="0 0 400 200" className="w-full max-w-md mx-auto block">
            {/* Axes */}
            <line x1="30" y1="180" x2="390" y2="180" stroke="#ccc" strokeWidth="1"/>
            <line x1="30" y1="10" x2="30" y2="180" stroke="#ccc" strokeWidth="1"/>
            {/* Curve (schematic) */}
            <path d="M 60 160 Q 150 140 220 80 Q 280 30 380 10" fill="none" stroke="#2196f3" strokeWidth="2.5"/>
            {/* x0 */}
            <line x1="360" y1="180" x2="360" y2="20" stroke="#ccc" strokeWidth="1" strokeDasharray="4"/>
            <text x="355" y="195" fontSize="10" fill="#555">x₀</text>
            {/* Tangent at x0 */}
            <line x1="200" y1="190" x2="380" y2="18" stroke="#e53935" strokeWidth="1.5"/>
            {/* x1 */}
            <line x1="270" y1="180" x2="270" y2="50" stroke="#ccc" strokeWidth="1" strokeDasharray="4"/>
            <text x="265" y="195" fontSize="10" fill="#555">x₁</text>
            {/* Tangent at x1 */}
            <line x1="170" y1="175" x2="310" y2="32" stroke="#ff9800" strokeWidth="1.5"/>
            {/* x2 */}
            <line x1="218" y1="180" x2="218" y2="80" stroke="#ccc" strokeWidth="1" strokeDasharray="4"/>
            <text x="213" y="195" fontSize="10" fill="#555">x₂</text>
            {/* root alpha */}
            <line x1="190" y1="175" x2="190" y2="185" stroke="#04aa6d" strokeWidth="2"/>
            <text x="182" y="195" fontSize="10" fill="#04aa6d" fontWeight="bold">x*</text>
            {/* Labels */}
            <text x="340" y="12" fontSize="9" fill="#2196f3">f(x)</text>
            <text x="215" y="178" fontSize="9" fill="#e53935">tangente 1</text>
          </svg>
          <p className="text-xs text-center text-gray-500 mt-1">
            Les tangentes successives croisent l'axe des x de plus en plus près de x*
          </p>
        </div>
      </section>

      {/* PARTIE 3 : ALGORITHME */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 3 — Algorithme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-sm mb-2">Étapes de calcul (du cours)</h3>
            <div className="space-y-2 text-sm">
              {[
                "Étape 1 : Choisir x₀, calculer f(x₀) et f′(x₀)",
                "Étape 2 : Calculer x₁ = x₀ − f(x₀) / f′(x₀)",
                "Étape 3 : Calculer |x₁ − x₀|",
                "Si |x₁−x₀| < ε → afficher x₁ (racine trouvée)",
                "Sinon → remplacer x₀ par x₁ et retourner à l'étape 1",
              ].map((s, i) => (
                <div key={i} className="border-l-2 border-gray-300 pl-3">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Pseudo-code</h3>
            <CodeBlock type="algo" code={`Algorithme Newton
Variables x0, x1, y, yp, e : Réels
Début
  Lire(x0, e)
  y = f(x0)
  yp = f'(x0)
  x1 = x0 - y/yp
  tantque abs(x1 - x0) > e faire
    x0 = x1
    y = f(x0)
    yp = f'(x0)
    x1 = x0 - y/yp
  fintantque
  Ecrire('Racine x = ', x1)
Fin`} />
          </div>
        </div>

        <h3 className="font-bold text-sm mt-4 mb-2">MATLAB — Exercice du cours : f(x) = cos(x) − x³</h3>
        <CodeBlock type="matlab" code={`% f(x) = cos(x) - x^3,  f'(x) = -sin(x) - 3x^2
% x0 = 0.5,  eps = 1e-10
x0 = 0.5;
e = 0.0000000001;
y = cos(x0) - x0^3;
yp = -sin(x0) - 3*x0^2;
x1 = x0 - y/yp;
while abs(x1-x0) > e
    x0 = x1;
    y = cos(x0) - x0^3;
    yp = -sin(x0) - 3*x0^2;
    x1 = x0 - y/yp;
end
fprintf('racine x=%f\n', x1);   % x ≈ 0.865474`} />
      </section>

      {/* PARTIE 4 : SIMULATEUR */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 4 — Simulateur Pas à Pas
        </h2>
        <NewtonSimulator />
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/methodes/dichotomie" className="text-sm text-[#04aa6d] hover:underline">← Dichotomie</Link>
        <Link href="/methodes/rectangles" className="text-sm text-[#04aa6d] hover:underline">Rectangles →</Link>
      </div>
    </div>
  );
}
