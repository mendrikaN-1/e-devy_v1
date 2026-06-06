import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import IntegSimulator from "@/components/IntegSimulator";

export const metadata = { title: "Méthode des Trapèzes - E-DEVY" };

export default function TrapezesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/methodes" className="hover:underline">Méthodes Numériques</Link> › Trapèzes
      </div>
      <h1 className="text-2xl font-bold mb-1">II.2. Méthode des Trapèzes</h1>
      <p className="text-gray-500 text-sm mb-6">Source : Chap. III — Calculs approchés, support S3</p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 1 — Théorie</h2>
        <p className="text-sm mb-3">
          On peut obtenir une autre formule en remplaçant f sur Iₖ par le
          <strong> polynôme de degré 1</strong> interpolant f aux noeuds xₖ₋₁ et xₖ.
          Les rectangles sont alors <strong>remplacés par des trapèzes</strong>.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="success-box text-sm"><strong>✓ Avantages</strong>
            <ul className="list-disc ml-4 mt-1"><li>Plus précis que rectangles (O(H²))</li><li>Suit mieux la courbe</li></ul>
          </div>
          <div className="note-box text-sm"><strong>⚠ Limites</strong>
            <ul className="list-disc ml-4 mt-1"><li>Peut surestimer ou sous-estimer selon la convexité</li><li>Moins précis que Simpson</li></ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 2 — D'où vient la formule ?</h2>
        <div className="space-y-3 text-sm">
          <div className="border-l-4 border-orange-400 pl-4 py-1">
            <strong>Étape 1 :</strong> Sur chaque Iₖ = [xₖ₋₁, xₖ], on remplace f par la droite
            passant par (xₖ₋₁, f(xₖ₋₁)) et (xₖ, f(xₖ)).
          </div>
          <div className="border-l-4 border-orange-400 pl-4 py-1">
            <strong>Étape 2 :</strong> L'intégrale de la droite sur Iₖ est l'aire d'un trapèze
            de bases f(xₖ₋₁) et f(xₖ) et de hauteur H :
            <div className="bg-gray-100 rounded px-3 py-1 mt-1 font-mono text-center">
              Aire trapèze = H × [f(xₖ₋₁) + f(xₖ)] / 2
            </div>
          </div>
          <div className="border-l-4 border-orange-400 pl-4 py-1">
            <strong>Étape 3 :</strong> En sommant sur tous les sous-intervalles,
            les termes intérieurs apparaissent deux fois :
            <div className="bg-orange-50 border border-orange-200 rounded px-3 py-2 mt-1 font-mono text-center font-bold">
              I(f) = (H/2) × [f(a) + f(b)] + H × Σₖ₌₁ᴹ⁻¹ f(xₖ)
            </div>
          </div>
        </div>
        {/* SVG Trapeze illustration */}
        <div className="mt-4 border border-gray-200 rounded p-4 bg-gray-50">
          <p className="text-xs text-gray-500 mb-2 font-semibold text-center">ILLUSTRATION — Un trapèze sur [xₖ₋₁, xₖ]</p>
          <svg viewBox="0 0 300 180" className="w-full max-w-xs mx-auto block">
            <line x1="20" y1="160" x2="280" y2="160" stroke="#ccc" strokeWidth="1"/>
            <line x1="20" y1="10" x2="20" y2="165" stroke="#ccc" strokeWidth="1"/>
            <path d="M 20 140 Q 80 110 150 80 Q 200 60 280 30" fill="none" stroke="#2196f3" strokeWidth="2.5"/>
            <line x1="80" y1="160" x2="80" y2="108" stroke="#666" strokeWidth="1" strokeDasharray="3"/>
            <line x1="180" y1="160" x2="180" y2="74" stroke="#666" strokeWidth="1" strokeDasharray="3"/>
            <polygon points="80,108 180,74 180,160 80,160" fill="#ff9800" fillOpacity="0.3" stroke="#ff9800" strokeWidth="2"/>
            <text x="80" y="175" fontSize="10" textAnchor="middle" fill="#555">xₖ₋₁</text>
            <text x="180" y="175" fontSize="10" textAnchor="middle" fill="#555">xₖ</text>
            <text x="35" y="112" fontSize="9" fill="#555">f(xₖ₋₁)</text>
            <text x="182" y="72" fontSize="9" fill="#555">f(xₖ)</text>
            <text x="128" y="140" fontSize="10" fill="#e65100" fontWeight="bold">trapèze</text>
          </svg>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 3 — Algorithme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CodeBlock type="algo" code={`Algorithme Trapezes
Variables a, b, H, I : Réels
Variables M, k : Entiers
Début
  Lire(a, b, M)
  H = (b - a) / M
  I = 0
  pour k de 1 à M-1 par 1 faire
    I = I + H * f(a + k*H)
  finpour
  I = I + H * (f(a) + f(b)) / 2
  Ecrire('Intégrale ≈', I)
Fin`} />
          <CodeBlock type="matlab" code={`a = 0; b = 1; M = 100;
H = (b-a)/M;
I = 0;
for k = 1:M-1
    I = I + H*f(a + k*H);
end
I = I + H*(f(a)+f(b))/2;
disp(['I = ', num2str(I)]);`} />
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 4 — Simulateur Pas à Pas</h2>
        <IntegSimulator defaultMethod="trapezes" defaultExpr="x*x" defaultA={0} defaultB={1} />
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/methodes/rectangles" className="text-sm text-[#04aa6d] hover:underline">← Rectangles</Link>
        <Link href="/methodes/simpson" className="text-sm text-[#04aa6d] hover:underline">Simpson →</Link>
      </div>
    </div>
  );
}
