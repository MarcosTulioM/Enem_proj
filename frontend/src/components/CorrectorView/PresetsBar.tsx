import React from "react";
import { useAppStore } from "../../store/useAppStore";
import { Sparkles, CheckCircle2, AlertTriangle, AlertOctagon, BookOpen } from "lucide-react";
import type { PresetEssay } from "../../types";

export const PresetsBar: React.FC = () => {
  const { presets, loadPreset, isLoading, setCurrentView } = useAppStore();

  const handleQuickTest = (preset: PresetEssay) => {
    loadPreset(preset);
  };

  const getBadgeStyle = (tag: string) => {
    switch (tag) {
      case "nota_1000":
        return "bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100";
      case "nota_920":
        return "bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100";
      case "nota_760":
        return "bg-orange-50 text-orange-800 border-orange-300 hover:bg-orange-100";
      case "nota_560":
        return "bg-rose-50 text-rose-800 border-rose-300 hover:bg-rose-100";
      default:
        return "bg-slate-50 text-slate-800 border-slate-300 hover:bg-slate-100";
    }
  };

  const getIcon = (tag: string) => {
    switch (tag) {
      case "nota_1000":
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mr-1.5 shrink-0" />;
      case "nota_920":
        return <Sparkles className="w-3.5 h-3.5 text-amber-600 mr-1.5 shrink-0" />;
      case "nota_760":
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-600 mr-1.5 shrink-0" />;
      case "nota_560":
        return <AlertOctagon className="w-3.5 h-3.5 text-rose-600 mr-1.5 shrink-0" />;
      default:
        return null;
    }
  };

  if (!presets || presets.length === 0) return null;

  return (
    <div className="card-3d p-4 sm:p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-display font-black text-slate-900 uppercase tracking-wider flex items-center">
              <Sparkles className="w-4 h-4 text-brand-600 mr-1.5" />
              Experimente em 1 Clique (Testes Calibrados da Banca):
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Não tem uma redação pronta agora? Escolha um exemplo real para ver como os corretores avaliam cada detalhe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              onClick={() => handleQuickTest(preset)}
              disabled={isLoading}
              className={`flex items-center px-3 py-2 rounded-xl border-2 text-xs font-display font-bold shadow-3d-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5 disabled:opacity-50 ${getBadgeStyle(
                preset.tag
              )}`}
              title={preset.description}
            >
              {getIcon(preset.tag)}
              <span>{preset.title.split("(")[0].trim()}</span>
              <span className="ml-1.5 font-mono font-extrabold opacity-90">
                ({preset.expected_score} pts)
              </span>
            </button>
          ))}

          <button
            onClick={() => setCurrentView("docs")}
            className="btn-3d-white px-3.5 py-2 text-xs"
            title="Abrir o Manual para Leigos"
          >
            <BookOpen className="w-3.5 h-3.5 text-brand-600" />
            <span>Guia do Aluno</span>
          </button>
        </div>
      </div>
    </div>
  );
};
