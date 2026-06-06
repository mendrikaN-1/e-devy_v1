import Link from "next/link";

const topics = [
  {
    href: "/cours/algorithmique",
    title: "Algorithmique",
    desc: "Introduction, variables, SI/SELON, boucles TANTQUE/REPETER/POUR, fonctions",
    chapters: 6,
  },
  {
    href: "/cours/organigrammes",
    title: "Organigrammes",
    desc: "Symboles normalisés, représentation graphique des algorithmes, exemples SVG",
    chapters: 4,
  },
  {
    href: "/cours/matlab",
    title: "MATLAB",
    desc: "Variables, matrices, opérateurs, input/disp, scripts, functions, structures de contrôle",
    chapters: 6,
  },
];

export default function CoursIndex() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Cours</h1>
      <p className="text-gray-600 mb-6 text-sm">
        Chaque cours suit strictement le support pédagogique S3 de l'Université
        d'Antananarivo.
      </p>
      <div className="grid gap-4">
        {topics.map((t) => (
          <Link
            key={t.href}
            href={t.href}
            className="border border-gray-200 rounded p-5 hover:border-[#04aa6d] hover:shadow-sm transition-all flex items-start gap-4"
          >
            <div className="text-3xl">📘</div>
            <div>
              <h2 className="font-bold text-lg text-gray-800">{t.title}</h2>
              <p className="text-gray-600 text-sm mt-1">{t.desc}</p>
              <span className="text-xs text-[#04aa6d] mt-2 inline-block">
                {t.chapters} chapitres →
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
