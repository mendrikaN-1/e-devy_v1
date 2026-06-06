import CodeBlock from "@/components/CodeBlock";
import Link from "next/link";

export const metadata = {
  title: "Algorithmique - E-DEVY",
};

export default function AlgorithmiquePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/cours" className="hover:underline">Cours</Link> › Algorithmique
      </div>

      <h1 className="text-2xl font-bold mb-1">Chap. I — Algorithmique et Organigrammes</h1>
      <p className="text-gray-500 text-sm mb-6">Source : support de cours S3 — Université d'Antananarivo</p>

      {/* I. Définition */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">I. L'Algorithmique</h2>
        <p className="mb-3">
          L'algorithmique est la science des algorithmes utilisés notamment en informatique.
          Elle consiste en la <strong>conception et la rédaction d'algorithmes</strong>.
        </p>
        <p className="mb-3">
          Le mot « algorithme » vient du nom du mathématicien <strong>Al Khuwarizmi</strong> (latinisé
          en <em>Algoritmi</em>), qui a écrit le premier ouvrage systématique donnant des solutions
          aux équations linéaires et quadratiques.
        </p>
        <div className="success-box">
          <strong>Définition :</strong> Un algorithme est une suite finie et non-ambiguë
          d'instructions permettant de donner la réponse à un problème.
        </div>
        <p className="mt-3 font-semibold">Un algorithme doit avoir les propriétés suivantes :</p>
        <ul className="list-disc ml-6 mt-2 text-sm space-y-1">
          <li>Il est <strong>fini</strong> et se termine après un nombre fini d'opérations</li>
          <li>Il est défini <strong>sans ambiguïté</strong></li>
          <li>Il manipule des objets qui sont définis de façon <strong>précise</strong></li>
          <li>Il doit avoir <strong>au moins un résultat</strong></li>
        </ul>

        <h3 className="font-bold mt-5 mb-2">Exemple : Calcul de la surface d'un disque</h3>
        <CodeBlock type="algo" code={`Algorithme Surface
Variables R, S : Réels
Début
  Ecrire('entrer le rayon du disque R')
  Lire(R)
  S = π * R²
  Ecrire(S)
Fin`} />
      </section>

      {/* III-1 SI */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III-1. Structure SI … ALORS … SINON</h2>
        <p className="mb-3">
          Permet de faire un choix entre deux possibilités selon qu'une condition est vraie ou fausse.
        </p>
        <CodeBlock type="algo" code={`si expression vraie alors
    Bloc 1 d'instructions
sinon
    Bloc 2 d'instructions
finsi`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple — Vérification du rayon</h3>
        <CodeBlock type="algo" code={`si R > 0 alors
    S = π * R²
    Ecrire('Surface =', S)
sinon
    Ecrire('Erreur : rayon doit être positif')
finsi`} />
        <div className="note-box text-sm mt-3">
          <strong>⚠ Attention :</strong> Si la condition est fausse ET qu'il n'y a pas de SINON,
          on passe simplement à la suite sans rien faire.
        </div>

        <h3 className="font-bold mt-5 mb-2">Exemple — Résoudre ax² + bx + c = 0</h3>
        <p className="text-sm text-gray-600 mb-2">
          On imbrique deux SI pour gérer les trois cas (delta &lt; 0, delta &gt; 0, delta = 0) :
        </p>
        <CodeBlock type="algo" code={`Algorithme Resolution_2nd_degre
Variables a, b, c, delta, x1, x2 : Réels
Début
  Lire(a, b, c)
  delta = b*b - 4*a*c
  si delta < 0 alors
    Ecrire('Pas de solution réelle')
  sinon
    si delta > 0 alors
      x1 = (-b - sqrt(delta)) / (2*a)
      x2 = (-b + sqrt(delta)) / (2*a)
      Ecrire(x1, x2)
    sinon
      x1 = -b / (2*a)
      Ecrire(x1)
    finsi
  finsi
Fin`} />
      </section>

      {/* III-2 SELON */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III-2. Structure SELON (choix multiples)</h2>
        <p className="mb-3">
          Quand le nombre de cas augmente, imbriquer plusieurs SI devient lourd.
          La structure <strong>SELON</strong> compare une variable avec une série de valeurs.
        </p>
        <CodeBlock type="algo" code={`selon variable
    C1 : BLOC 1 D'INSTRUCTIONS    /* variable = C1 */
    C2 : BLOC 2 D'INSTRUCTIONS    /* variable = C2 */
    C3 : BLOC 3 D'INSTRUCTIONS    /* variable = C3 */
    ...
    Cn : BLOC n D'INSTRUCTIONS    /* variable = Cn */
sinon
    BLOC n+1 D'INSTRUCTIONS       /* aucun cas ci-dessus */
finselon`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple — Jour de la semaine</h3>
        <CodeBlock type="algo" code={`Variables jour : Entier
Début
  Lire(jour)
  selon jour
    1 : Ecrire('Lundi')
    2 : Ecrire('Mardi')
    3 : Ecrire('Mercredi')
    4 : Ecrire('Jeudi')
    5 : Ecrire('Vendredi')
  sinon
    Ecrire('Week-end')
  finselon
Fin`} />
        <div className="info-box text-sm mt-3">
          En MATLAB, la structure SELON se traduit par <code>switch / case / otherwise / end</code>.
        </div>
      </section>

      {/* III-3 TANTQUE */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III-3. La boucle TANTQUE</h2>
        <p className="mb-3">
          Exécute un bloc d'instructions <strong>tant qu'une condition est vraie</strong>.
          La condition est testée <em>avant</em> d'entrer dans la boucle.
        </p>
        <CodeBlock type="algo" code={`tantque condition est vraie faire
    BLOC D'INSTRUCTIONS
fintantque`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple — Afficher les entiers de 1 à 5</h3>
        <CodeBlock type="algo" code={`Variables i : Entier
Début
  i = 1
  tantque i <= 5 faire
    Ecrire(i)
    i = i + 1
  fintantque
Fin`} />
        <div className="note-box text-sm mt-2">
          <strong>Important :</strong> Si la condition est fausse dès le départ,
          le bloc ne s'exécute <em>jamais</em>. Ne pas oublier de modifier la variable
          de condition dans la boucle pour éviter une boucle infinie !
        </div>

        <h3 className="font-bold mt-5 mb-2">Traduction MATLAB</h3>
        <CodeBlock type="matlab" code={`i = 1;
while i <= 5
    disp(i);
    i = i + 1;
end`} />
      </section>

      {/* III-4 REPETER */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III-4. La boucle REPETER … JUSQUA</h2>
        <p className="mb-3">
          Différence clé avec TANTQUE : le bloc s'exécute <strong>au moins une fois</strong>
          car la condition est testée <em>après</em> le bloc.
        </p>
        <CodeBlock type="algo" code={`repeter
    BLOC D'INSTRUCTIONS
jusqua condition est vraie`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple — Saisie avec validation</h3>
        <CodeBlock type="algo" code={`Variables n : Entier
Début
  repeter
    Ecrire('Entrer un entier positif')
    Lire(n)
  jusqua n > 0
  Ecrire('Valeur acceptée :', n)
Fin`} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-gray-200 rounded p-3 text-sm">
            <strong className="block mb-1">TANTQUE</strong>
            <ul className="list-disc ml-4 space-y-1 text-gray-700">
              <li>Condition testée <strong>avant</strong></li>
              <li>Peut ne jamais s'exécuter</li>
              <li>Arrêt quand condition fausse</li>
            </ul>
          </div>
          <div className="border border-gray-200 rounded p-3 text-sm">
            <strong className="block mb-1">REPETER … JUSQUA</strong>
            <ul className="list-disc ml-4 space-y-1 text-gray-700">
              <li>Condition testée <strong>après</strong></li>
              <li>S'exécute au moins 1 fois</li>
              <li>Arrêt quand condition vraie</li>
            </ul>
          </div>
        </div>
      </section>

      {/* III-5 POUR */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III-5. L'instruction POUR</h2>
        <p className="mb-3">
          Utilisée quand on connaît <strong>à l'avance le nombre d'itérations</strong>.
          Un compteur évolue de la valeur initiale à la valeur finale par un pas donné.
        </p>
        <CodeBlock type="algo" code={`pour compteur de initiale à finale par pas faire
    Bloc d'instructions
finpour`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple — Calcul de n!</h3>
        <p className="text-sm text-gray-600 mb-2">
          Algorithme du cours (Exercice 2) :
        </p>
        <CodeBlock type="algo" code={`Algorithme Factoriel
Variables n, f, i : Entiers
Début
  Lire(n)
  f = 1
  pour i de 2 à n par 1 faire
    f = f * i
  finpour
  Ecrire('n! =', f)
Fin`} />

        <h3 className="font-bold mt-4 mb-2">Trace d'exécution pour n = 5</h3>
        <table className="data-table mt-2">
          <thead>
            <tr>
              <th>Itération</th>
              <th>i</th>
              <th>f = f × i</th>
            </tr>
          </thead>
          <tbody>
            {[
              ["Avant boucle", "—", "f = 1"],
              ["1", "2", "f = 1 × 2 = 2"],
              ["2", "3", "f = 2 × 3 = 6"],
              ["3", "4", "f = 6 × 4 = 24"],
              ["4", "5", "f = 24 × 5 = 120"],
            ].map(([it, i, f]) => (
              <tr key={it}>
                <td>{it}</td>
                <td>{i}</td>
                <td>{f}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-sm text-green-700 mt-2">✓ Résultat : 5! = 120</p>

        <h3 className="font-bold mt-5 mb-2">Traduction MATLAB</h3>
        <CodeBlock type="matlab" code={`n = input('n = ');
f = 1;
for i = 2:1:n
    f = f * i;
end
disp(['n! = ', num2str(f)]);`} />
      </section>

      {/* Exercices du cours */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">IV. Exercices du cours</h2>
        <div className="space-y-4">
          {[
            { n: 1, text: "Trouver le plus grand parmi trois nombres a, b, c." },
            { n: 2, text: "Calculer n !" },
            { n: 3, text: "Calculer C(n, k) = n! / (k! × (n−k)!)" },
            { n: 4, text: "Résoudre une équation du second degré (solutions réelles)." },
          ].map((ex) => (
            <div key={ex.n} className="border border-gray-200 rounded p-4">
              <p className="font-semibold text-sm mb-2">Exercice {ex.n} — {ex.text}</p>
              <Link
                href={`/exercices?id=${ex.n}`}
                className="text-xs text-[#04aa6d] hover:underline"
              >
                Voir la solution complète →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/cours" className="text-sm text-[#04aa6d] hover:underline">
          ← Retour aux cours
        </Link>
        <Link href="/cours/organigrammes" className="text-sm text-[#04aa6d] hover:underline">
          Organigrammes →
        </Link>
      </div>
    </div>
  );
}
