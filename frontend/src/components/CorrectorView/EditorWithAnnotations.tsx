import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  FileText,
  Check,
  AlertCircle,
  HelpCircle,
  Send,
  Loader2,
  Eye,
  Edit3,
  BookmarkCheck,
} from "lucide-react";

export const EditorWithAnnotations: React.FC = () => {
  const {
    theme,
    setTheme,
    text,
    setText,
    currentResult,
    isLoading,
    errorMessage,
    submitCorrection,
    activeAnnotationId,
    setActiveAnnotationId,
    applySuggestion,
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<"edit" | "annotated">("edit");

  const wordsCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const paragraphsCount = text.trim()
    ? text.split("\n\n").filter((p) => p.trim()).length ||
      text.split("\n").filter((p) => p.trim()).length
    : 0;
  const sentencesCount = text.trim()
    ? text.split(/[.!?]+/).filter((s) => s.trim().length > 3).length
    : 0;

  const selectedAnnotation = currentResult?.annotations.find(
    (a) => a.id === activeAnnotationId
  );

  React.useEffect(() => {
    if (currentResult && currentResult.annotations.length > 0) {
      setActiveTab("annotated");
    }
  }, [currentResult]);

  const renderAnnotatedText = () => {
    if (!currentResult || currentResult.annotations.length === 0) {
      return (
        <div className="whitespace-pre-wrap font-serif text-slate-800 text-base leading-[32px] p-6 enem-paper-sheet min-h-[380px]">
          {text || "Digite sua redação para ver a análise da banca."}
        </div>
      );
    }

    const sortedAnnotations = [...currentResult.annotations].sort(
      (a, b) => a.range.start - b.range.start
    );

    const parts: React.ReactNode[] = [];
    let lastIndex = 0;

    sortedAnnotations.forEach((ann, idx) => {
      const { start, end } = ann.range;
      if (start > lastIndex && start <= text.length) {
        parts.push(
          <span key={`text-${lastIndex}-${start}`}>
            {text.slice(lastIndex, start)}
          </span>
        );
      }

      if (start >= 0 && end <= text.length && end > start) {
        const isSelected = activeAnnotationId === ann.id;
        let colorClasses = "bg-amber-200/80 border-b-2 border-amber-500 text-amber-950";
        if (ann.severity === "erro") {
          colorClasses = "bg-rose-200/85 border-b-2 border-rose-600 text-rose-950";
        } else if (ann.severity === "elogio") {
          colorClasses = "bg-emerald-200/85 border-b-2 border-emerald-600 text-emerald-950";
        }

        parts.push(
          <mark
            key={`ann-${ann.id}-${idx}`}
            onClick={() => setActiveAnnotationId(ann.id)}
            className={`cursor-pointer px-1.5 py-0.5 rounded-md transition-all duration-150 inline font-semibold ${colorClasses} ${
              isSelected
                ? "ring-2 ring-brand-600 shadow-md font-bold"
                : "hover:brightness-95"
            }`}
            title={`Competência ${ann.competency}: ${ann.title}`}
          >
            {text.slice(start, end)}
          </mark>
        );
        lastIndex = end;
      }
    });

    if (lastIndex < text.length) {
      parts.push(
        <span key={`text-end-${lastIndex}`}>{text.slice(lastIndex)}</span>
      );
    }

    return (
      <div className="whitespace-pre-wrap font-serif text-slate-800 text-base leading-[32px] p-6 enem-paper-sheet min-h-[380px]">
        {parts}
      </div>
    );
  };

  return (
    <div className="card-3d overflow-hidden flex flex-col h-full">
      {/* Theme Input Header */}
      <div className="p-4 sm:p-5 border-b-2 border-slate-200/80 bg-slate-50/90">
        <label className="block text-xs font-display font-black text-slate-700 uppercase tracking-wider mb-1.5 flex flex-wrap items-center justify-between gap-1">
          <span className="flex items-center">
            <FileText className="w-4 h-4 text-brand-600 mr-1.5" />
            Tema da Redação do ENEM:
          </span>
          <span className="text-[11px] font-sans font-medium text-slate-400">
            Folha Oficial de Redação • 30 Linhas
          </span>
        </label>
        <input
          type="text"
          value={theme}
          onChange={(e) => setTheme(e.target.value)}
          placeholder="Ex: Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil"
          className="w-full px-3.5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-display font-bold text-slate-900 placeholder-slate-400 focus:border-brand-500 focus:outline-none transition-all shadow-inner"
        />
      </div>

      {/* Mode Switcher & Live Counters */}
      <div className="px-4 sm:px-5 py-2.5 border-b-2 border-slate-200 bg-white flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("edit")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-display font-bold transition-all ${
              activeTab === "edit"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Folha de Digitação</span>
          </button>
          <button
            onClick={() => setActiveTab("annotated")}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-display font-bold transition-all ${
              activeTab === "annotated"
                ? "bg-brand-600 text-white shadow-xs"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Eye className={`w-3.5 h-3.5 ${activeTab === "annotated" ? "text-white" : "text-brand-600"}`} />
            <span>Raio-X com Anotações</span>
            {currentResult && currentResult.annotations.length > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full font-mono font-bold text-[10px] ${
                  activeTab === "annotated"
                    ? "bg-white/20 text-white"
                    : "bg-brand-100 text-brand-800"
                }`}
              >
                {currentResult.annotations.length}
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center space-x-3 text-slate-500 font-medium">
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="font-mono font-extrabold text-slate-900">{wordsCount}</span>
            <span>palavras</span>
          </div>
          <div className="flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span
              className={`font-mono font-extrabold ${
                paragraphsCount === 4 ? "text-emerald-600" : "text-amber-600"
              }`}
            >
              {paragraphsCount}
            </span>
            <span>parágrafos</span>
          </div>
          <div className="hidden sm:flex items-center space-x-1 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200">
            <span className="font-mono font-extrabold text-slate-900">{sentencesCount}</span>
            <span>períodos</span>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div className="bg-rose-50 border-b-2 border-rose-200 px-4 py-2.5 text-xs text-rose-700 font-bold flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Lined Paper Sheet Body */}
      <div className="flex-1 overflow-y-auto relative min-h-[380px] max-h-[550px]">
        {activeTab === "edit" ? (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Comece a digitar sua redação aqui na folha pautada..."
            className="w-full h-full min-h-[380px] p-6 text-base font-serif text-slate-800 leading-[32px] enem-paper-sheet placeholder-slate-400 focus:outline-none resize-none"
          />
        ) : (
          renderAnnotatedText()
        )}
      </div>

      {/* Selected Annotation Interactive Drawer */}
      {selectedAnnotation && (
        <div className="border-t-2 border-slate-200 bg-slate-50 p-4 sm:p-5 animate-in slide-in-from-bottom-2">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="px-2 py-0.5 rounded-md text-[11px] font-display font-black bg-slate-900 text-white">
                  {selectedAnnotation.competency}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-md text-[11px] font-display font-bold ${
                    selectedAnnotation.severity === "erro"
                      ? "bg-rose-100 text-rose-800 border border-rose-200"
                      : selectedAnnotation.severity === "elogio"
                      ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                      : "bg-amber-100 text-amber-800 border border-amber-200"
                  }`}
                >
                  {selectedAnnotation.title}
                </span>
              </div>

              <p className="text-xs text-slate-700 font-medium mb-2">
                {selectedAnnotation.description}
              </p>

              <div className="bg-brand-50 border-2 border-brand-200/80 rounded-xl p-3 mb-2.5">
                <span className="text-[11px] font-display font-bold text-brand-800 block mb-0.5 flex items-center">
                  <HelpCircle className="w-3.5 h-3.5 mr-1" />
                  Dica Simples (para o dia a dia):
                </span>
                <p className="text-xs text-brand-950">{selectedAnnotation.layperson_tip}</p>
              </div>

              {selectedAnnotation.suggested_fix && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white border-2 border-slate-200 rounded-xl p-3 shadow-xs">
                  <div>
                    <span className="text-[10px] uppercase font-display font-bold text-slate-400 block">
                      Sugestão de Reescrita (Padrão Nota 1000):
                    </span>
                    <span className="text-xs font-serif font-bold text-emerald-800">
                      "{selectedAnnotation.suggested_fix}"
                    </span>
                  </div>

                  <button
                    onClick={() => applySuggestion(selectedAnnotation.id)}
                    className="btn-3d-emerald px-3.5 py-2 text-xs shrink-0"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>Aplicar Correção no Texto</span>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => setActiveAnnotationId(null)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold p-1.5 rounded-lg hover:bg-slate-200/60"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Submit Bar */}
      <div className="p-4 border-t-2 border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-slate-500 font-medium">
          {currentResult ? (
            <span className="text-emerald-700 font-display font-bold flex items-center">
              <Check className="w-4 h-4 mr-1 text-emerald-600" />
              Redação avaliada pela Banca Multi-Agente Oficial
            </span>
          ) : (
            <span>Clique para enviar e receber a nota da banca (0 a 1000)</span>
          )}
        </div>

        <button
          onClick={submitCorrection}
          disabled={isLoading}
          className="btn-3d-emerald w-full sm:w-auto px-6 py-3 text-sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Examinadores Deliberando...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Corrigir Redação com a Banca</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
