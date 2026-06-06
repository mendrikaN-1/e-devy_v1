import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";
import DichotomieSimulator from "./DichotomieSimulator";

export const metadata = { title: "Méthode de Dichotomie - E-DEVY" };

export default function DichotomiePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/methodes" className="hover:underline">Méthodes Numériques</Link> › Dichotomie
      </div>
      <h1 className="text-2xl font-bold mb-1">I.1. Méthode de Dichotomie</h1>
      <p className="text-gray-500 text-sm mb-6">Source : Chap. III — Calculs approchés, support S3</p>

      {/* PARTIE 1 : THÉORIE */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 1 — Théorie
        </h2>

        <h3 className="font-bold mt-3 mb-2">Objectif</h3>
        <p className="text-sm mb-3">
          Soit y = f(x) une fonction continue sur un intervalle [a, b].
          La méthode de dichotomie permet de <strong>trouver la racine x*</strong> telle que f(x*) = 0.
        </p>

        <h3 className="font-bold mb-2">Principe</h3>
        <p className="text-sm mb-3">
          Si f(a) et f(b) sont de signes contraires (f(a)×f(b) &lt; 0), il existe au moins
          une valeur x* ∈ [a, b] telle que f(x*) = 0. La méthode consiste à
          <strong> rétrécir l'intervalle [a, b]</strong> jusqu'à faire confondre a et b,
          donc a = b = x*.
        </p>

        <h3 className="font-bold mb-2">Hypothèses</h3>
        <ul className="list-disc ml-5 text-sm space-y-1 mb-3">
          <li>f est <strong>continue</strong> sur [a, b]</li>
          <li><strong>f(a) × f(b) &lt; 0</strong> (f change de signe sur [a, b])</li>
          <li>Si f est <strong>monotone</strong> sur [a, b], la racine est unique</li>
        </ul>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="success-box text-sm">
            <strong>✓ Avantages</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Simple et robuste</li>
              <li>Convergence garantie si hypothèses vérifiées</li>
              <li>Facile à implémenter</li>
            </ul>
          </div>
          <div className="note-box text-sm">
            <strong>⚠ Limites</strong>
            <ul className="list-disc ml-4 mt-1 space-y-1">
              <li>Convergence lente (linéaire)</li>
              <li>Nécessite un intervalle [a,b] connu</li>
              <li>Nécessite f(a)×f(b) &lt; 0</li>
            </ul>
          </div>
        </div>
      </section>

      {/* PARTIE 2 : DÉMONSTRATION */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 2 — D'où vient la formule ?
        </h2>

        <div className="space-y-3 text-sm">
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <strong>Étape 1 :</strong> On sait que f(a)×f(b) &lt; 0 → par le théorème des valeurs
            intermédiaires, ∃ x* ∈ [a,b] tel que f(x*) = 0.
          </div>
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <strong>Étape 2 :</strong> On calcule le <strong>milieu</strong> de l'intervalle :
            <code className="bg-gray-100 px-2 py-0.5 ml-2 rounded font-bold">c = (a + b) / 2</code>
          </div>
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <strong>Étape 3 :</strong> On calcule f(c) et on teste le signe :
            <ul className="list-disc ml-5 mt-1 space-y-1">
              <li>Si <strong>f(a)×f(c) &lt; 0</strong> → la racine est dans [a, c] → on pose <strong>b = c</strong></li>
              <li>Sinon → la racine est dans [c, b] → on pose <strong>a = c</strong></li>
            </ul>
          </div>
          <div className="border-l-4 border-blue-400 pl-4 py-1">
            <strong>Étape 4 :</strong> Si |a − b| &lt; ε, on affiche x* = (a+b)/2. Sinon, retour à l'étape 2.
          </div>
          <div className="border-l-4 border-green-500 pl-4 py-1 bg-green-50">
            <strong>Convergence :</strong> À chaque étape, l'intervalle est divisé par 2.
            Après n étapes, la largeur est <strong>(b−a)/2ⁿ</strong>.
            Pour ε = 10⁻¹⁰ sur [0,1] : n ≈ 33 itérations suffisent.
          </div>
        </div>

        {/* Visual explanation */}
        <div className="mt-5 border border-gray-200 rounded p-4 bg-gray-50">
          <p className="text-xs text-gray-500 mb-3 font-semibold">ILLUSTRATION — Réduction de l'intervalle</p>
          <svg viewBox="0 0 500 140" className="w-full max-w-lg mx-auto block">
            {/* Axe */}
            <line x1="30" y1="70" x2="470" y2="70" stroke="#ccc" strokeWidth="1"/>
            {/* Iteration 0 */}
            <text x="30" y="20" fontSize="10" fill="#666">Itération 1</text>
            <line x1="30" y1="30" x2="470" y2="30" stroke="#2196f3" strokeWidth="6" strokeLinecap="round" opacity="0.4"/>
            <text x="28" y="44" fontSize="9" fill="#333">a</text>
            <text x="463" y="44" fontSize="9" fill="#333">b</text>
            <line x1="250" y1="25" x2="250" y2="35" stroke="#e53935" strokeWidth="2"/>
            <text x="244" y="44" fontSize="9" fill="#e53935">c</text>
            {/* Iteration 2 */}
            <text x="30" y="62" fontSize="10" fill="#666">Itération 2</text>
            <line x1="250" y1="72" x2="470" y2="72" stroke="#2196f3" strokeWidth="6" strokeLinecap="round" opacity="0.5"/>
            <text x="248" y="86" fontSize="9" fill="#333">a</text>
            <text x="463" y="86" fontSize="9" fill="#333">b</text>
            <line x1="360" y1="67" x2="360" y2="77" stroke="#e53935" strokeWidth="2"/>
            <text x="354" y="86" fontSize="9" fill="#e53935">c</text>
            {/* Iteration 3 */}
            <text x="30" y="104" fontSize="10" fill="#666">Itération 3</text>
            <line x1="250" y1="114" x2="360" y2="114" stroke="#2196f3" strokeWidth="6" strokeLinecap="round" opacity="0.6"/>
            <text x="248" y="128" fontSize="9" fill="#333">a</text>
            <text x="354" y="128" fontSize="9" fill="#333">b</text>
            <line x1="305" y1="109" x2="305" y2="119" stroke="#e53935" strokeWidth="2"/>
            <text x="299" y="128" fontSize="9" fill="#e53935">c</text>
            {/* Star = root */}
            <text x="290" y="100" fontSize="10" fill="#04aa6d" fontWeight="bold">→ x*</text>
          </svg>
          <p className="text-xs text-center text-gray-500 mt-1">L'intervalle est divisé par 2 à chaque étape</p>
        </div>
      </section>

      {/* PARTIE 3 : ALGORITHME */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 3 — Algorithme
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-sm mb-2">Pseudo-code</h3>
            <CodeBlock type="algo" code={`Algorithme Dichotomie
Variables a, b, c, ya, yc, e : Réels
Début
  Lire(a, b, e)
  ya = f(a)
  tantque abs(a - b) > e faire
    c = (a + b) / 2
    yc = f(c)
    si ya * yc < 0 alors
      b = c
    sinon
      a = c
      ya = yc
    finsi
  fintantque
  Ecrire('Racine x = ', (a+b)/2)
Fin`} />
          </div>
          <div>
            <h3 className="font-bold text-sm mb-2">Traduction MATLAB (du cours)</h3>
            <CodeBlock type="matlab" code={`% f(x) = exp(x) + 3x - 2
% Intervalle [0,1], ε = 1e-10
a = 0;
b = 1;
e = 0.0000000001;
ya = exp(a) + 3*a - 2;
yb = exp(b) + 3*b - 2;
while abs(a-b) > e
  c = (a+b)/2;
  yc = exp(c) + 3*c - 2;
  if ya*yc < 0
    b = c;
  else
    a = c;
    ya = exp(a)+3*a-2;
  end
end
fprintf('racine x=%f\n', c);`} />
          </div>
        </div>
      </section>

      {/* PARTIE 4 : SIMULATEUR */}
      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 bg-[#04aa6d] text-white px-3 py-1 rounded">
          Partie 4 — Simulateur Pas à Pas
        </h2>
        <DichotomieSimulator />
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/methodes" className="text-sm text-[#04aa6d] hover:underline">← Méthodes</Link>
        <Link href="/methodes/newton" className="text-sm text-[#04aa6d] hover:underline">Méthode de Newton →</Link>
      </div>
    </div>
  );
}
