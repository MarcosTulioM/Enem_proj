import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  TrendingUp,
  AlertCircle,
  BarChart2,
  ArrowRight,
  Compass,
  PenTool,
  Target,
  Trash2,
  AlertTriangle,
  Award,
  Layers,
} from "lucide-react";

export const StudentProgress: React.FC = () => {
  const {
    analytics,
    history,
    simulatedAnalytics,
    simulatedHistory,
    activeProfileId,
    profiles,
    setTheme,
    setCurrentView,
    removeProfile,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"redacao" | "simulado">("redacao");
  const [chartScope, setChartScope] = useState<"recent" | "all">("recent");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleReloadEssay = (theme: string) => {
    setTheme(theme);
    setCurrentView("corrector");
  };

  const handleDeleteCurrentProfile = async () => {
    if (!activeProfile) return;
    await removeProfile(activeProfile.id);
    setShowDeleteConfirm(false);
  };

  const hasEssayData = analytics && analytics.total_essays > 0;
  const hasSimData = simulatedAnalytics && simulatedAnalytics.total_simulations > 0;

  const fullProgression = analytics?.score_progression || [];
  const displayedProgression =
    chartScope === "recent" && fullProgression.length > 8
      ? fullProgression.slice(-8)
      : fullProgression;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Argon 3D Header Banner */}
      <div className="card-3d-dark p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-5 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full text-xs font-display font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              Painel 3D do Estudante
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs bg-white/10 text-white font-display font-bold border border-white/15">
              Perfil Ativo: {activeProfile?.name}
            </span>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-[11px] font-display font-bold bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 border border-rose-400/30 transition-colors"
              title="Excluir este perfil e zerar histórico"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Perfil</span>
            </button>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
            Evolução e Estatísticas Gerais
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed">
            Acompanhe o crescimento da sua nota em Redação nas 5 competências e seu desempenho TRI nos simulados oficiais.
          </p>
        </div>

        {/* 3D Tactile Tab Switcher */}
        <div className="relative z-10 flex flex-wrap items-center bg-slate-950/90 p-1.5 rounded-2xl border-2 border-slate-700/80 shadow-inner self-start lg:self-center gap-1.5">
          <button
            onClick={() => setActiveTab("redacao")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-display font-black transition-all ${
              activeTab === "redacao"
                ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-3d-emerald -translate-y-0.5"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Redação ENEM ({analytics?.total_essays || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab("simulado")}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-display font-black transition-all ${
              activeTab === "simulado"
                ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-3d-indigo -translate-y-0.5"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Simulados & TRI ({simulatedAnalytics?.total_simulations || 0})</span>
          </button>
        </div>
      </div>

      {/* Confirmation Banner for Deleting Current Profile */}
      {showDeleteConfirm && activeProfile && (
        <div className="card-3d border-2 border-rose-300 bg-rose-50/95 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-in fade-in">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-3d-rose">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-display font-black text-rose-950">
                Confirmar exclusão do perfil "{activeProfile.name}"?
              </h4>
              <p className="text-xs text-rose-800 mt-0.5">
                Todas as redações corrigidas e simulados salvos neste perfil serão apagados permanentemente do banco local.
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(false)}
              className="btn-3d-white px-3.5 py-2 text-xs"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleDeleteCurrentProfile}
              className="btn-3d-rose px-4 py-2 text-xs"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Sim, Excluir Perfil</span>
            </button>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* TAB 1: REDAÇÃO ANALYTICS */}
      {/* ============================================================== */}
      {activeTab === "redacao" && (
        <>
          {!hasEssayData ? (
            <div className="card-3d p-12 text-center max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border-2 border-amber-200 shadow-3d-sm">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                Nenhuma redação corrigida ainda neste perfil
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Envie sua primeira redação no Corretor Inteligente para começar a traçar sua curva de evolução e médias das 5 competências.
              </p>
              <button
                onClick={() => setCurrentView("corrector")}
                className="btn-3d-emerald px-6 py-3 text-xs"
              >
                <span>Ir para o Corretor de Redação</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* 3D KPI Cards Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Média de Redação
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-slate-900">
                      {analytics.average_score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 1000</span>
                  </div>
                  <span className="text-[11px] text-emerald-600 font-bold mt-1.5 block">
                    {analytics.total_essays} redações avaliadas
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Maior Nota Alcançada
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-brand-700">
                      {analytics.highest_score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 1000</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Recorde pessoal
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Ponto Mais Forte
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-display font-black text-emerald-700">
                      {analytics.strongest_competency}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ({analytics.competency_averages[analytics.strongest_competency] || 0} pts)
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                    Maior consistência técnica
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Foco de Melhoria
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-2xl font-display font-black text-amber-600">
                      {analytics.focus_competency}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-500">
                      ({analytics.competency_averages[analytics.focus_competency] || 0} pts)
                    </span>
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1.5 block">
                    Potencial de ganho rápido
                  </span>
                </div>
              </div>

              {/* Evolution Chart & Competencies (FIXED OVERFLOW BUG) */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Column: Evolution Chart with min-w-0 overflow-hidden & horizontal scroll */}
                <div className="lg:col-span-7 min-w-0 overflow-hidden card-3d p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                      <h3 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider flex items-center">
                        <BarChart2 className="w-4 h-4 text-brand-600 mr-1.5 shrink-0" />
                        <span>Curva de Evolução da Nota Total</span>
                      </h3>

                      {fullProgression.length > 8 ? (
                        <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-[10px] font-display font-bold">
                          <button
                            type="button"
                            onClick={() => setChartScope("recent")}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              chartScope === "recent"
                                ? "bg-white text-brand-700 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Últimos 8
                          </button>
                          <button
                            type="button"
                            onClick={() => setChartScope("all")}
                            className={`px-2.5 py-1 rounded-md transition-all ${
                              chartScope === "all"
                                ? "bg-white text-brand-700 shadow-xs"
                                : "text-slate-500 hover:text-slate-800"
                            }`}
                          >
                            Todos ({fullProgression.length})
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] font-semibold text-slate-400">
                          {fullProgression.length} {fullProgression.length === 1 ? "envio" : "envios"}
                        </span>
                      )}
                    </div>

                    {/* Scrollable Horizontal Container Preventing Any Card Bleed */}
                    <div className="w-full overflow-x-auto pb-2">
                      <div
                        className="h-56 flex items-end gap-2.5 pt-8 pb-2 px-1 border-b-2 border-slate-200/80"
                        style={{
                          minWidth:
                            displayedProgression.length > 8
                              ? `${displayedProgression.length * 52}px`
                              : "100%",
                        }}
                      >
                        {displayedProgression.map((item, idx) => {
                          const heightPercent = Math.max(15, (item.score / 1000) * 100);
                          return (
                            <div
                              key={idx}
                              className="flex-1 min-w-[40px] flex flex-col items-center group relative h-full justify-end"
                            >
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-7 bg-slate-900 text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap z-20 shadow-lg">
                                <span className="font-mono font-bold text-emerald-300">
                                  {item.score} pts
                                </span>{" "}
                                • {item.date}
                              </div>
                              <span className="text-[10px] font-mono font-extrabold text-slate-700 mb-1">
                                {item.score}
                              </span>
                              <div
                                className="w-full max-w-[34px] rounded-t-xl bg-gradient-to-t from-brand-700 via-brand-500 to-emerald-400 border-t border-emerald-200 shadow-sm transition-all duration-300 group-hover:brightness-110 group-hover:-translate-y-0.5"
                                style={{ height: `${heightPercent}%` }}
                              ></div>
                              <span className="text-[9px] font-mono font-bold text-slate-500 mt-2 truncate w-full text-center">
                                #{item.index}
                              </span>
                              <span className="text-[8px] font-medium text-slate-400 leading-none">
                                {item.date}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-3 text-center">
                    Cada barra 3D representa a nota final atribuída pela banca oficial ({displayedProgression.length} exibidos).
                  </p>
                </div>

                {/* Right Column: Competency Averages */}
                <div className="lg:col-span-5 min-w-0 card-3d p-5 sm:p-6 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span>Médias Acumuladas por Competência</span>
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(analytics.competency_averages).map(([comp, avg]) => {
                        const pct = Math.min(100, (avg / 200) * 100);
                        return (
                          <div key={comp}>
                            <div className="flex items-center justify-between text-xs mb-1.5">
                              <span className="font-display font-bold text-slate-800">{comp}</span>
                              <span className="font-mono font-extrabold text-slate-900">
                                {avg} / 200 pts
                              </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-3 p-0.5 border border-slate-200 overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all duration-500 ${
                                  avg >= 160
                                    ? "bg-gradient-to-r from-brand-600 to-emerald-400"
                                    : avg >= 120
                                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                                    : "bg-gradient-to-r from-rose-600 to-rose-400"
                                }`}
                                style={{ width: `${pct}%` }}
                              ></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                    <span>Escala INEP: 0 a 200 por competência</span>
                    <span className="font-mono font-bold text-slate-600">Total: 1000 pts</span>
                  </div>
                </div>
              </div>

              {/* Recurring Issues Diagnostic */}
              {analytics.recurring_issues && analytics.recurring_issues.length > 0 && (
                <div className="card-3d border-2 border-amber-300/90 bg-amber-50/70 p-5 sm:p-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <h3 className="text-xs font-display font-black text-amber-950 uppercase tracking-wider">
                      Diagnóstico de Vícios Reincidentes (Atenção para o ENEM)
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {analytics.recurring_issues.map((issue, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-4 rounded-xl border-2 border-amber-200/80 shadow-3d-sm"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-display font-black bg-slate-900 text-white">
                            {issue.competency}
                          </span>
                          <span className="text-[11px] font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                            Repetiu {issue.occurrences}x
                          </span>
                        </div>
                        <h4 className="text-xs font-display font-bold text-slate-900 mb-1">
                          {issue.issue_type}
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          {issue.pedagogical_guidance}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Essay History Table */}
              <div className="card-3d p-5 sm:p-6">
                <h3 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Histórico de Redações Salvas no Banco Local</span>
                  <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200">
                    {history.length} envios
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-400 uppercase text-[10px] font-display font-bold">
                        <th className="pb-2.5 pr-3">Data</th>
                        <th className="pb-2.5 pr-3">Tema</th>
                        <th className="pb-2.5 px-2 text-center">C1</th>
                        <th className="pb-2.5 px-2 text-center">C2</th>
                        <th className="pb-2.5 px-2 text-center">C3</th>
                        <th className="pb-2.5 px-2 text-center">C4</th>
                        <th className="pb-2.5 px-2 text-center">C5</th>
                        <th className="pb-2.5 px-2 text-right">Total</th>
                        <th className="pb-2.5 pl-3 text-right">Ação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {history.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pr-3 font-mono font-medium text-slate-500 whitespace-nowrap">
                            {new Date(item.timestamp).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 pr-3 font-display font-bold text-slate-800 max-w-xs truncate">
                            {item.theme}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                            {item.c1}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                            {item.c2}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                            {item.c3}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                            {item.c4}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-semibold text-slate-600">
                            {item.c5}
                          </td>
                          <td className="py-3 px-2 text-right font-mono font-black text-brand-700 text-sm">
                            {item.total_score}
                          </td>
                          <td className="py-3 pl-3 text-right">
                            <button
                              onClick={() => handleReloadEssay(item.theme)}
                              className="btn-3d-white px-2.5 py-1 text-[11px]"
                            >
                              Revisar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ============================================================== */}
      {/* TAB 2: SIMULADO & TRI ANALYTICS */}
      {/* ============================================================== */}
      {activeTab === "simulado" && (
        <>
          {!hasSimData ? (
            <div className="card-3d p-12 text-center max-w-xl mx-auto my-8">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border-2 border-indigo-200 shadow-3d-sm">
                <Compass className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-display font-black text-slate-900 mb-1">
                Nenhum simulado realizado ainda
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                Faça seu primeiro simulado com questões oficiais do ENEM para começar a gerar suas pontuações estimadas pela Teoria de Resposta ao Item (TRI).
              </p>
              <button
                onClick={() => setCurrentView("hub")}
                className="btn-3d-indigo px-6 py-3 text-xs"
              >
                <span>Ir para o Hub de Simulados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TRI KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Média TRI Estimada
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-indigo-700">
                      {simulatedAnalytics.average_tri_score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 1000</span>
                  </div>
                  <span className="text-[11px] text-indigo-600 font-bold mt-1.5 block">
                    Escala oficial INEP
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Melhor TRI
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-emerald-700">
                      {simulatedAnalytics.best_tri_score}
                    </span>
                    <span className="text-xs font-bold text-slate-400">/ 1000</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                    Recorde em simulados
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Taxa Bruta Média
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-slate-900">
                      {simulatedAnalytics.average_raw_accuracy}%
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                    Percentual de acertos
                  </span>
                </div>

                <div className="card-3d p-5">
                  <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Questões Respondidas
                  </span>
                  <div className="flex items-baseline space-x-1.5">
                    <span className="text-3xl font-mono font-extrabold text-brand-700">
                      {simulatedAnalytics.total_questions_answered}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium mt-1.5 block">
                    Em {simulatedAnalytics.total_simulations} sessões
                  </span>
                </div>
              </div>

              {/* Subject Accuracy Radar */}
              {simulatedAnalytics.subject_accuracy &&
                Object.keys(simulatedAnalytics.subject_accuracy).length > 0 && (
                  <div className="card-3d p-5 sm:p-6">
                    <h3 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center space-x-2">
                      <Target className="w-4 h-4 text-brand-600" />
                      <span>Aproveitamento Histórico por Matéria</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
                      {Object.entries(simulatedAnalytics.subject_accuracy).map(([subj, rate]) => (
                        <div
                          key={subj}
                          className="bg-slate-50 p-4 rounded-xl border-2 border-slate-200/80 shadow-xs"
                        >
                          <span className="text-[10px] font-display font-bold uppercase text-slate-500 block truncate">
                            {subj.replace("_", " ")}
                          </span>
                          <div className="flex items-baseline space-x-1 mt-1">
                            <span className="text-2xl font-mono font-black text-slate-900">
                              {rate}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2 mt-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                rate >= 70
                                  ? "bg-emerald-600"
                                  : rate >= 50
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                              style={{ width: `${rate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {/* Simulated Sessions History */}
              <div className="card-3d p-5 sm:p-6">
                <h3 className="text-xs font-display font-black text-slate-800 uppercase tracking-wider mb-4 flex items-center justify-between">
                  <span>Histórico de Simulados Realizados</span>
                  <span className="text-[11px] font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200">
                    {simulatedHistory.length} sessões
                  </span>
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b-2 border-slate-200 text-slate-400 uppercase text-[10px] font-display font-bold">
                        <th className="pb-2.5 pr-3">Data</th>
                        <th className="pb-2.5 pr-3">Matéria / Caderno</th>
                        <th className="pb-2.5 px-2 text-center">Acertos</th>
                        <th className="pb-2.5 px-2 text-center">Taxa Bruta</th>
                        <th className="pb-2.5 px-2 text-center">Tempo</th>
                        <th className="pb-2.5 pl-3 text-right">Nota TRI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {simulatedHistory.map((sim) => (
                        <tr key={sim.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 pr-3 font-mono font-medium text-slate-500 whitespace-nowrap">
                            {new Date(sim.timestamp).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="py-3 pr-3 font-display font-bold text-slate-800 capitalize">
                            {sim.area_or_subject.replace("_", " ")}
                          </td>
                          <td className="py-3 px-2 text-center font-mono font-bold text-slate-700">
                            {sim.correct_count} / {sim.total_questions}
                          </td>
                          <td className="py-3 px-2 text-center">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold ${
                                sim.raw_accuracy_percentage >= 70
                                  ? "bg-emerald-100 text-emerald-800"
                                  : sim.raw_accuracy_percentage >= 50
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {sim.raw_accuracy_percentage}%
                            </span>
                          </td>
                          <td className="py-3 px-2 text-center font-mono text-slate-500">
                            {Math.max(1, Math.round(sim.duration_seconds / 60))} min
                          </td>
                          <td className="py-3 pl-3 text-right font-mono font-black text-indigo-700 text-sm">
                            {sim.estimated_tri_score} pts
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
