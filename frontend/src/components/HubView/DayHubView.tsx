import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  Calendar,
  Compass,
  PenTool,
  BookOpen,
  AlertCircle,
  Play,
  Layers,
  X,
  Target,
} from "lucide-react";
import type { SubjectInfo } from "../../types";

export const DayHubView: React.FC = () => {
  const {
    subjects,
    selectedExamDay,
    setSelectedExamDay,
    startSimulatedTest,
    setCurrentView,
    isLoading,
  } = useAppStore();

  const [activeDayTab, setActiveDayTab] = useState<1 | 2>((selectedExamDay as 1 | 2) || 1);
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [selectedSubjectModal, setSelectedSubjectModal] = useState<SubjectInfo | null>(null);

  const daySubjects = subjects.filter((s) => s.exam_day === activeDayTab);

  const handleStartExam = (subjectId?: string) => {
    let limit = questionCount;
    if (subjectId === "lingua_estrangeira") {
      limit = Math.min(limit, 5);
    }
    startSimulatedTest({
      exam_day: activeDayTab,
      subject: subjectId || undefined,
      limit: limit,
    });
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in duration-300">
      {/* Argon 3D Day Switcher Hero Banner */}
      <div className="card-3d-dark p-6 sm:p-8 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-3 py-1 rounded-full text-xs font-display font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Hub 3D por Dia Oficial
              </span>
              <span className="text-xs font-mono font-bold text-slate-400">ENEM 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-black tracking-tight text-white">
              {activeDayTab === 1
                ? "Dia 1: Linguagens, Humanas & Redação"
                : "Dia 2: Matemática & Ciências da Natureza"}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-xl leading-relaxed">
              {activeDayTab === 1
                ? "Pratique as áreas do 1º domingo do ENEM: interpretação textual, literatura, história, geografia, filosofia, sociologia e redação com nota oficial."
                : "Pratique as áreas do 2º domingo do ENEM: raciocínio lógico-matemático, física, química e biologia com algoritmo de pontuação TRI."}
            </p>
          </div>

          {/* 3D Tactile Segmented Toggle */}
          <div className="flex flex-wrap items-center bg-slate-950/90 p-1.5 rounded-2xl border-2 border-slate-700/80 shadow-inner shrink-0 self-start lg:self-center gap-1.5">
            <button
              onClick={() => {
                setActiveDayTab(1);
                setSelectedExamDay(1);
              }}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-display font-black transition-all duration-150 ${
                activeDayTab === 1
                  ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-3d-emerald -translate-y-0.5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Dia 1 (Humanas/Línguas)</span>
            </button>

            <button
              onClick={() => {
                setActiveDayTab(2);
                setSelectedExamDay(2);
              }}
              className={`flex items-center space-x-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs font-display font-black transition-all duration-150 ${
                activeDayTab === 2
                  ? "bg-gradient-to-b from-indigo-500 to-indigo-600 text-white shadow-3d-indigo -translate-y-0.5"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Dia 2 (Exatas/Natureza)</span>
            </button>
          </div>
        </div>

        {/* Global Day Quick Simulation Bar */}
        <div className="mt-6 pt-5 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-xs font-display font-bold text-slate-300">
              Quantidade de Questões:
            </span>
            <div className="flex items-center space-x-1.5 bg-white/10 p-1 rounded-xl border border-white/15">
              {[5, 10, 15, 20].map((num) => (
                <button
                  key={num}
                  onClick={() => setQuestionCount(num)}
                  className={`px-3 py-1 rounded-lg text-xs font-mono font-extrabold transition-all ${
                    questionCount === num
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={() => handleStartExam()}
            disabled={isLoading}
            className="btn-3d-emerald px-6 py-3 text-xs"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>Fazer Simulado Geral do {activeDayTab === 1 ? "Dia 1" : "Dia 2"}</span>
          </button>
        </div>
      </div>

      {/* Special Redação 3D Card for Dia 1 */}
      {activeDayTab === 1 && (
        <div className="card-3d border-2 border-brand-300 bg-gradient-to-r from-brand-50/90 via-white to-emerald-50/90 p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-start space-x-4">
            <div className="w-13 h-13 p-3.5 rounded-2xl bg-gradient-to-b from-brand-500 to-brand-700 text-white flex items-center justify-center shrink-0 shadow-3d-emerald">
              <PenTool className="w-6 h-6" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-display font-black uppercase tracking-wider bg-brand-600 text-white">
                  Prova de Redação
                </span>
                <span className="text-xs font-display font-bold text-brand-800">
                  Peso Decisivo na Média do ENEM
                </span>
              </div>
              <h3 className="text-lg font-display font-black text-slate-900 mt-1">
                Redação Dissertativa-Argumentativa (0 a 1000 pontos)
              </h3>
              <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed">
                Acesse o corretor com inteligência de sub-agentes (Alfa e Beta), detecção oficial de discrepâncias
                e raio-x anatômico das 100 redações nota 1000 reais.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => setCurrentView("corrector")}
              className="btn-3d-emerald px-5 py-2.5 text-xs flex-1"
            >
              Abrir Corretor de Redação
            </button>
            <button
              onClick={() => setCurrentView("explorer")}
              className="btn-3d-white px-5 py-2 text-xs flex-1"
            >
              Explorar 100 Notas 1000
            </button>
          </div>
        </div>
      )}

      {/* Subjects Grid for the Selected Day */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-black text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>Matérias do {activeDayTab === 1 ? "1º Dia" : "2º Dia"}</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">
            Treine por disciplina específica
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {daySubjects.map((subject) => (
            <div
              key={subject.id}
              className="card-3d-interactive p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-display font-black uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
                    {subject.area}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-md border border-brand-200">
                    {subject.question_count_available} questões
                  </span>
                </div>

                <h3 className="text-base font-display font-black text-slate-900 mb-1.5">
                  {subject.name}
                </h3>

                {/* Ceiling Note (e.g. for foreign language) */}
                {subject.exam_ceiling_note && (
                  <div className="mb-3 p-2.5 bg-amber-50 border-2 border-amber-200/80 rounded-xl text-[10px] text-amber-950 font-medium flex items-start space-x-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span>{subject.exam_ceiling_note}</span>
                  </div>
                )}

                {/* Key Topics Tags */}
                <div className="flex flex-wrap gap-1.5 mt-2 mb-4">
                  {subject.key_topics.slice(0, 3).map((topic, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] bg-slate-50 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200 font-semibold"
                    >
                      {topic}
                    </span>
                  ))}
                  {subject.key_topics.length > 3 && (
                    <span className="text-[10px] text-slate-400 px-1.5 py-1 font-mono font-bold">
                      +{subject.key_topics.length - 3}
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2 pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleStartExam(subject.id)}
                  disabled={isLoading}
                  className="btn-3d-emerald flex-1 py-2.5 px-3 text-xs"
                >
                  <Target className="w-3.5 h-3.5" />
                  <span>Simulado Rápido</span>
                </button>

                <button
                  onClick={() => setSelectedSubjectModal(subject)}
                  className="btn-3d-white p-2.5"
                  title="Ver tópicos e dicas da matéria"
                >
                  <BookOpen className="w-4 h-4 text-slate-700" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal for Subject Details & Theory Tips */}
      {selectedSubjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="card-3d p-6 sm:p-8 max-w-lg w-full animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[10px] font-display font-black uppercase tracking-wider text-brand-600 block">
                  {selectedSubjectModal.area} • Dia {selectedSubjectModal.exam_day}
                </span>
                <h3 className="text-xl font-display font-black text-slate-900">
                  {selectedSubjectModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubjectModal(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedSubjectModal.exam_ceiling_note && (
              <div className="mb-4 p-3 bg-amber-50 border-2 border-amber-200 rounded-2xl text-xs text-amber-900 flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>{selectedSubjectModal.exam_ceiling_note}</span>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div>
                <h4 className="text-xs font-display font-black text-slate-900 uppercase tracking-wider mb-2">
                  Tópicos Mais Recorrentes no ENEM:
                </h4>
                <div className="space-y-2">
                  {selectedSubjectModal.key_topics.map((t, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-50 border-2 border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center space-x-2.5"
                    >
                      <span className="w-5 h-5 rounded-md bg-brand-600 text-white font-mono font-bold text-[10px] flex items-center justify-center shrink-0">
                        {i + 1}
                      </span>
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-2xl text-xs text-emerald-950">
                <span className="font-display font-bold block mb-1">
                  💡 Estratégia de Prova TRI:
                </span>
                Resolva primeiro as questões conceituais e diretas para garantir a coerência pedagógica da sua nota TRI. Não perca tempo empacado em cálculos complexos nas primeiras rodadas!
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedSubjectModal(null)}
                className="btn-3d-white px-4 py-2 text-xs"
              >
                Fechar
              </button>
              <button
                onClick={() => {
                  const subjId = selectedSubjectModal.id;
                  setSelectedSubjectModal(null);
                  handleStartExam(subjId);
                }}
                className="btn-3d-emerald px-5 py-2.5 text-xs"
              >
                Iniciar Simulado Desta Matéria
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
