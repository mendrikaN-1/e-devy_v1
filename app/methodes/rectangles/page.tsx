import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import IntegSimulator from "@/components/IntegSimulator";

export const metadata = { title: "Méthode des Rectangles - E-DEVY" };

export default function RectanglesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/methodes" className="hover:underline">Méthodes Numériques</Link> › Rectangles
      </div>
      <h1 className="text-2xl font-bold mb-1">II.1. Méthode des Rectangles</h1>
      <p className="text-gray-500 text-sm mb-6">Source : Chap. III — Calculs approchés, support S3</p>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 1 — Théorie</h2>
        <p className="text-sm mb-3">
          La méthode des rectangles permet d'approcher <strong>I(f) = ∫ᵃᵇ f(x) dx</strong>.
          Elle revient à une approximation de f sur chaque sous-intervalle Iₖ par un
          <strong> polynôme de degré 0</strong> (droite horizontale — constante).
        </p>
        <p className="text-sm mb-3">
          L'intégrale de cette constante sur [xₖ₋₁, xₖ] est simplement
          <strong> l'aire d'un rectangle</strong> de largeur H et de hauteur f(x).
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="success-box text-sm"><strong>✓ Avantages</strong>
            <ul className="list-disc ml-4 mt-1"><li>Simple à comprendre</li><li>Facile à implémenter</li></ul>
          </div>
          <div className="note-box text-sm"><strong>⚠ Limites</strong>
            <ul className="list-disc ml-4 mt-1"><li>Précision faible (erreur O(H))</li><li>Nécessite M grand pour être précis</li></ul>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 2 — Formules</h2>
        <p className="text-sm mb-3">Trois variantes existent selon le point choisi pour la hauteur du rectangle :</p>
        <div className="space-y-3">
          {[
            { name: "Rectangle à droite", formula: "I(f) = H × Σₖ₌₁ᴹ f(xₖ₋₁)", desc: "Hauteur = f au bord gauche de chaque intervalle" },
            { name: "Rectangle à gauche", formula: "I(f) = H × Σₖ₌₁ᴹ f(xₖ)", desc: "Hauteur = f au bord droit de chaque intervalle" },
            { name: "Rectangle du point milieu", formula: "I(f) = H × Σₖ₌₁ᴹ f((xₖ₋₁+xₖ)/2)", desc: "Hauteur = f au milieu de chaque intervalle (plus précis)" },
          ].map(v => (
            <div key={v.name} className="border border-gray-200 rounded p-3">
              <p className="font-bold text-sm">{v.name}</p>
              <code className="text-sm bg-gray-100 px-2 py-0.5 rounded block mt-1 mb-1">{v.formula}</code>
              <p className="text-xs text-gray-600">{v.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-sm mt-3 text-gray-600">Avec <strong>H = (b − a) / M</strong> la largeur de chaque sous-intervalle.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 3 — Algorithme</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-sm mb-2">Étapes du cours</h3>
            <div className="space-y-1 text-xs">
              {["Étape 1 : Choisir f, [a,b] et M","Étape 2 : H = (b−a)/M","Étape 3 : I = 0, x₀ = a","Étape 4 : Pour k=1 à M : S = H×f(xₖ) ; I = I+S","Étape 5 : Afficher I"].map((s,i)=>(
                <div key={i} className="border-l-2 border-gray-300 pl-2 py-0.5">{s}</div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Pseudo-code</h3>
            <CodeBlock type="algo" code={`Algorithme Rectangles
Variables a, b, H, I, S, x : Réels
Variables M, k : Entiers
Début
  Lire(a, b, M)
  H = (b - a) / M
  I = 0
  x = a
  pour k de 1 à M par 1 faire
    S = H * f(x)
    I = I + S
    x = x + H
  finpour
  Ecrire('Intégrale ≈', I)
Fin`} />
          </div>
        </div>
        <h3 className="font-bold text-sm mt-4 mb-2">MATLAB</h3>
        <CodeBlock type="matlab" code={`a = 0; b = 1; M = 100;
H = (b-a)/M;
I = 0;
for k = 1:M
    x = a + (k-1)*H;    % rectangle à droite
    I = I + H*f(x);
end
disp(['I = ', num2str(I)]);`} />
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">Partie 4 — Simulateur Pas à Pas</h2>
        <IntegSimulator defaultMethod="rectangles_g" defaultExpr="x*x" defaultA={0} defaultB={1} />
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/methodes/newton" className="text-sm text-[#04aa6d] hover:underline">← Newton</Link>
        <Link href="/methodes/trapezes" className="text-sm text-[#04aa6d] hover:underline">Trapèzes →</Link>
      </div>
    </div>
  );
}
