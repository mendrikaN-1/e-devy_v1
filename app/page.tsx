import Link from "next/link";

const sections = [
  {
    href: "/cours/algorithmique",
    icon: "📐",
    title: "Algorithmique",
    desc: "Variables, conditions SI/SELON, boucles TANTQUE/POUR/REPETER, fonctions et procédures.",
    color: "border-green-500",
  },
  {
    href: "/cours/organigrammes",
    icon: "🔷",
    title: "Organigrammes",
    desc: "Représentation graphique des algorithmes : début/fin, traitement, décision, entrée/sortie.",
    color: "border-blue-500",
  },
  {
    href: "/cours/matlab",
    icon: "🔢",
    title: "MATLAB",
    desc: "Matrices, opérateurs, fonctions mathématiques, scripts, functions, structures de contrôle.",
    color: "border-orange-500",
  },
  {
    href: "/methodes",
    icon: "∫",
    title: "Méthodes Numériques",
    desc: "Dichotomie, Newton, Rectangles, Trapèzes, Simpson — avec visualisation et pas à pas.",
    color: "border-purple-500",
  },
  {
    href: "/pratique",
    icon: "▶",
    title: "Pratique Algo",
    desc: "Simulateur de pseudo-code : exécutez vos algorithmes ligne par ligne avec visualisation mémoire.",
    color: "border-red-500",
  },
  {
    href: "/exercices",
    icon: "✏️",
    title: "Exercices",
    desc: "50 exercices progressifs : débutant, intermédiaire, avancé, expert.",
    color: "border-teal-500",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-[#04aa6d] text-white py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Bienvenue sur E-DEVY</h1>
          <p className="text-lg text-green-100 mb-4">
            Plateforme pédagogique pour les étudiants de l'Université
            d'Antananarivo — S3
          </p>
          <p className="text-green-200 text-sm">
            Apprenez l'algorithmique, les organigrammes, MATLAB et les méthodes
            numériques à partir du support de cours officiel.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/cours/algorithmique"
              className="bg-white text-[#04aa6d] px-4 py-2 rounded font-semibold text-sm hover:bg-green-50 transition-colors"
            >
              Commencer les cours →
            </Link>
            <Link
              href="/pratique"
              className="border border-white text-white px-4 py-2 rounded font-semibold text-sm hover:bg-[#088a5b] transition-colors"
            >
              Simulateur Algo
            </Link>
          </div>
        </div>
      </div>

      {/* Quick intro */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="info-box text-sm">
          <strong>📌 Contenu basé sur le support officiel S3</strong> — Ce site
          suit strictement le cours d'algorithmique et méthodes numériques de
          l'Université d'Antananarivo. Tous les exemples, exercices et
          algorithmes proviennent du support pédagogique.
        </div>

        <h2 className="text-xl font-bold mt-8 mb-4 text-gray-800">
          Que voulez-vous apprendre ?
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={`border-l-4 ${s.color} bg-white border border-gray-200 border-l-4 p-4 rounded hover:shadow-sm transition-shadow`}
            >
              <div className="text-2xl mb-2">{s.icon}</div>
              <h3 className="font-bold text-gray-800 mb-1">{s.title}</h3>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </Link>
          ))}
        </div>

        {/* Quick reference */}
        <h2 className="text-xl font-bold mt-10 mb-4 text-gray-800">
          Référence rapide — Structures de base
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">
              Algorithme
            </h3>
            <pre className="code-algo text-xs">{`si condition alors
    bloc d'instructions
sinon
    bloc d'instructions
finsi`}</pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">
              MATLAB
            </h3>
            <pre className="code-matlab text-xs">{`if condition
    instructions
else
    instructions
end`}</pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">
              Boucle POUR
            </h3>
            <pre className="code-algo text-xs">{`pour i de 1 à n par 1 faire
    bloc d'instructions
finpour`}</pre>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-1 uppercase">
              MATLAB (for)
            </h3>
            <pre className="code-matlab text-xs">{`for i = 1:1:n
    instructions
end`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
