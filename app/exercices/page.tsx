"use client";
import { useState } from "react";
import exercicesData from "@/data/exercises.json";

type Exercice = {
  id: number;
  titre: string;
  categorie: string;
  niveau: string;
  enonce: string;
  pseudocode: string;
  solution: string;
  explication: string;
};

const NIVEAUX = ["Tous", "Débutant", "Intermédiaire", "Avancé", "Expert"];
const CATEGORIES = ["Toutes", "Variables", "Conditions", "Boucles", "Fonctions", "Tableaux", "Matrices", "Méthodes numériques"];

const NIVEAU_COLOR: Record<string, string> = {
  Débutant: "bg-green-100 text-green-800",
  Intermédiaire: "bg-blue-100 text-blue-800",
  Avancé: "bg-orange-100 text-orange-800",
  Expert: "bg-red-100 text-red-800",
};

export default function ExercicesPage() {
  const [niveau, setNiveau] = useState("Tous");
  const [categorie, setCategorie] = useState("Toutes");
  const [search, setSearch] = useState("");
  const [openId, setOpenId] = useState<number | null>(null);
  const [showSolution, setShowSolution] = useState<Record<number, boolean>>({});

  const exercices: Exercice[] = exercicesData.exercices;

  const filtered = exercices.filter(ex => {
    const matchNiveau = niveau === "Tous" || ex.niveau === niveau;
    const matchCat = categorie === "Toutes" || ex.categorie === categorie;
    const matchSearch = search === "" ||
      ex.titre.toLowerCase().includes(search.toLowerCase()) ||
      ex.enonce.toLowerCase().includes(search.toLowerCase());
    return matchNiveau && matchCat && matchSearch;
  });

  const toggleSolution = (id: number) => {
    setShowSolution(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">Exercices</h1>
      <p className="text-gray-500 text-sm mb-6">
        {exercices.length} exercices progressifs basés sur le support de cours S3
      </p>

      {/* Filters */}
      <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Rechercher</label>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Titre ou mot-clé..."
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Niveau</label>
            <select value={niveau} onChange={e => setNiveau(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
              {NIVEAUX.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-600 block mb-1">Catégorie</label>
            <select value={categorie} onChange={e => setCategorie(e.target.value)}
              className="w-full border border-gray-300 rounded px-2 py-1.5 text-sm">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">{filtered.length} exercice(s) trouvé(s)</p>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3 mb-6">
        {["Débutant","Intermédiaire","Avancé","Expert"].map(n => {
          const count = exercices.filter(e => e.niveau === n).length;
          return (
            <button key={n} onClick={() => setNiveau(n === niveau ? "Tous" : n)}
              className={`text-xs px-3 py-1 rounded-full border transition-colors ${n === niveau ? "bg-gray-800 text-white border-gray-800" : `${NIVEAU_COLOR[n]} border-transparent`}`}>
              {n} ({count})
            </button>
          );
        })}
      </div>

      {/* Exercise list */}
      <div className="space-y-3">
        {filtered.map(ex => (
          <div key={ex.id} className="border border-gray-200 rounded overflow-hidden">
            {/* Header */}
            <button
              onClick={() => setOpenId(openId === ex.id ? null : ex.id)}
              className="w-full text-left p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors"
            >
              <span className="text-gray-400 font-mono text-sm w-8 shrink-0">#{ex.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-sm">{ex.titre}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${NIVEAU_COLOR[ex.niveau]}`}>{ex.niveau}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{ex.categorie}</span>
                </div>
                <p className="text-sm text-gray-600 truncate">{ex.enonce}</p>
              </div>
              <span className="text-gray-400 text-sm shrink-0">{openId === ex.id ? "▲" : "▼"}</span>
            </button>

            {/* Content */}
            {openId === ex.id && (
              <div className="border-t border-gray-200 p-4 bg-white">
                {/* Enonce */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Énoncé</h3>
                  <p className="text-sm">{ex.enonce}</p>
                </div>

                {/* Pseudocode */}
                <div className="mb-4">
                  <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Pseudo-code / Algorithme</h3>
                  <pre className="code-algo text-xs">{ex.pseudocode}</pre>
                </div>

                {/* Solution toggle */}
                <button
                  onClick={() => toggleSolution(ex.id)}
                  className={`text-sm px-4 py-1.5 rounded border transition-colors mb-3 ${showSolution[ex.id] ? "bg-[#04aa6d] text-white border-[#04aa6d]" : "border-[#04aa6d] text-[#04aa6d] hover:bg-green-50"}`}
                >
                  {showSolution[ex.id] ? "▲ Cacher la solution" : "▼ Voir la solution"}
                </button>

                {showSolution[ex.id] && (
                  <div className="space-y-3">
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Solution</h3>
                      <div className="success-box text-sm">{ex.solution}</div>
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Explication détaillée</h3>
                      <div className="info-box text-sm">{ex.explication}</div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg mb-2">Aucun exercice trouvé</p>
          <p className="text-sm">Essayez d'autres filtres</p>
        </div>
      )}
    </div>
  );
}
