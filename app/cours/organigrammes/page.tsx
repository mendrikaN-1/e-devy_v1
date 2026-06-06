import Link from "next/link";

export const metadata = { title: "Organigrammes - E-DEVY" };

// SVG symbols
const OvalShape = ({ text }: { text: string }) => (
  <svg viewBox="0 0 140 50" width="140" height="50">
    <ellipse cx="70" cy="25" rx="65" ry="22" fill="#04aa6d" stroke="#027a4f" strokeWidth="2"/>
    <text x="70" y="30" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">{text}</text>
  </svg>
);

const RectShape = ({ text, sub }: { text: string; sub?: string }) => (
  <svg viewBox="0 0 160 55" width="160" height="55">
    <rect x="5" y="5" width="150" height="45" fill="#e8f5e9" stroke="#04aa6d" strokeWidth="2" rx="2"/>
    <text x="80" y={sub ? "24" : "32"} textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">{text}</text>
    {sub && <text x="80" y="42" textAnchor="middle" fill="#555" fontSize="10">{sub}</text>}
  </svg>
);

const ParallelShape = ({ text }: { text: string }) => (
  <svg viewBox="0 0 160 55" width="160" height="55">
    <polygon points="20,5 155,5 140,50 5,50" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2"/>
    <text x="80" y="32" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">{text}</text>
  </svg>
);

const DiamondShape = ({ text }: { text: string }) => (
  <svg viewBox="0 0 160 80" width="160" height="80">
    <polygon points="80,5 155,40 80,75 5,40" fill="#fff3e0" stroke="#ff9800" strokeWidth="2"/>
    <text x="80" y="44" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="bold">{text}</text>
  </svg>
);

const Arrow = () => (
  <svg viewBox="0 0 20 30" width="20" height="30">
    <line x1="10" y1="0" x2="10" y2="20" stroke="#666" strokeWidth="2"/>
    <polygon points="5,20 15,20 10,28" fill="#666"/>
  </svg>
);

