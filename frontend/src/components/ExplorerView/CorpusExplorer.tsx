import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  Search,
  CheckCircle2,
  User,
  Sparkles,
  Columns,
  Eye,
  FileText,
  Info,
} from "lucide-react";
import type { Redacao1000 } from "../../types";

export const CorpusExplorer: React.FC = () => {
  const {
    corpus,
    selectedEssay,
    selectEssay,
    activeLayers,
    toggleLayer,
    filterCorpus,
    text,
    setSideBySideOpen,
    sideBySideOpen,
  } = useAppStore();

  const [search, setSearch] = useState("");
  const [selectedYear, setSelectedYear] = useState<number | undefined>(undefined);
  const [selectedRep, setSelectedRep] = useState<string | undefined>(undefined);

  const handleFilter = (year?: number, rep?: string, query?: string) => {
    setSelectedYear(year);
    setSelectedRep(rep);
    filterCorpus({
      year,
      repertoire: rep,
      search: query !== undefined ? query : search,
    });
  };

  const currentEssay: Redacao1000 | null = selectedEssay || corpus[0] || null;

  const years = [2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015];

  return (
    <div className="space-y-6">
      {/* Argon 3D Header Banner */}
      <div className="card-3d-dark p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-xs font-display font-black bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Banco Oficial de Excelência
            </span>
            <span className="text-xs text-emerald-300 font-display font-bold">
              100% Autores Humanos Reais
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            Explorador Anatômico: 100 Redações Nota 1000
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Navegue pelo maior acervo cirúrgico de redações nota 1000 do ENEM (2015-2024). Ative as camadas do Raio-X para entender a anatomia de introdução, repertórios e proposta de intervenção.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setSideBySideOpen(true)}
            className="btn-3d-white px-4 py-2.5 text-xs"
          >
            <Columns className="w-4 h-4 text-indigo-600" />
            <span>Comparar Lado a Lado com Meu Texto</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card-3d p-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Buscar por tema, autor, filósofo ou citação (ex: Freyre, Bauman, CF/88)..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              handleFilter(selectedYear, selectedRep, e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
          <span className="text-xs font-display font-bold text-slate-500 whitespace-nowrap mr-1">
            Ano:
          </span>
          <button
            onClick={() => handleFilter(undefined, selectedRep)}
            className={`px-3 py-1.5 rounded-xl text-xs font-display font-bold transition-all shrink-0 ${
              selectedYear === undefined
                ? "bg-indigo-600 text-white shadow-3d-indigo -translate-y-0.5"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            Todos
          </button>
          {years.map((y) => (
            <button
              key={y}
              onClick={() => handleFilter(y, selectedRep)}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-mono font-bold transition-all shrink-0 ${
                selectedYear === y
                  ? "bg-indigo-600 text-white shadow-3d-indigo -translate-y-0.5"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {y}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split-Screen Explorer Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of 100 Essays */}
        <div className="lg:col-span-5 card-3d p-4 h-[680px] flex flex-col">
          <div className="flex items-center justify-between mb-3 pb-2.5 border-b-2 border-slate-100">
            <span className="text-xs font-display font-black text-slate-800 uppercase tracking-wider flex items-center">
              <FileText className="w-4 h-4 text-indigo-600 mr-1.5" />
              Redações Catalogadas ({corpus.length})
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Nota 1000
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {corpus.map((essay) => {
              const isSelected = currentEssay?.id === essay.id;
              return (
                <div
                  key={essay.id}
                  onClick={() => selectEssay(essay)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer select-none text-left ${
                    isSelected
                      ? "bg-indigo-50/90 border-indigo-400 shadow-3d-sm"
                      : "bg-slate-50/70 border-slate-200 hover:bg-white hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-black bg-indigo-100 text-indigo-800">
                      ENEM {essay.year}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-emerald-700 flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                      1000 pts
                    </span>
                  </div>

                  <h4 className="text-xs font-display font-bold text-slate-900 line-clamp-2 leading-snug mb-1.5">
                    {essay.theme}
                  </h4>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span className="flex items-center">
                      <User className="w-3 h-3 mr-1 text-slate-400" />
                      {essay.author} ({essay.state})
                    </span>
                    <span className="font-mono">{essay.word_count} palavras</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Surgical X-Ray Breakdown */}
        <div className="lg:col-span-7 card-3d flex flex-col h-[680px] overflow-hidden">
          {currentEssay ? (
            <>
              {/* Essay Metadata Header */}
              <div className="p-4 sm:p-5 border-b-2 border-slate-200 bg-slate-50/80">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-mono font-black bg-slate-900 text-white">
                      ENEM {currentEssay.year}
                    </span>
                    <span className="text-xs font-display font-bold text-slate-700 flex items-center">
                      <User className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {currentEssay.author} • {currentEssay.state}
                    </span>
                  </div>
                  <span className="text-xs font-display font-black text-emerald-700 bg-emerald-50 px-3 py-0.5 rounded-full border border-emerald-200">
                    Nota Oficial 1000
                  </span>
                </div>

                <h3 className="text-base font-display font-black text-slate-900 leading-snug mb-3">
                  {currentEssay.theme}
                </h3>

                {/* Multilayer Toggle Controls */}
                <div className="flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-slate-200/80">
                  <span className="text-[11px] font-display font-bold text-slate-500 mr-1 flex items-center">
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Camadas Raio-X:
                  </span>

                  <button
                    onClick={() => toggleLayer("repertoire")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-display font-bold transition-all flex items-center space-x-1 border ${
                      activeLayers.repertoire
                        ? "bg-purple-100 text-purple-900 border-purple-300 shadow-xs"
                        : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                    }`}
                  >
                    <span>🟣 Repertório</span>
                  </button>

                  <button
                    onClick={() => toggleLayer("thesis")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-display font-bold transition-all flex items-center space-x-1 border ${
                      activeLayers.thesis
                        ? "bg-amber-100 text-amber-900 border-amber-300 shadow-xs"
                        : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                    }`}
                  >
                    <span>🟡 Teses / Projeto</span>
                  </button>

                  <button
                    onClick={() => toggleLayer("cohesion")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-display font-bold transition-all flex items-center space-x-1 border ${
                      activeLayers.cohesion
                        ? "bg-blue-100 text-blue-900 border-blue-300 shadow-xs"
                        : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                    }`}
                  >
                    <span>🔵 Coesão (C4)</span>
                  </button>

                  <button
                    onClick={() => toggleLayer("c5")}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-display font-bold transition-all flex items-center space-x-1 border ${
                      activeLayers.c5
                        ? "bg-emerald-100 text-emerald-900 border-emerald-300 shadow-xs"
                        : "bg-slate-100 text-slate-400 border-slate-200 line-through"
                    }`}
                  >
                    <span>🟢 5 Elementos C5</span>
                  </button>
                </div>
              </div>

              {/* Essay Body with Anatomical Dissection */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 enem-paper-sheet font-serif text-slate-800 text-base leading-[32px]">
                {currentEssay.sections.map((sec, idx) => (
                  <div key={idx} className="relative group">
                    <div className="text-[10px] font-display font-black uppercase text-slate-400 mb-1 flex items-center justify-between leading-normal">
                      <span>{sec.type.replace("_", " ").toUpperCase()}</span>
                      {sec.interparagraph_connector && activeLayers.cohesion && (
                        <span className="text-blue-800 font-bold bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md">
                          Conectivo: "{sec.interparagraph_connector}"
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap">{sec.text}</p>

                    {activeLayers.repertoire && sec.repertoires.length > 0 && (
                      <div className="mt-2 p-3 bg-purple-50 border-2 border-purple-200 rounded-xl font-sans text-xs space-y-1 leading-normal">
                        <span className="font-display font-bold text-purple-950 block flex items-center">
                          <Sparkles className="w-3.5 h-3.5 text-purple-600 mr-1" />
                          Repertório Sociocultural Legítimo: {sec.repertoires[0].source}
                        </span>
                        <p className="text-purple-900 text-[11px] leading-relaxed">
                          <strong>Por que foi produtivo para a nota 1000:</strong>{" "}
                          {sec.repertoires[0].why_productive}
                        </p>
                      </div>
                    )}

                    {activeLayers.c5 && sec.c5_elements && (
                      <div className="mt-2 p-3.5 bg-emerald-50 border-2 border-emerald-200 rounded-xl font-sans text-xs space-y-1.5 leading-normal">
                        <span className="font-display font-bold text-emerald-950 block flex items-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1" />
                          Os 5 Elementos da Proposta de Intervenção (Nota 200 na C5):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                          <div>
                            <strong className="text-emerald-950">1. Agente:</strong>{" "}
                            {sec.c5_elements.agente}
                          </div>
                          <div>
                            <strong className="text-emerald-950">2. Ação:</strong>{" "}
                            {sec.c5_elements.acao}
                          </div>
                          <div>
                            <strong className="text-emerald-950">3. Meio/Modo:</strong>{" "}
                            {sec.c5_elements.meio}
                          </div>
                          <div>
                            <strong className="text-emerald-950">4. Efeito:</strong>{" "}
                            {sec.c5_elements.efeito}
                          </div>
                          <div className="sm:col-span-2">
                            <strong className="text-emerald-950">5. Detalhamento:</strong>{" "}
                            {sec.c5_elements.detalhamento}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t-2 border-slate-200 font-sans leading-normal">
                  <h4 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-2 flex items-center">
                    <Info className="w-3.5 h-3.5 text-indigo-600 mr-1.5" />
                    Motivos da Nota 1000 pela Banca do INEP:
                  </h4>
                  <ul className="space-y-1.5 text-xs text-slate-700">
                    {currentEssay.key_takeaways.map((point, k) => (
                      <li key={k} className="flex items-start space-x-2">
                        <span className="text-emerald-600 font-bold">✓</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
              Selecione uma redação na lista para visualizar o raio-x anatômico.
            </div>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparator Modal */}
      {sideBySideOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="card-3d max-w-6xl w-full h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 border-b-2 border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-base font-display font-black text-slate-900 flex items-center space-x-2">
                  <Columns className="w-5 h-5 text-indigo-600" />
                  <span>Comparador Lado a Lado: Seu Texto vs Redação Nota 1000</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Compare sua escrita com o padrão oficial do INEP para este ou temas análogos.
                </p>
              </div>
              <button
                onClick={() => setSideBySideOpen(false)}
                className="btn-3d-white px-3.5 py-1.5 text-xs"
              >
                Fechar
              </button>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x-2 divide-slate-200 overflow-hidden">
              <div className="p-6 overflow-y-auto h-full bg-slate-50/40">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <span className="text-xs font-display font-bold text-slate-700 uppercase">
                    Seu Rascunho / Texto Digitado
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {text.split(/\s+/).filter(Boolean).length} palavras
                  </span>
                </div>
                <div className="font-serif text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {text ||
                    "Nenhum texto digitado no momento. Digite sua redação no Corretor para comparar aqui."}
                </div>
              </div>

              <div className="p-6 overflow-y-auto h-full bg-white">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-200">
                  <span className="text-xs font-display font-bold text-emerald-800 uppercase flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                    Exemplar Nota 1000 ({currentEssay?.author} - {currentEssay?.year})
                  </span>
                  <span className="text-[11px] font-mono text-emerald-700 font-bold">
                    {currentEssay?.word_count} palavras
                  </span>
                </div>
                <div className="font-serif text-slate-800 text-sm leading-relaxed whitespace-pre-wrap">
                  {currentEssay?.full_text}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
