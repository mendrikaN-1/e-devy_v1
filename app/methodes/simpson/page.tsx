import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import IntegSimulator from "@/components/IntegSimulator";

export const metadata = { title: "Méthode de Simpson - E-DEVY" };

export default function SimpsonPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/methodes" className="hover:underline">Méthodes Numériques</Link> › Simpson
      </div>
      <h1 className="text-2xl font-bold mb-1">II.3. Méthode de Simpson</h1>
      <p className="text-gray-500 text-sm mb-6">Source : Chap. III — Calculs approchés, support S3</p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 1 — Théorie</h2>
        <p className="text-sm mb-3">
          On obtient la formule de Simpson en remplaçant l'intégrale de f sur chaque Iₖ
          par celle de son <strong>polynôme d'interpolation de degré 2 (parabole)</strong>
          aux noeuds xₖ₋₁, x̄ₖ = (xₖ₋₁+xₖ)/2 et xₖ.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="success-box text-sm"><strong>✓ Avantages</strong>
            <ul className="list-disc ml-4 mt-1">
              <li>Très haute précision (erreur O(H⁴))</li>
              <li>Exact pour les polynômes de degré ≤ 3</li>
              <li>Converge rapidement</li>
            </ul>
          </div>
          <div className="note-box text-sm"><strong>⚠ Limites</strong>
            <ul className="list-disc ml-4 mt-1">
              <li>Légèrement plus complexe</li>
              <li>Nécessite le calcul des points milieux</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 2 — D'où vient la formule ?</h2>
        <div className="space-y-3 text-sm">
          <div className="border-l-4 border-red-400 pl-4 py-1">
            <strong>Étape 1 :</strong> Sur [xₖ₋₁, xₖ], on prend 3 points : xₖ₋₁, le milieu x̄ₖ=(xₖ₋₁+xₖ)/2, et xₖ.
          </div>
          <div className="border-l-4 border-red-400 pl-4 py-1">
            <strong>Étape 2 :</strong> On construit la <strong>parabole</strong> (polynôme de degré 2)
            passant par ces 3 points : (xₖ₋₁, f(xₖ₋₁)), (x̄ₖ, f(x̄ₖ)), (xₖ, f(xₖ)).
          </div>
          <div className="border-l-4 border-red-400 pl-4 py-1">
            <strong>Étape 3 :</strong> On intègre analytiquement cette parabole sur [xₖ₋₁, xₖ].
            Le calcul donne la formule de quadrature de Simpson :
            <div className="bg-gray-100 rounded px-3 py-1 mt-1 font-mono text-center">
              ∫ f dx ≈ (H/6) × [f(xₖ₋₁) + 4·f(x̄ₖ) + f(xₖ)]
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Le coefficient <strong>4</strong> au point milieu vient de la pondération de la parabole — c'est la règle des 3/8.
            </p>
          </div>
          <div className="border-l-4 border-red-400 pl-4 py-1">
            <strong>Étape 4 :</strong> On somme sur tous les M sous-intervalles :
            <div className="bg-red-50 border border-red-200 rounded px-3 py-2 mt-1 font-mono text-center font-bold">
              I(f) = (H/6) × Σₖ₌₁ᴹ [f(xₖ₋₁) + 4·f(x̄ₖ) + f(xₖ)]
            </div>
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-1 bg-green-50">
            <strong>Pourquoi c'est si précis ?</strong> Une parabole est beaucoup plus proche de la
            courbe f qu'une droite ou une constante. L'erreur est en O(H⁴) — si on double M,
            l'erreur est divisée par 16 !
          </div>
        </div>

        {/* SVG parabola illustration */}
        <div className="mt-4 border border-gray-200 rounded p-4 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2 font-semibold text-center">ILLUSTRATION — Parabole sur [xₖ₋₁, xₖ]</p>
          <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto block">
            <line x1="20" y1="160" x2="280" y2="160" stroke="#ccc" strokeWidth="1"/>
            <line x1="20" y1="10" x2="20" y2="165" stroke="#ccc" strokeWidth="1"/>
            <path d="M 20 140 Q 80 100 150 70 Q 220 45 280 20" fill="none" stroke="#2196f3" strokeWidth="2.5"/>
            <line x1="60" y1="160" x2="60" y2="114" stroke="#666" strokeWidth="1" strokeDasharray="3"/>
            <line x1="160" y1="160" x2="160" y2="68" stroke="#666" strokeWidth="1" strokeDasharray="3"/>
            <line x1="110" y1="160" x2="110" y2="91" stroke="#666" strokeWidth="1" strokeDasharray="3"/>
            <path d="M 60 114 Q 110 68 160 68" fill="#e53935" fillOpacity="0.2" stroke="#e53935" strokeWidth="2"/>
            <line x1="60" y1="114" x2="160" y2="114" stroke="#e53935" strokeWidth="0.5" strokeDasharray="2"/>
            <line x1="60" y1="68" x2="160" y2="68" stroke="#e53935" strokeWidth="0.5" strokeDasharray="2"/>
            <polygon points="60,114 160,68 160,160 60,160" fill="#e53935" fillOpacity="0.1"/>
            <circle cx="60" cy="114" r="3" fill="#e53935"/>
            <circle cx="110" cy="91" r="3" fill="#e53935"/>
            <circle cx="160" cy="68" r="3" fill="#e53935"/>
            <text x="60" y="175" fontSize="9" textAnchor="middle" fill="#555">xₖ₋₁</text>
            <text x="110" y="175" fontSize="9" textAnchor="middle" fill="#e53935">x̄ₖ</text>
            <text x="160" y="175" fontSize="9" textAnchor="middle" fill="#555">xₖ</text>
            <text x="200" y="100" fontSize="9" fill="#e53935" fontWeight="bold">parabole</text>
            <text x="200" y="112" fontSize="9" fill="#555">≈ f(x)</text>
          </svg>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 3 — Algorithme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock type="algo" code={`Algorithme Simpson
Variables a, b, H, I, S, xk, xbar : Réels
Variables M, k : Entiers
Début
  Lire(a, b, M)
  H = (b - a) / M
  I = 0
  pour k de 1 à M par 1 faire
    xk = a + k*H
    xbar = (a + (k-1)*H + xk) / 2
    S = (f(a+(k-1)*H) + 4*f(xbar) + f(xk)) * H/6
    I = I + S
  finpour
  Ecrire('Intégrale ≈', I)
Fin`} />
          <CodeBlock type="matlab" code={`a = 0; b = 1; M = 100;
H = (b-a)/M;
I = 0;
for k = 1:M
    xk = a + k*H;
    xbar = (a + (k-1)*H + xk)/2;
    S = (f(a+(k-1)*H)+4*f(xbar)+f(xk))*H/6;
    I = I + S;
end
disp(['I = ', num2str(I)]);`} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 4 — Simulateur Pas à Pas</h2>
        <IntegSimulator defaultMethod="simpson" defaultExpr="x*x" defaultA={0} defaultB={1} />
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/methodes/trapezes" className="text-sm text-[#04aa6d] hover:underline">← Trapèzes</Link>
        <Link href="/exercices" className="text-sm text-[#04aa6d] hover:underline">Exercices →</Link>
      </div>
    </div>
  );
}