export default function OrganigrammesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/cours" className="hover:underline">Cours</Link> › Organigrammes
      </div>

      <h1 className="text-2xl font-bold mb-1">II. Organigrammes</h1>
      <p className="text-gray-500 text-sm mb-6">Source : support de cours S3 — Université d'Antananarivo</p>

      <section className="mb-8">
        <p className="mb-4">
          L'organigramme en informatique est la <strong>représentation graphique d'un algorithme</strong>,
          visant à mettre en valeur sa structure. Cette représentation est faite avec des
          <strong> figures géométriques normalisées</strong>.
        </p>

        {/* Symbols table */}
        <h2 className="text-xl font-bold mb-4 text-[#04aa6d]">Symboles normalisés</h2>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Symbole</th>
                <th>Nom</th>
                <th>Description</th>
                <th>Exemple</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center py-3">
                  <OvalShape text="Début" />
                </td>
                <td className="font-semibold">Début / Fin</td>
                <td className="text-sm">Début, fin ou interruption d'un organigramme</td>
                <td className="text-sm font-mono">Début, Fin</td>
              </tr>
              <tr>
                <td className="text-center py-3">
                  <RectShape text="S = π × R²" />
                </td>
                <td className="font-semibold">Traitement</td>
                <td className="text-sm">Opération ou groupe d'opérations sur des données</td>
                <td className="text-sm font-mono">S = π * R²</td>
              </tr>
              <tr>
                <td className="text-center py-3">
                  <ParallelShape text="Rayon" />
                </td>
                <td className="font-semibold">Entrée / Sortie</td>
                <td className="text-sm">Mise à disposition ou enregistrement d'une information</td>
                <td className="text-sm font-mono">Lire(R), Ecrire(S)</td>
              </tr>
              <tr>
                <td className="text-center py-3">
                  <DiamondShape text="R > 0 ?" />
                </td>
                <td className="font-semibold">Décision (Test)</td>
                <td className="text-sm">Branchement conditionnel — aiguillage OUI/NON</td>
                <td className="text-sm font-mono">si R &gt; 0</td>
              </tr>
              <tr>
                <td className="text-center py-3">
                  <RectShape text="Factoriel(n)" sub="sous-programme" />
                </td>
                <td className="font-semibold">Fonction / Sous-programme</td>
                <td className="text-sm">Portion de programme considérée comme une opération</td>
                <td className="text-sm font-mono">y = sin(x)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Example: Surface d'un disque */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#04aa6d]">
          Exemple 1 — Surface d'un disque
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Organigramme correspondant à l'algorithme Surface du cours :
        </p>
        <div className="flex flex-col items-center gap-1 border border-gray-200 rounded p-6 bg-gray-50">
          <OvalShape text="Début" />
          <Arrow />
          <ParallelShape text="Lire Rayon R" />
          <Arrow />
          <RectShape text="Surface = π × R²" />
          <Arrow />
          <ParallelShape text="Ecrire Surface" />
          <Arrow />
          <OvalShape text="Fin" />
        </div>
      </section>

      {/* Example with condition */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#04aa6d]">
          Exemple 2 — Structure SI (avec décision)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Organigramme de la structure SI...ALORS...SINON :
        </p>
        <div className="border border-gray-200 rounded p-6 bg-gray-50">
          <svg viewBox="0 0 400 320" width="100%" className="max-w-md mx-auto block">
            {/* Start */}
            <ellipse cx="200" cy="30" rx="70" ry="22" fill="#04aa6d" stroke="#027a4f" strokeWidth="2"/>
            <text x="200" y="35" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Début</text>
            {/* Arrow down */}
            <line x1="200" y1="52" x2="200" y2="78" stroke="#666" strokeWidth="2"/>
            <polygon points="195,74 205,74 200,82" fill="#666"/>
            {/* Diamond */}
            <polygon points="200,85 290,130 200,175 110,130" fill="#fff3e0" stroke="#ff9800" strokeWidth="2"/>
            <text x="200" y="134" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="bold">expression</text>
            <text x="200" y="148" textAnchor="middle" fill="#1a1a1a" fontSize="11" fontWeight="bold">vraie ?</text>
            {/* OUI label */}
            <text x="118" y="148" textAnchor="middle" fill="#04aa6d" fontSize="11" fontWeight="bold">OUI</text>
            {/* NON label */}
            <text x="282" y="148" textAnchor="middle" fill="#e53935" fontSize="11" fontWeight="bold">NON</text>
            {/* Left arrow - OUI */}
            <line x1="110" y1="130" x2="70" y2="130" stroke="#666" strokeWidth="2"/>
            <line x1="70" y1="130" x2="70" y2="200" stroke="#666" strokeWidth="2"/>
            <polygon points="65,196 75,196 70,204" fill="#666"/>
            {/* Right arrow - NON */}
            <line x1="290" y1="130" x2="330" y2="130" stroke="#666" strokeWidth="2"/>
            <line x1="330" y1="130" x2="330" y2="200" stroke="#666" strokeWidth="2"/>
            <polygon points="325,196 335,196 330,204" fill="#666"/>
            {/* Left block */}
            <rect x="20" y="205" width="100" height="40" fill="#e8f5e9" stroke="#04aa6d" strokeWidth="2" rx="2"/>
            <text x="70" y="225" textAnchor="middle" fill="#1a1a1a" fontSize="10">Bloc 1</text>
            <text x="70" y="237" textAnchor="middle" fill="#1a1a1a" fontSize="10">d'instructions</text>
            {/* Right block */}
            <rect x="280" y="205" width="100" height="40" fill="#ffebee" stroke="#e53935" strokeWidth="2" rx="2"/>
            <text x="330" y="225" textAnchor="middle" fill="#1a1a1a" fontSize="10">Bloc 2</text>
            <text x="330" y="237" textAnchor="middle" fill="#1a1a1a" fontSize="10">d'instructions</text>
            {/* Merge arrows */}
            <line x1="70" y1="245" x2="70" y2="285" stroke="#666" strokeWidth="2"/>
            <line x1="70" y1="285" x2="200" y2="285" stroke="#666" strokeWidth="2"/>
            <line x1="330" y1="245" x2="330" y2="285" stroke="#666" strokeWidth="2"/>
            <line x1="330" y1="285" x2="200" y2="285" stroke="#666" strokeWidth="2"/>
            <polygon points="195,281 205,281 200,289" fill="#666"/>
            {/* Suite */}
            <text x="200" y="305" textAnchor="middle" fill="#666" fontSize="11">Suite du programme</text>
          </svg>
        </div>
      </section>

      {/* Boucle POUR organigramme */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-[#04aa6d]">
          Exemple 3 — Boucle POUR (Factorielle)
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Organigramme de l'algorithme Factoriel avec boucle POUR :
        </p>
        <div className="border border-gray-200 rounded p-6 bg-gray-50">
          <svg viewBox="0 0 280 400" width="100%" className="max-w-xs mx-auto block">
            <ellipse cx="140" cy="28" rx="65" ry="22" fill="#04aa6d" stroke="#027a4f" strokeWidth="2"/>
            <text x="140" y="33" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Début</text>
            <line x1="140" y1="50" x2="140" y2="70" stroke="#666" strokeWidth="2"/>
            <polygon points="135,66 145,66 140,74" fill="#666"/>

            <rect x="55" y="72" width="170" height="38" fill="#e8f5e9" stroke="#04aa6d" strokeWidth="2" rx="2"/>
            <text x="140" y="87" textAnchor="middle" fill="#1a1a1a" fontSize="11">n, f=1, i=2</text>
            <text x="140" y="102" textAnchor="middle" fill="#666" fontSize="10">(initialisation)</text>

            <line x1="140" y1="110" x2="140" y2="130" stroke="#666" strokeWidth="2"/>
            <polygon points="135,126 145,126 140,134" fill="#666"/>

            <polygon points="140,135 225,175 140,215 55,175" fill="#fff3e0" stroke="#ff9800" strokeWidth="2"/>
            <text x="140" y="179" textAnchor="middle" fill="#1a1a1a" fontSize="11">i &lt;= n ?</text>

            <text x="60" y="193" textAnchor="middle" fill="#04aa6d" fontSize="11" fontWeight="bold">OUI</text>
            <text x="222" y="193" textAnchor="middle" fill="#e53935" fontSize="11" fontWeight="bold">NON</text>

            <line x1="55" y1="175" x2="20" y2="175" stroke="#666" strokeWidth="2"/>
            <line x1="20" y1="175" x2="20" y2="280" stroke="#666" strokeWidth="2"/>
            <line x1="20" y1="280" x2="55" y2="280" stroke="#666" strokeWidth="2"/>

            <rect x="55" y="220" width="170" height="35" fill="#e8f5e9" stroke="#04aa6d" strokeWidth="2" rx="2"/>
            <text x="140" y="243" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">f = f × i</text>

            <rect x="55" y="265" width="170" height="35" fill="#e8f5e9" stroke="#04aa6d" strokeWidth="2" rx="2"/>
            <text x="140" y="288" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">i = i + 1</text>

            <polygon points="135,276 145,276 140,268" fill="#666"/>
            <line x1="140" y1="255" x2="140" y2="265" stroke="#666" strokeWidth="2"/>

            <line x1="140" y1="300" x2="140" y2="130" stroke="#666" strokeWidth="1.5" strokeDasharray="4"/>

            <line x1="225" y1="175" x2="260" y2="175" stroke="#666" strokeWidth="2"/>
            <line x1="260" y1="175" x2="260" y2="335" stroke="#666" strokeWidth="2"/>
            <line x1="260" y1="335" x2="140" y2="335" stroke="#666" strokeWidth="2"/>
            <polygon points="135,331 145,331 140,339" fill="#666"/>

            <polygon points="55,320 225,320 210,360 70,360" fill="#e3f2fd" stroke="#2196f3" strokeWidth="2"/>
            <text x="140" y="345" textAnchor="middle" fill="#1a1a1a" fontSize="12" fontWeight="bold">Afficher f</text>

            <line x1="140" y1="360" x2="140" y2="375" stroke="#666" strokeWidth="2"/>
            <polygon points="135,371 145,371 140,379" fill="#666"/>

            <ellipse cx="140" cy="388" rx="65" ry="18" fill="#e53935" stroke="#b71c1c" strokeWidth="2"/>
            <text x="140" y="393" textAnchor="middle" fill="white" fontSize="13" fontWeight="bold">Fin</text>
          </svg>
        </div>
      </section>

      {/* Navigation */}
      <div className="flex justify-between mt-8 pt-4 border-t border-gray-200">
        <Link href="/cours/algorithmique" className="text-sm text-[#04aa6d] hover:underline">
          ← Algorithmique
        </Link>
        <Link href="/cours/matlab" className="text-sm text-[#04aa6d] hover:underline">
          MATLAB →
        </Link>
      </div>
    </div>
  );
}
