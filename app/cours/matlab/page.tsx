import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

export const metadata = { title: "MATLAB - E-DEVY" };

export default function MatlabPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/cours" className="hover:underline">Cours</Link> › MATLAB
      </div>
      <h1 className="text-2xl font-bold mb-1">Chap. II — Premier pas avec MATLAB</h1>
      <p className="text-gray-500 text-sm mb-6">Source : support de cours S3 — Université d'Antananarivo</p>

      {/* I. Intro */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">I. Introduction</h2>
        <p className="mb-3">
          <strong>MATLAB</strong>, abréviation de <em>MATrix LABoratory</em>, est un logiciel développé par
          MathWorks sous Windows, Linux et Mac, dédié au <strong>calcul numérique</strong>.
        </p>
        <p className="mb-3">
          MATLAB est une application scientifique interactive orientée au calcul vectoriel et matriciel
          avec une puissante librairie de visualisation. On peut résoudre des problèmes très complexes
          d'une façon simple et rapide, comparée aux langages C ou FORTRAN.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold text-sm mb-2">Mode interactif</h3>
            <p className="text-sm text-gray-700">
              MATLAB exécute les instructions au fur et à mesure qu'elles sont données
              par l'usager depuis la <strong>Command Window</strong> (comme les commandes DOS).
            </p>
            <pre className="code-matlab text-xs mt-2">{`>> A = 2
A =
   2
>> B = 3;
>> C = A + B
C =
   5`}</pre>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-bold text-sm mb-2">Mode exécutif (fichier .m)</h3>
            <p className="text-sm text-gray-700">
              MATLAB exécute ligne par ligne un <strong>fichier .m</strong>. On tape le nom du
              fichier sans extension dans la Command Window.
            </p>
            <pre className="code-matlab text-xs mt-2">{`% Fichier: monscript.m
A = 2;
B = 3;
C = A + B
% Lancer avec : >> monscript`}</pre>
          </div>
        </div>
        <div className="note-box text-sm mt-3">
          <strong>;</strong> à la fin d'une commande → résultat <em>non affiché</em> à l'écran.
          Sans <strong>;</strong> → résultat affiché.
        </div>
      </section>

      {/* II. Variables */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">II. Les variables en MATLAB</h2>
        <p className="mb-3">
          MATLAB travaille essentiellement avec un seul type d'objet :
          les <strong>matrices de dimension m × n</strong> (m lignes × n colonnes).
        </p>
        <table className="data-table mb-4">
          <thead>
            <tr><th>Type</th><th>Dimension</th><th>Exemple MATLAB</th><th>Résultat affiché</th></tr>
          </thead>
          <tbody>
            <tr>
              <td>Vecteur ligne</td><td>1 × n</td>
              <td><code>vl = [1 2 3 4]</code></td>
              <td><code>1   2   3   4</code></td>
            </tr>
            <tr>
              <td>Vecteur colonne</td><td>m × 1</td>
              <td><code>vc = [1;2;3;4]</code></td>
              <td><code>1 / 2 / 3 / 4</code></td>
            </tr>
            <tr>
              <td>Matrice</td><td>m × n</td>
              <td><code>m = [1 2 3; 4 5 6]</code></td>
              <td>2 lignes × 3 colonnes</td>
            </tr>
            <tr>
              <td>Scalaire</td><td>1 × 1</td>
              <td><code>s = 2</code></td>
              <td><code>2</code></td>
            </tr>
          </tbody>
        </table>

        <h3 className="font-bold mt-4 mb-2">Exemples complets</h3>
        <CodeBlock type="matlab" code={`% Vecteur ligne
vl = [1 2 3 4]
% Résultat : vl =  1  2  3  4

% Vecteur colonne
vc = [1;2;3;4]
% Résultat :  vc =
%              1
%              2
%              3
%              4

% Matrice 2x3
m = [1 2 3; 4 5 6]
% Résultat :  m =
%              1  2  3
%              4  5  6

% Scalaire (sans crochets possible)
s = 2`} />
        <div className="info-box text-sm mt-3">
          Les colonnes sont séparées par des <strong>espaces ou virgules</strong>.
          Les lignes sont séparées par des <strong>points-virgules</strong> ou un <strong>retour à la ligne</strong>.
        </div>
      </section>

      {/* III. Operateurs */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">III. Les opérateurs mathématiques</h2>

        <h3 className="font-bold mb-2">III.1. Addition (+) et Soustraction (−)</h3>
        <p className="text-sm mb-3">
          Pour des scalaires : opération habituelle. Pour des matrices : opération <strong>membre à membre</strong>
          — les dimensions doivent être identiques.
        </p>
        <CodeBlock type="matlab" code={`A = [1 2; 3 4];
B = [5 6; 7 8];
C = A + B   % C = [6 8; 10 12]
D = A - B   % D = [-4 -4; -4 -4]`} />

        <h3 className="font-bold mt-5 mb-2">III.2. Multiplication (*) et Puissance (^)</h3>
        <table className="data-table mb-3 text-sm">
          <thead>
            <tr><th>Opérateur</th><th>Description</th><th>Exemple</th></tr>
          </thead>
          <tbody>
            <tr><td><code>A * B</code></td><td>Multiplication matricielle (règles algébriques)</td><td><code>[1 2]*[3;4] = 11</code></td></tr>
            <tr><td><code>A .* B</code></td><td>Multiplication membre à membre</td><td><code>[1 2].*[3 4] = [3 8]</code></td></tr>
            <tr><td><code>A ^ n</code></td><td>Puissance matricielle</td><td><code>A^2 = A*A</code></td></tr>
            <tr><td><code>A .^ n</code></td><td>Puissance élément par élément</td><td><code>[2 3].^2 = [4 9]</code></td></tr>
          </tbody>
        </table>

        <h3 className="font-bold mt-5 mb-2">III.3. Division (/ et \)</h3>
        <CodeBlock type="matlab" code={`% Scalaires
a = 10; b = 2;
c = a/b    % c = 5  (division habituelle)
d = a\b    % d = b/a = 0.2

% Matrices : A/B = A*inv(B),  A\B = inv(A)*B`} />

        <h3 className="font-bold mt-5 mb-2">III.4. Fonctions mathématiques</h3>
        <p className="text-sm mb-3">
          Les fonctions s'appliquent à chaque élément d'une matrice :
        </p>
        <CodeBlock type="matlab" code={`% Fonctions usuelles
log(A)      % logarithme naturel (base e)
log10(A)    % logarithme base 10
sqrt(A)     % racine carrée
exp(A)      % exponentielle
abs(A)      % valeur absolue
mod(a,b)    % modulo (reste de a/b)

% Trigonométrie
sin(A)  cos(A)  tan(A)
asin(A) acos(A) atan(A)

% Exemple
x = [0 pi/6 pi/4 pi/3 pi/2];
y = sin(x)   % y = [0, 0.5, 0.707, 0.866, 1]`} />
      </section>

      {/* IV. Entree/Sortie */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">IV. Entrée / Sortie</h2>

        <h3 className="font-bold mb-2">IV.1. Entrée : fonction input</h3>
        <CodeBlock type="matlab" code={`% Syntaxe
NomDeVariable = input('message');

% Exemples du cours
Variable = input('entrer la valeur de votre variable :');
% Affiche : entrer la valeur de votre variable :

n = input('n = ');
% Si l'utilisateur tape 15 → n = 15
% Si l'utilisateur tape [1 2 3] → n est un vecteur
% Si l'utilisateur tape [1 2; 3 4] → n est une matrice 2x2`} />

        <h3 className="font-bold mt-5 mb-2">IV.2. Sortie : fonction disp</h3>
        <CodeBlock type="matlab" code={`% Afficher un scalaire
Variable1 = 10;
disp(Variable1);          % Affiche : 10

% Afficher une chaîne
disp('nom et prénom');    % Affiche : nom et prénom

% Afficher un vecteur
disp([1 2 3]);            % Affiche : 1   2   3

% Afficher une matrice
disp([1 2 3; 4 5 6]);
% Affiche :  1  2  3
%            4  5  6`} />

        <h3 className="font-bold mt-5 mb-2">Astuce : num2str — mélanger texte et nombre</h3>
        <div className="info-box text-sm mb-3">
          La fonction <code>num2str</code> convertit un nombre en chaîne pour l'afficher
          à côté d'un texte.
        </div>
        <CodeBlock type="matlab" code={`age = 20;
str = 'Votre age est : ';

% MAUVAIS : ne pas utiliser v = [str, age]
% → n'affiche pas la valeur de age

% BON : utiliser num2str
v = [str, num2str(age)];
disp(v);    % Affiche : Votre age est : 20`} />
      </section>

      {/* V. Fichiers m */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">V. Les fichiers m (scripts et fonctions)</h2>

        <h3 className="font-bold mb-2">V.1. Fichier SCRIPT</h3>
        <p className="text-sm mb-3">
          Regroupe des séries de commandes. Les instructions s'exécutent séquentiellement.
        </p>
        <CodeBlock type="matlab" title="Script: facto2.m" code={`n = input('Entrer un nombre entier positif n = ');
f = fact2(n);
disp(['f = ', num2str(f)]);`} />

        <h3 className="font-bold mt-5 mb-2">V.2. Fichier FUNCTION</h3>
        <p className="text-sm mb-3">
          Effectue des opérations à partir d'entrées et fournit des sorties.
          Le <strong>nom du fichier doit être identique au nom de la fonction</strong>.
        </p>
        <CodeBlock type="matlab" code={`[sortie1, sortie2, ...] = nomfonction(entree1, entree2, ...)`} title="Syntaxe" />

        <h3 className="font-bold mt-4 mb-2">Exemple du cours — surfacevolume.m</h3>
        <CodeBlock type="matlab" title="Fichier: surfacevolume.m" code={`function [S, V] = surfacevolume(r)
    S = 4*pi*r^2;                          % surface d'une sphère
    V = 4*pi*r^3/3;                        % volume d'une sphère
    disp(['Surface : ', num2str(S)]);
    disp(['Volume : ', num2str(V)]);
end`} />
        <CodeBlock type="matlab" title="Utilisation dans Command Window" code={`>> r = 10;
>> [S, V] = surfacevolume(r);
Surface : 1256.6371
Volume : 4188.7902`} />

        <h3 className="font-bold mt-5 mb-2">Exemple du cours — fact2.m (fonction récursive)</h3>
        <CodeBlock type="matlab" title="Fichier Function: fact2.m" code={`function [f] = fact2(n)
    if n <= 1
        f = 1;
    else
        f = 1;
        for ii = 2:n
            f = f * ii;
        end
    end
end`} />
        <div className="note-box text-sm mt-2">
          <strong>Fonction récursive :</strong> une fonction est récursive si elle s'appelle
          elle-même. Utile pour les calculs comme la factorielle.
        </div>
      </section>

      {/* VI. Structures de controle */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-3 text-[#04aa6d]">VI. Structures de contrôle</h2>
        <p className="text-sm mb-4">
          Tableau de correspondance Algorithme ↔ MATLAB (extrait du cours) :
        </p>
        <div className="overflow-x-auto">
          <table className="data-table text-sm">
            <thead>
              <tr><th>Algorithme</th><th>MATLAB</th></tr>
            </thead>
            <tbody>
              <tr>
                <td><pre className="text-xs">{`si expression alors
  instructions
finsi`}</pre></td>
                <td><pre className="text-xs">{`if expression
  instructions
end`}</pre></td>
              </tr>
              <tr>
                <td><pre className="text-xs">{`si expr alors
  instructions 1
sinon
  instructions 2
finsi`}</pre></td>
                <td><pre className="text-xs">{`if expression
  instructions 1
else
  instructions 2
end`}</pre></td>
              </tr>
              <tr>
                <td><pre className="text-xs">{`selon variable
  val1: instructions1
  val2: instructions2
sinon
  instructions
finselon`}</pre></td>
                <td><pre className="text-xs">{`switch variable
  case val1
    instructions1
  case val2
    instructions2
  otherwise
    instructions
end`}</pre></td>
              </tr>
              <tr>
                <td><pre className="text-xs">{`tantque condition faire
  instructions
fintantque`}</pre></td>
                <td><pre className="text-xs">{`while condition
  instructions
end`}</pre></td>
              </tr>
              <tr>
                <td><pre className="text-xs">{`pour var de debut à fin par pas faire
  instructions
finpour`}</pre></td>
                <td><pre className="text-xs">{`for var = debut:pas:fin
  instructions
end`}</pre></td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="font-bold mt-6 mb-3">Exercices MATLAB du cours</h3>

        <div className="space-y-4">
          <div className="border border-gray-200 rounded p-4">
            <p className="font-semibold text-sm mb-3">Exercice 3 — Résolution équation 2nd degré (x²−4x+2=0)</p>
            <CodeBlock type="matlab" title="Script: equat2nd.m" code={`disp('Résolution d''une équation de 2nd degré ax2+bx+c=0');
a = input('a = ');
b = input('b = ');
c = input('c = ');
d = delta(a, b, c);
if d < 0
    disp('pas de solution réelle');
elseif d > 0
    disp('deux racines distinctes');
    x1 = (-b - sqrt(d)) / (2*a);
    x2 = (-b + sqrt(d)) / (2*a);
    disp(['x1 = ', num2str(x1)]);
    disp(['x2 = ', num2str(x2)]);
else
    disp('une racine double');
    x1 = -b / (2*a);
    disp(['x1 = x2 = ', num2str(x1)]);
end`} />
            <CodeBlock type="matlab" title="Function: delta.m" code={`function [d] = delta(a, b, c)
    d = b^2 - 4*a*c;
end`} />
            <div className="success-box text-sm mt-2">
              Pour x²−4x+2=0 : delta = 8 → x1 ≈ 0.5858, x2 ≈ 3.4142
            </div>
          </div>

          <div className="border border-gray-200 rounded p-4">
            <p className="font-semibold text-sm mb-3">Exercice 4 — Plus grand parmi a, b, c (a=1.2, b=−14, c=130)</p>
            <CodeBlock type="matlab" title="Script: plusgrandnombre.m" code={`a = input('a = ');
b = input('b = ');
c = input('c = ');
if a > b
    maxabc = a;
else
    maxabc = b;
end
if c > maxabc
    maxabc = c;
end
disp(['max entre a,b,c : ', num2str(maxabc)]);`} />
            <div className="success-box text-sm mt-2">
              Pour a=1.2, b=−14, c=130 → max = 130
            </div>
          </div>
        </div>
      </section>

      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/cours/organigrammes" className="text-sm text-[#04aa6d] hover:underline">← Organigrammes</Link>
        <Link href="/methodes" className="text-sm text-[#04aa6d] hover:underline">Méthodes Numériques →</Link>
      </div>
    </div>
  );
}
