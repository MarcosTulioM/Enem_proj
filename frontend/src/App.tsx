import React, { useEffect } from "react";
import { useAppStore } from "./store/useAppStore";
import { Navbar } from "./components/Navbar";
import { WelcomeHero } from "./components/HomeView/WelcomeHero";
import { DayHubView } from "./components/HubView/DayHubView";
import { SimulatedExamView } from "./components/SimulatedView/SimulatedExamView";
import { PresetsBar } from "./components/CorrectorView/PresetsBar";
import { EditorWithAnnotations } from "./components/CorrectorView/EditorWithAnnotations";
import { ScorecardPanel } from "./components/CorrectorView/ScorecardPanel";
import { CorpusExplorer } from "./components/ExplorerView/CorpusExplorer";
import { StudentProgress } from "./components/ProgressView/StudentProgress";
import { LaypersonGuide } from "./components/DocsView/LaypersonGuide";
import { BookOpen } from "lucide-react";

export const App: React.FC = () => {
  const { currentView, setCurrentView, loadInitialData } = useAppStore();

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8">
        {currentView === "welcome" && <WelcomeHero />}

        {currentView === "hub" && <DayHubView />}

        {currentView === "simulated" && <SimulatedExamView />}

        {currentView === "corrector" && (
          <div className="space-y-6">
            <PresetsBar />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Editor & Annotated Canvas */}
              <div className="lg:col-span-7 min-w-0">
                <EditorWithAnnotations />
              </div>

              {/* Right Column: Scorecard, 5 Competencies & Banca Deliberation */}
              <div className="lg:col-span-5 min-w-0">
                <ScorecardPanel />
              </div>
            </div>
          </div>
        )}

        {currentView === "explorer" && <CorpusExplorer />}

        {currentView === "progress" && <StudentProgress />}

        {currentView === "docs" && <LaypersonGuide />}
      </main>

      {/* Floating 3D Quick Help Button for Laypeople */}
      {currentView !== "docs" && currentView !== "welcome" && (
        <button
          onClick={() => setCurrentView("docs")}
          className="fixed bottom-5 right-5 z-40 bg-slate-900 hover:bg-slate-800 text-white pl-3.5 pr-4 py-2.5 rounded-2xl shadow-3d-dark border-2 border-slate-700 flex items-center space-x-2 text-xs font-display font-bold transition-all hover:-translate-y-0.5 active:translate-y-0.5 group"
          title="Abrir o Manual para Leigos"
        >
          <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
          </div>
          <span className="text-slate-100 group-hover:text-white">
            Como Usar? (Manual)
          </span>
        </button>
      )}

      {/* Footer */}
      <footer className="border-t-2 border-slate-200/80 bg-white/90 backdrop-blur-md py-6 mt-12 text-center text-xs text-slate-400 px-4">
        <p className="font-display font-bold text-slate-600">
          EnemCorretor Argon 3D • Redação com Sub-Agentes, Simulados Oficiais TRI & Banco de 100 Redações Nota 1000 Reais.
        </p>
        <p className="text-[11px] text-slate-400 mt-1">
          Banco de dados local SQLite integrado. Desenvolvido para vestibulandos e educadores de todo o Brasil.
        </p>
      </footer>
    </div>
  );
};

export default App;
