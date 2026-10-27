import React, { useState, useEffect } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  Compass,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  BarChart2,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export const SimulatedExamView: React.FC = () => {
  const {
    simulatedQuestions,
    currentQuestionIndex,
    setCurrentQuestionIndex,
    simulatedAnswers,
    answerQuestion,
    submitCurrentSimulation,
    simulatedResult,
    resetSimulation,
    hintsEnabled,
    toggleHints,
    isLoading,
    setCurrentView,
    subjects,
  } = useAppStore();

  const [expandedTip, setExpandedTip] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(0);

  useEffect(() => {
    if (simulatedResult) return;
    const timer = setInterval(() => {
      setSecondsElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [simulatedResult]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!simulatedQuestions || simulatedQuestions.length === 0) {
    return (
      <div className="card-3d p-12 text-center max-w-lg mx-auto my-8">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border-2 border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-3d-sm">
          <Compass className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-display font-black text-slate-900 mb-1">
          Nenhum simulado em andamento
        </h3>
        <p className="text-xs text-slate-500 mb-6 leading-relaxed">
          Escolha o Dia 1, Dia 2 ou uma disciplina específica no Hub de Estudos para iniciar um caderno de questões.
        </p>
        <button
          onClick={() => setCurrentView("hub")}
          className="btn-3d-emerald px-6 py-3 text-xs"
        >
          Ir para o Hub de Matérias
        </button>
      </div>
    );
  }

  // ==========================================
  // VIEW: RESULT / DELIBERATION SCREEN
  // ==========================================
  if (simulatedResult) {
    const {
      total_questions,
      correct_count,
      raw_accuracy_percentage,
      estimated_tri_score,
      competency_radar,
      question_feedbacks,
      pedagogical_advice,
    } = simulatedResult;

    return (
      <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
        {/* Argon 3D Results Hero Header */}
        <div className="card-3d-dark p-6 sm:p-8 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div>
              <span className="px-3 py-1 rounded-full text-xs font-display font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                Resultado Oficial do Simulado
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-black mt-2 text-white">
                Deliberação de Desempenho
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                Avaliação calculada através dos 3 métodos complementares para garantir precisão e neutralidade.
              </p>
            </div>

            <button
              onClick={() => {
                resetSimulation();
                setCurrentView("hub");
              }}
              className="btn-3d-white px-4 py-2.5 text-xs self-start sm:self-auto shrink-0"
            >
              <RotateCcw className="w-4 h-4 text-brand-600" />
              <span>Novo Simulado</span>
            </button>
          </div>

          {/* 3 Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-700/80 relative z-10">
            {/* Metric 1 */}
            <div className="bg-white/10 rounded-2xl p-4 border-2 border-white/15 backdrop-blur-sm">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-300 block mb-1">
                Método 1: Taxa Bruta
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-mono font-extrabold text-white">
                  {raw_accuracy_percentage}%
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">
                  ({correct_count}/{total_questions})
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Porcentagem simples
              </span>
            </div>

            {/* Metric 2 */}
            <div className="bg-white/10 rounded-2xl p-4 border-2 border-white/15 backdrop-blur-sm">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-emerald-300 block mb-1">
                Método 2: Estimativa TRI
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-mono font-extrabold text-emerald-400">
                  {estimated_tri_score}
                </span>
                <span className="text-xs font-mono text-slate-400">/ 1000 pts</span>
              </div>
              <span className="text-[10px] text-slate-300 mt-1 block">
                Coerência pedagógica INEP
              </span>
            </div>

            {/* Metric 3 */}
            <div className="bg-white/10 rounded-2xl p-4 border-2 border-white/15 backdrop-blur-sm">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-indigo-300 block mb-1">
                Tempo Total
              </span>
              <div className="flex items-baseline space-x-1.5">
                <span className="text-3xl font-mono font-extrabold text-white">
                  {formatTimer(secondsElapsed)}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Ritmo de prova
              </span>
            </div>
          </div>
        </div>

        {/* Pedagogical Guidance Box */}
        <div className="card-3d border-2 border-emerald-300 bg-emerald-50/80 p-5">
          <div className="flex items-center space-x-2 mb-1.5">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <h3 className="text-xs font-display font-black text-emerald-950 uppercase tracking-wider">
              Parecer Pedagógico do Especialista
            </h3>
          </div>
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            {pedagogical_advice}
          </p>
        </div>

        {/* Subject Radar if multiple subjects */}
        {competency_radar && Object.keys(competency_radar).length > 0 && (
          <div className="card-3d p-5">
            <h3 className="text-xs font-display font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center space-x-2">
              <BarChart2 className="w-4 h-4 text-indigo-600" />
              <span>Método 3: Radar de Aproveitamento por Disciplina</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              {Object.entries(competency_radar).map(([subj, rate]) => (
                <div
                  key={subj}
                  className="bg-slate-50 p-3.5 rounded-xl border-2 border-slate-200/80"
                >
                  <span className="text-[10px] font-display font-bold uppercase text-slate-500 block truncate">
                    {subj}
                  </span>
                  <div className="flex items-baseline space-x-1 mt-0.5">
                    <span className="text-xl font-mono font-black text-slate-900">
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

        {/* Question-by-Question Review with Traps and Distractors */}
        <div className="space-y-4">
          <h3 className="text-sm font-display font-black text-slate-900 uppercase tracking-wider">
            Revisão Cirúrgica das Questões (Gabaritos & Pegadinhas)
          </h3>

          {question_feedbacks.map((fb, idx) => {
            const originalQ = simulatedQuestions.find((q) => q.id === fb.question_id);
            return (
              <div
                key={fb.question_id}
                className={`card-3d p-5 border-2 ${
                  fb.is_correct ? "border-emerald-300" : "border-rose-300"
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2.5 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <span
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-mono font-black text-xs ${
                        fb.is_correct
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-rose-100 text-rose-800 border border-rose-300"
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span className="text-xs font-display font-bold text-slate-800">
                      {originalQ?.subject.toUpperCase()} • ENEM {originalQ?.year}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-display font-bold uppercase bg-slate-100 text-slate-600 border border-slate-200">
                      Nível TRI: {fb.difficulty_tri}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono font-bold">
                      {fb.historical_success_rate}% acerto
                    </span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-800 font-semibold mb-3 leading-relaxed">
                  {originalQ?.statement}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs mb-3">
                  <div
                    className={`p-3 rounded-xl border-2 font-display font-bold flex items-center justify-between ${
                      fb.is_correct
                        ? "bg-emerald-50 border-emerald-300 text-emerald-900"
                        : "bg-rose-50 border-rose-300 text-rose-900"
                    }`}
                  >
                    <span>Sua resposta: Opção {fb.chosen_option}</span>
                    {fb.is_correct ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    )}
                  </div>

                  <div className="p-3 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-900 font-display font-bold flex items-center justify-between">
                    <span>Gabarito Oficial: Opção {fb.correct_option}</span>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  </div>
                </div>

                {/* Distractor Trap Note (if student made a mistake) */}
                {fb.distractor_note && !fb.is_correct && (
                  <div className="mb-3 p-3.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-xs text-amber-950 leading-relaxed flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="font-display block mb-0.5">
                        ⚠️ Por que você caiu nesta pegadinha?
                      </strong>
                      {fb.distractor_note}
                    </div>
                  </div>
                )}

                {/* Official Explanation */}
                <div className="p-3.5 bg-slate-50 border-2 border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed mb-3">
                  <strong className="font-display text-slate-900 block mb-1">
                    Resolução Passo a Passo:
                  </strong>
                  {fb.explanation}
                </div>

                {/* Golden Tip */}
                <div className="p-3 bg-brand-50 border-2 border-brand-200/70 rounded-xl text-xs text-brand-950 font-medium flex items-center space-x-2">
                  <Lightbulb className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>
                    <strong className="font-display">Dica de Ouro ENEM:</strong>{" "}
                    {fb.golden_tip}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW: QUESTION TAKING SCREEN
  // ==========================================
  const currentQ = simulatedQuestions[currentQuestionIndex];
  const chosenOption = simulatedAnswers[currentQ?.id];
  const totalQ = simulatedQuestions.length;
  const isLastQuestion = currentQuestionIndex === totalQ - 1;

  const currentSubjectObj = subjects.find((s) => s.id === currentQ?.subject);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Top Bar with Timer, Progress and Hints Toggle */}
      <div className="card-3d p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold shadow-xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>{formatTimer(secondsElapsed)}</span>
          </div>

          <div className="text-xs font-display font-bold text-slate-800">
            Questão{" "}
            <span className="text-brand-600 font-mono text-sm font-black">
              {currentQuestionIndex + 1}
            </span>{" "}
            de {totalQ}
          </div>
        </div>

        {/* Questions Number Tracker 3D Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0">
          {simulatedQuestions.map((q, idx) => {
            const isAnswered = !!simulatedAnswers[q.id];
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(idx)}
                className={`w-8 h-8 rounded-xl text-xs font-mono font-black transition-all shrink-0 ${
                  isCurrent
                    ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-3d-emerald -translate-y-0.5"
                    : isAnswered
                    ? "bg-emerald-100 text-emerald-800 border-2 border-emerald-300"
                    : "bg-slate-100 text-slate-500 border border-slate-200 hover:bg-slate-200"
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Hints Toggle Switch */}
        <div className="flex items-center space-x-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          <button
            onClick={toggleHints}
            className={`flex items-center space-x-1.5 px-3.5 py-2 rounded-xl text-xs font-display font-bold border-2 shadow-3d-sm transition-all ${
              hintsEnabled
                ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                : "bg-slate-100 text-slate-500 border-slate-200"
            }`}
            title="Ativar/desativar dicas pedagógicas durante a resolução"
          >
            <Lightbulb
              className={`w-3.5 h-3.5 ${
                hintsEnabled ? "text-emerald-600" : "text-slate-400"
              }`}
            />
            <span>{hintsEnabled ? "Dicas Ativadas" : "Modo Prova"}</span>
          </button>
        </div>
      </div>

      {/* Ceiling Note Alert (if foreign language) */}
      {currentSubjectObj?.exam_ceiling_note && (
        <div className="card-3d p-3.5 bg-amber-50 border-2 border-amber-200 text-xs text-amber-950 flex items-start space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>{currentSubjectObj.exam_ceiling_note}</span>
        </div>
      )}

      {/* Question Card */}
      <div className="card-3d p-6 sm:p-8 space-y-6">
        {/* Question Header */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b-2 border-slate-100">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-lg text-[10px] font-display font-black uppercase tracking-wider bg-slate-900 text-white">
              ENEM {currentQ.year}
            </span>
            <span className="text-xs font-display font-bold text-slate-700 uppercase">
              {currentQ.subject.replace("_", " ")}
            </span>
          </div>

          <span className="text-[11px] font-semibold text-slate-400">
            {currentQ.topic}
          </span>
        </div>

        {/* Context Text (if present) */}
        {currentQ.context_text && (
          <div className="p-5 bg-slate-50 border-2 border-slate-200/80 rounded-2xl text-xs sm:text-sm text-slate-800 leading-relaxed font-serif italic border-l-4 border-l-brand-600">
            {currentQ.context_text}
          </div>
        )}

        {/* Statement */}
        <h3 className="text-sm sm:text-base font-display font-bold text-slate-900 leading-relaxed">
          {currentQ.statement}
        </h3>

        {/* Live Hint Box (if enabled by user) */}
        {hintsEnabled && (
          <div className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 text-xs transition-all">
            <button
              onClick={() => setExpandedTip(!expandedTip)}
              className="w-full flex items-center justify-between font-display font-bold text-emerald-950"
            >
              <div className="flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-emerald-600" />
                <span>Pista do Especialista (Como pensar nesta questão)</span>
              </div>
              {expandedTip ? (
                <ChevronUp className="w-4 h-4 text-emerald-700" />
              ) : (
                <ChevronDown className="w-4 h-4 text-emerald-700" />
              )}
            </button>
            {expandedTip && (
              <p className="text-emerald-900 mt-2.5 leading-relaxed pt-2.5 border-t border-emerald-200">
                {currentQ.golden_tip}
              </p>
            )}
          </div>
        )}

        {/* 5 Tactile 3D Alternatives: A, B, C, D, E */}
        <div className="space-y-3 pt-2">
          {[
            { letter: "A" as const, text: currentQ.option_a },
            { letter: "B" as const, text: currentQ.option_b },
            { letter: "C" as const, text: currentQ.option_c },
            { letter: "D" as const, text: currentQ.option_d },
            { letter: "E" as const, text: currentQ.option_e },
          ].map((opt) => {
            const isSelected = chosenOption === opt.letter;
            return (
              <div
                key={opt.letter}
                onClick={() => answerQuestion(currentQ.id, opt.letter)}
                className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-150 flex items-start space-x-3.5 select-none ${
                  isSelected
                    ? "bg-brand-50/90 border-brand-500 shadow-3d-sm -translate-y-0.5"
                    : "bg-slate-50/80 border-slate-200 hover:bg-white hover:border-slate-300 hover:-translate-y-0.5"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 transition-all ${
                    isSelected
                      ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-3d-emerald"
                      : "bg-white border-2 border-slate-300 text-slate-700 shadow-xs"
                  }`}
                >
                  {opt.letter}
                </div>
                <div className="text-xs sm:text-sm text-slate-800 pt-1 leading-relaxed font-medium">
                  {opt.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation & Submit Controls */}
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
          disabled={currentQuestionIndex === 0}
          className="btn-3d-white px-5 py-2.5 text-xs disabled:opacity-40"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        <div className="flex items-center space-x-2">
          {!isLastQuestion ? (
            <button
              onClick={() =>
                setCurrentQuestionIndex(Math.min(totalQ - 1, currentQuestionIndex + 1))
              }
              className="btn-3d-indigo px-6 py-2.5 text-xs"
            >
              <span>Próxima</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={submitCurrentSimulation}
              disabled={isLoading}
              className="btn-3d-emerald px-6 py-3 text-xs"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Finalizar e Ver Deliberação</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
