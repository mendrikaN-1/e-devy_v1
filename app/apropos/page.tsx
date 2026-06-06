import Link from "next/link";

export const metadata = { title: "À propos - E-DEVY" };

export default function AProposPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">À propos d'E-DEVY</h1>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#04aa6d]">Qu'est-ce qu'E-DEVY ?</h2>
        <p className="text-sm mb-3">
          <strong>E-DEVY</strong> est une plateforme pédagogique web conçue spécifiquement pour les
          étudiants de <strong>l'Université d'Antananarivo</strong> (S3 — semestre 3).
        </p>
        <p className="text-sm mb-3">
          Son objectif est d'aider les étudiants à comprendre et maîtriser les concepts fondamentaux
          enseignés dans le cours d'algorithmique et de méthodes numériques, à travers :
        </p>
        <ul className="list-disc ml-5 text-sm space-y-1">
          <li>Des <strong>cours interactifs</strong> suivant strictement le support pédagogique</li>
          <li>Un <strong>simulateur de pseudo-code</strong> pas à pas avec visualisation mémoire</li>
          <li>Des <strong>simulateurs de méthodes numériques</strong> avec tableaux d'itérations</li>
          <li>Plus de <strong>50 exercices progressifs</strong> avec solutions détaillées</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#04aa6d]">Contenu basé sur le cours S3</h2>
        <div className="info-box text-sm">
          <strong>Important :</strong> Tout le contenu pédagogique de ce site est basé
          <em> strictement</em> sur le support de cours officiel S3 de l'Université d'Antananarivo.
          Les exemples, algorithmes et exercices sont tirés directement du support pédagogique.
        </div>

        <div className="mt-4 space-y-3">
          {[
            {
              titre: "Chap. I — Algorithmique et Organigrammes",
              contenu:
                "Variables, SI/SELON, boucles TANTQUE/REPETER/POUR, fonctions, procédures, organigrammes",
            },
            {
              titre: "Chap. II — Premier pas avec MATLAB",
              contenu:
                "Matrices, opérateurs, input/disp, scripts, functions, structures de contrôle",
            },
            {
              titre: "Chap. III — Calculs approchés",
              contenu:
                "Dichotomie, Newton, Rectangles, Trapèzes, Simpson, Gauss, LU",
            },
          ].map((c) => (
            <div key={c.titre} className="border border-gray-200 rounded p-3">
              <p className="font-semibold text-sm">{c.titre}</p>
              <p className="text-xs text-gray-600 mt-1">{c.contenu}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#04aa6d]">Technologies utilisées</h2>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { name: "Next.js 15", desc: "Framework React" },
            { name: "TypeScript", desc: "Typage statique" },
            { name: "TailwindCSS", desc: "Styles utilitaires" },
            { name: "React", desc: "Interface utilisateur" },
            { name: "JSON", desc: "Données locales" },
            { name: "SVG", desc: "Schémas organigrammes" },
          ].map((t) => (
            <div
              key={t.name}
              className="border border-gray-200 rounded p-3 text-center"
            >
              <p className="font-bold text-sm">{t.name}</p>
              <p className="text-xs text-gray-500">{t.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-500 mt-3">
          Pas de backend, pas de base de données. 100% statique — déployable gratuitement
          sur GitHub Pages, Netlify ou Vercel.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#04aa6d]">
          Créateur du projet
        </h2>

        <div className="border border-gray-200 rounded p-4">
          <p className="font-semibold text-base">
            RAZAKANAIVO Ravelona Niaina
          </p>

          <p className="text-sm mt-2">
            Étudiant en <strong>Licence 2 (L2) Physique et Applications</strong>
            à l'Université d'Antananarivo.
          </p>

          <p className="text-sm mt-2">
            Passionné par la Data Science, l'Intelligence Artificielle,
            la programmation Python et le développement de solutions
            numériques éducatives.
          </p>

          <div className="mt-3 text-sm">
            <p>
              <strong>Téléphone :</strong> +261 33 67 504 13
            </p>

            <p>
              <strong>Email :</strong> niainarazakanaivo13@gmail.com
            </p>
          </div>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-lg font-bold mb-3 text-[#04aa6d]">Installation locale</h2>

        <pre className="code-block text-xs">{`# 1. Cloner le projet
git clone https://github.com/votre-repo/e-devy.git
cd e-devy

# 2. Installer les dépendances
npm install

# 3. Lancer en développement
npm run dev
# → http://localhost:3000

# 4. Build de production
npm run build
npm run start`}</pre>
      </section>

      <div className="border-t border-gray-200 pt-6 text-center">
        <p className="text-sm text-gray-500">E-DEVY — Plateforme pédagogique pour l'Université d'Antananarivo</p>

        <p className="text-xs text-gray-400 mt-2">
          Développé par RAZAKANAIVO Ravelona Niaina • © 2026
        </p>

        <div className="flex justify-center gap-4 mt-3">
          <Link href="/" className="text-sm text-[#04aa6d] hover:underline">
            Accueil
          </Link>

          <Link href="/cours" className="text-sm text-[#04aa6d] hover:underline">
            Cours
          </Link>

          <Link href="/pratique" className="text-sm text-[#04aa6d] hover:underline">
            Pratique
          </Link>

          <Link href="/methodes" className="text-sm text-[#04aa6d] hover:underline">
            Méthodes
          </Link>
        </div>
      </div>
    </div>
  );
}