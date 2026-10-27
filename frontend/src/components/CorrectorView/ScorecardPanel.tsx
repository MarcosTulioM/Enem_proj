import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  Award,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Scale,
  Sparkles,
  CheckCircle,
  Lightbulb,
} from "lucide-react";

export const ScorecardPanel: React.FC = () => {
  const { currentResult, isLoading } = useAppStore();
  const [expandedComp, setExpandedComp] = useState<string | null>("C1");
  const [showBoardDetails, setShowBoardDetails] = useState<boolean>(false);

  if (isLoading) {
    return (
      <div className="card-3d p-8 flex flex-col items-center justify-center min-h-[420px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-600 text-white flex items-center justify-center mb-4 shadow-3d-emerald animate-bounce">
          <Scale className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-display font-black text-slate-900 mb-1">
          A Banca do ENEM está avaliando...
        </h3>
        <p className="text-xs text-slate-500 max-w-xs mb-5 leading-relaxed">
          Examinador Alfa e Examinador Beta estão fazendo a leitura cruzada do seu texto e calculando as 5 competências.
        </p>
        <div className="w-48 bg-slate-100 rounded-full h-2 border border-slate-200 overflow-hidden">
          <div className="bg-brand-600 h-full rounded-full animate-pulse w-3/4"></div>
        </div>
      </div>
    );
  }

  if (!currentResult) {
    return (
      <div className="card-3d p-8 flex flex-col items-center justify-center min-h-[420px] text-center">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 border-2 border-slate-200 flex items-center justify-center text-slate-400 mb-4 shadow-3d-sm">
          <Award className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-display font-black text-slate-900 mb-1">
          Aguardando sua Redação
        </h3>
        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
          Digite ou cole seu texto na folha ao lado e clique em "Corrigir Redação com a Banca" para receber a nota e o raio-x completo das 5 competências.
        </p>
      </div>
    );
  }

  const {
    total_score,
    competency_scores,
    examiner_alfa,
    examiner_beta,
    discrepancy_report,
    pedagogical_summary,
  } = currentResult;

  const getScoreColor = (score: number) => {
    if (score >= 960) return "text-emerald-300 bg-emerald-500/20 border-emerald-400/40";
    if (score >= 800) return "text-brand-300 bg-brand-500/20 border-brand-400/40";
    if (score >= 640) return "text-amber-300 bg-amber-500/20 border-amber-400/40";
    return "text-rose-300 bg-rose-500/20 border-rose-400/40";
  };

  return (
    <div className="space-y-5">
      {/* Argon 3D Global Score Card */}
      <div className="card-3d-dark p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-36 h-36 bg-brand-500/20 rounded-full blur-2xl pointer-events-none"></div>

        <div className="flex items-center justify-between gap-3 mb-4 relative z-10">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-emerald-400 font-display font-black block mb-0.5">
              Nota Oficial da Banca
            </span>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl sm:text-5xl font-mono font-extrabold tracking-tight text-white">
                {total_score}
              </span>
              <span className="text-slate-400 font-mono font-bold text-lg">/ 1000</span>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-display font-black border ${getScoreColor(
                total_score
              )}`}
            >
              {total_score >= 960
                ? "Padrão Nota 1000 🏆"
                : total_score >= 800
                ? "Competitivo 🚀"
                : total_score >= 600
                ? "Base Sólida 📝"
                : "Requer Atenção ⚠️"}
            </span>
            <span className="block text-[11px] text-slate-400 mt-1 font-mono font-bold">
              Matriz INEP 2026
            </span>
          </div>
        </div>

        {/* Pedagogical Mentor Greeting */}
        <div className="border-t border-slate-700/80 pt-3 mt-3 relative z-10">
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            "{pedagogical_summary.greeting}"
          </p>
        </div>
      </div>

      {/* 5 Competencies Breakdown */}
      <div className="card-3d p-5">
        <h4 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
          <span>Desempenho por Competência (0 a 200)</span>
          <span className="text-[10px] font-sans font-medium text-slate-400">
            Toque para expandir
          </span>
        </h4>

        <div className="space-y-3">
          {Object.entries(competency_scores).map(([key, comp]) => {
            const isExpanded = expandedComp === key;
            const percentage = (comp.score / 200) * 100;

            return (
              <div
                key={key}
                className="border-2 border-slate-200/90 rounded-xl overflow-hidden transition-all duration-150 hover:border-slate-300"
              >
                <div
                  onClick={() => setExpandedComp(isExpanded ? null : key)}
                  className="p-3.5 bg-slate-50/70 hover:bg-slate-50 cursor-pointer flex items-center justify-between select-none"
                >
                  <div className="flex items-center space-x-3 flex-1 mr-4">
                    <span className="px-2.5 py-1 rounded-lg font-display font-black text-xs bg-slate-900 text-white shrink-0 shadow-xs">
                      {key}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-display font-bold text-slate-800 truncate">
                          {comp.name}
                        </span>
                        <span className="font-mono font-extrabold text-slate-900 ml-2 shrink-0">
                          {comp.score} pts
                        </span>
                      </div>
                      <div className="w-full bg-slate-200/90 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            comp.score >= 160
                              ? "bg-gradient-to-r from-brand-600 to-emerald-400"
                              : comp.score >= 120
                              ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                              : "bg-gradient-to-r from-rose-600 to-rose-400"
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="text-slate-400">
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white border-t-2 border-slate-200/80 text-xs space-y-2.5 animate-in fade-in duration-150">
                    <p className="text-slate-600 leading-relaxed font-medium">
                      {comp.description}
                    </p>

                    {comp.strengths.length > 0 && (
                      <div className="text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-xl p-2.5 font-medium flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                        <span>{comp.strengths[0]}</span>
                      </div>
                    )}

                    {comp.improvements.length > 0 && (
                      <div className="text-amber-900 bg-amber-50 border border-amber-200 rounded-xl p-2.5 font-medium flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                        <span>{comp.improvements[0]}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Board Deliberation (Banca Dupla Oficial) */}
      <div className="card-3d p-5">
        <div
          onClick={() => setShowBoardDetails(!showBoardDetails)}
          className="flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center space-x-2">
            <Scale className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider">
              Deliberação da Banca Dupla
            </h4>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-display font-black ${
                discrepancy_report.has_discrepancy
                  ? "bg-amber-100 text-amber-800 border border-amber-300"
                  : "bg-emerald-100 text-emerald-800 border border-emerald-300"
              }`}
            >
              {discrepancy_report.has_discrepancy
                ? "Arbitragem de Supervisor"
                : "Consenso Pleno"}
            </span>
            {showBoardDetails ? (
              <ChevronUp className="w-4 h-4 text-slate-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-slate-400" />
            )}
          </div>
        </div>

        <p className="text-xs text-slate-500 mt-1.5">
          {discrepancy_report.final_decision_summary}
        </p>

        {showBoardDetails && (
          <div className="mt-4 pt-4 border-t-2 border-slate-200/80 space-y-3 text-xs animate-in fade-in">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-200">
                <span className="font-display font-bold text-slate-800 block mb-0.5">
                  Examinador Alfa
                </span>
                <span className="text-slate-500 text-[11px] block mb-1">
                  Norma culta e coesão
                </span>
                <span className="text-lg font-mono font-black text-slate-900">
                  {examiner_alfa.total} pts
                </span>
              </div>
              <div className="p-3.5 bg-slate-50 rounded-xl border-2 border-slate-200">
                <span className="font-display font-bold text-slate-800 block mb-0.5">
                  Examinador Beta
                </span>
                <span className="text-slate-500 text-[11px] block mb-1">
                  Tema, tese e intervenção
                </span>
                <span className="text-lg font-mono font-black text-slate-900">
                  {examiner_beta.total} pts
                </span>
              </div>
            </div>

            <div className="p-3.5 bg-indigo-50/80 border-2 border-indigo-200/80 rounded-xl text-indigo-950">
              <span className="font-display font-bold block mb-1 flex items-center">
                <ShieldCheck className="w-4 h-4 mr-1 text-indigo-600" />
                Regra Oficial de Discrepância do INEP:
              </span>
              <p className="text-[11px] text-indigo-900 leading-relaxed">
                Diferença total de apenas {discrepancy_report.total_diff} pontos entre os avaliadores.
                De acordo com a norma do exame, notas com diferença menor que 80 pontos por competência e até 100 pontos no total são validadas pela média aritmética.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Plan from Mentor */}
      <div className="card-3d border-2 border-brand-300 bg-brand-50/60 p-5">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <h4 className="text-xs font-display font-black text-brand-950 uppercase tracking-wider">
            Plano de Ação Personalizado
          </h4>
        </div>
        <p className="text-xs text-brand-900 mb-3 font-semibold">
          {pedagogical_summary.primary_focus_area}
        </p>

        <ul className="space-y-2 text-xs text-slate-700">
          {pedagogical_summary.suggested_action_plan.map((step, idx) => (
            <li
              key={idx}
              className="flex items-start space-x-2.5 bg-white p-3 rounded-xl border-2 border-brand-200/60 shadow-xs"
            >
              <span className="w-5 h-5 rounded-lg bg-brand-600 text-white flex items-center justify-center text-[10px] font-mono font-bold shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span className="font-medium text-slate-800 leading-relaxed">{step}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
