import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CorrectionResult,
  PresetEssay,
  Redacao1000,
  StudentProfile,
  SubmissionHistoryItem,
  StudentAnalytics,
  EnemQuestion,
  SubjectInfo,
  SimulatedSessionResult,
  SimulatedHistoryItem,
  SimulatedAnalytics,
} from "../types";
import * as api from "../services/api";
import confetti from "canvas-confetti";

interface AppState {
  currentView: "welcome" | "hub" | "corrector" | "simulated" | "explorer" | "progress" | "docs";
  theme: string;
  text: string;
  activeProfileId: string;
  profiles: StudentProfile[];
  currentResult: CorrectionResult | null;
  isLoading: boolean;
  errorMessage: string | null;
  activeAnnotationId: string | null;
  presets: PresetEssay[];
  corpus: Redacao1000[];
  selectedEssay: Redacao1000 | null;
  activeLayers: {
    repertoire: boolean;
    thesis: boolean;
    cohesion: boolean;
    c5: boolean;
  };
  sideBySideOpen: boolean;
  history: SubmissionHistoryItem[];
  analytics: StudentAnalytics | null;

  // New Simulated & Hub State
  hasCompletedWelcome: boolean;
  selectedExamDay: 1 | 2 | null;
  selectedSubject: string | null;
  subjects: SubjectInfo[];
  simulatedQuestions: EnemQuestion[];
  currentQuestionIndex: number;
  simulatedAnswers: Record<string, "A" | "B" | "C" | "D" | "E">;
  hintsEnabled: boolean;
  simulatedResult: SimulatedSessionResult | null;
  simulatedHistory: SimulatedHistoryItem[];
  simulatedAnalytics: SimulatedAnalytics | null;
  simulatedDuration: number;

  // Actions
  setCurrentView: (view: "welcome" | "hub" | "corrector" | "simulated" | "explorer" | "progress" | "docs") => void;
  setHasCompletedWelcome: (val: boolean) => void;
  setSelectedExamDay: (day: 1 | 2 | null) => void;
  setSelectedSubject: (subj: string | null) => void;
  toggleHints: () => void;
  setTheme: (theme: string) => void;
  setText: (text: string) => void;
  setActiveAnnotationId: (id: string | null) => void;
  toggleLayer: (layer: "repertoire" | "thesis" | "cohesion" | "c5") => void;
  setSideBySideOpen: (open: boolean) => void;
  selectEssay: (essay: Redacao1000 | null) => void;
  loadPreset: (preset: PresetEssay) => void;
  applySuggestion: (annotationId: string) => void;
  submitCorrection: () => Promise<void>;
  loadInitialData: () => Promise<void>;
  switchProfile: (profileId: string) => Promise<void>;
  addNewProfile: (name: string) => Promise<void>;
  removeProfile: (profileId: string) => Promise<void>;
  filterCorpus: (params: { year?: number; repertoire?: string; c5_agent?: string; search?: string }) => Promise<void>;

  // Simulated Exam Actions
  startSimulatedTest: (params: { exam_day?: number; subject?: string; limit?: number }) => Promise<void>;
  answerQuestion: (questionId: string, option: "A" | "B" | "C" | "D" | "E") => void;
  setCurrentQuestionIndex: (idx: number) => void;
  submitCurrentSimulation: () => Promise<void>;
  resetSimulation: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentView: "welcome",
      theme: "Invisibilidade do trabalho de cuidado realizado pela mulher no Brasil",
      text: "",
      activeProfileId: "default",
      profiles: [{ id: "default", name: "Estudante ENEM", created_at: new Date().toISOString() }],
      currentResult: null,
      isLoading: false,
      errorMessage: null,
      activeAnnotationId: null,
      presets: [],
      corpus: [],
      selectedEssay: null,
      activeLayers: {
        repertoire: true,
        thesis: true,
        cohesion: true,
        c5: true,
      },
      sideBySideOpen: false,
      history: [],
      analytics: null,

      hasCompletedWelcome: false,
      selectedExamDay: 1,
      selectedSubject: null,
      subjects: [],
      simulatedQuestions: [],
      currentQuestionIndex: 0,
      simulatedAnswers: {},
      hintsEnabled: true,
      simulatedResult: null,
      simulatedHistory: [],
      simulatedAnalytics: null,
      simulatedDuration: 0,

      setCurrentView: (view) => set({ currentView: view }),
      setHasCompletedWelcome: (val) => set({ hasCompletedWelcome: val }),
      setSelectedExamDay: (day) => set({ selectedExamDay: day }),
      setSelectedSubject: (subj) => set({ selectedSubject: subj }),
      toggleHints: () => set((state) => ({ hintsEnabled: !state.hintsEnabled })),
      setTheme: (theme) => set({ theme }),
      setText: (text) => set({ text }),
      setActiveAnnotationId: (id) => set({ activeAnnotationId: id }),
      toggleLayer: (layer) =>
        set((state) => ({
          activeLayers: {
            ...state.activeLayers,
            [layer]: !state.activeLayers[layer],
          },
        })),
      setSideBySideOpen: (open) => set({ sideBySideOpen: open }),
      selectEssay: (essay) => set({ selectedEssay: essay }),

      loadPreset: (preset) => {
        set({
          theme: preset.theme,
          text: preset.text,
          currentResult: null,
          activeAnnotationId: null,
          errorMessage: null,
        });
      },

      applySuggestion: (annotationId) => {
        const { currentResult, text } = get();
        if (!currentResult) return;
        const annotation = currentResult.annotations.find((a) => a.id === annotationId);
        if (!annotation || !annotation.suggested_fix) return;

        const { start, end } = annotation.range;
        const original = annotation.original_text;

        let newText = text;
        if (text.slice(start, end) === original) {
          newText = text.slice(0, start) + annotation.suggested_fix + text.slice(end);
        } else {
          newText = text.replace(original, annotation.suggested_fix);
        }

        const updatedAnnotations = currentResult.annotations.filter((a) => a.id !== annotationId);

        set({
          text: newText,
          activeAnnotationId: null,
          currentResult: {
            ...currentResult,
            text: newText,
            annotations: updatedAnnotations,
          },
        });
      },

      submitCorrection: async () => {
        const { theme, text, activeProfileId } = get();
        if (!text || text.trim().length < 50) {
          set({ errorMessage: "Por favor, digite pelo menos 50 caracteres para que a banca possa avaliar sua redação." });
          return;
        }

        set({ isLoading: true, errorMessage: null });
        try {
          const result = await api.correctEssay(theme, text, activeProfileId);
          set({ currentResult: result, isLoading: false });

          const history = await api.fetchHistory(activeProfileId);
          const analytics = await api.fetchAnalytics(activeProfileId);
          set({ history, analytics });

          if (result.total_score >= 960) {
            confetti({
              particleCount: 120,
              spread: 70,
              origin: { y: 0.6 },
            });
          }
        } catch (err: any) {
          set({
            isLoading: false,
            errorMessage: err.message || "Erro de conexão com o servidor de avaliação.",
          });
        }
      },

      loadInitialData: async () => {
        try {
          const [presets, corpus, profiles, subjects] = await Promise.all([
            api.fetchPresets().catch(() => []),
            api.fetchCorpus().catch(() => []),
            api.fetchProfiles().catch(() => []),
            api.fetchSubjects().catch(() => []),
          ]);

          const resolvedProfiles = profiles.length > 0 ? profiles : get().profiles;
          const currentActive = get().activeProfileId;
          const validActiveId = resolvedProfiles.some((p) => p.id === currentActive)
            ? currentActive
            : resolvedProfiles[0]?.id || "default";

          set({
            presets,
            corpus,
            selectedEssay: corpus[0] || null,
            profiles: resolvedProfiles,
            activeProfileId: validActiveId,
            subjects,
          });

          if (!get().text && presets.length > 0) {
            const defaultPreset = presets[0];
            set({
              theme: defaultPreset.theme,
              text: defaultPreset.text,
            });
          }

          const [history, analytics, simHistory, simAnalytics] = await Promise.all([
            api.fetchHistory(validActiveId).catch(() => []),
            api.fetchAnalytics(validActiveId).catch(() => null),
            api.fetchSimulatedHistory(validActiveId).catch(() => []),
            api.fetchSimulatedAnalytics(validActiveId).catch(() => null),
          ]);
          set({
            history,
            analytics,
            simulatedHistory: simHistory,
            simulatedAnalytics: simAnalytics,
          });
        } catch (err) {
          console.error("Erro ao carregar dados iniciais:", err);
        }
      },

      switchProfile: async (profileId) => {
        set({ activeProfileId: profileId, isLoading: true });
        try {
          const [history, analytics, simHistory, simAnalytics] = await Promise.all([
            api.fetchHistory(profileId),
            api.fetchAnalytics(profileId),
            api.fetchSimulatedHistory(profileId),
            api.fetchSimulatedAnalytics(profileId),
          ]);
          set({
            history,
            analytics,
            simulatedHistory: simHistory,
            simulatedAnalytics: simAnalytics,
            isLoading: false,
          });
        } catch (err) {
          set({ isLoading: false });
        }
      },

      addNewProfile: async (name) => {
        try {
          const newProf = await api.createProfile(name);
          const profiles = await api.fetchProfiles();
          set({ profiles, activeProfileId: newProf.id });
          await get().switchProfile(newProf.id);
        } catch (err) {
          console.error("Erro ao criar perfil:", err);
        }
      },

      removeProfile: async (profileId) => {
        try {
          const remaining = await api.deleteProfile(profileId);
          const nextProfileId = remaining[0]?.id || "default";
          set({
            profiles: remaining,
            activeProfileId: nextProfileId,
            currentResult: null,
            simulatedResult: null,
          });
          await get().switchProfile(nextProfileId);
        } catch (err) {
          console.error("Erro ao excluir perfil:", err);
        }
      },

      filterCorpus: async (params) => {
        try {
          const filtered = await api.fetchCorpus(params);
          set({
            corpus: filtered,
            selectedEssay: filtered[0] || null,
          });
        } catch (err) {
          console.error("Erro ao filtrar corpus:", err);
        }
      },

      // Simulated Exams Implementations
      startSimulatedTest: async (params) => {
        set({ isLoading: true, errorMessage: null, simulatedResult: null, simulatedAnswers: {}, currentQuestionIndex: 0 });
        try {
          const questions = await api.fetchSimulatedQuestions({
            exam_day: params.exam_day,
            subject: params.subject,
            limit: params.limit || 10,
            profile_id: get().activeProfileId,
            avoid_already_answered: true,
          });

          if (!questions || questions.length === 0) {
            set({
              isLoading: false,
              errorMessage: "Nenhuma questão encontrada para este filtro no momento.",
            });
            return;
          }

          set({
            simulatedQuestions: questions,
            selectedExamDay: (params.exam_day as 1 | 2) || (questions[0]?.exam_day as 1 | 2) || 1,
            selectedSubject: params.subject || null,
            currentView: "simulated",
            isLoading: false,
            simulatedDuration: 0,
          });
        } catch (err: any) {
          set({
            isLoading: false,
            errorMessage: err.message || "Erro ao carregar questões do simulado.",
          });
        }
      },

      answerQuestion: (questionId, option) => {
        set((state) => ({
          simulatedAnswers: {
            ...state.simulatedAnswers,
            [questionId]: option,
          },
        }));
      },

      setCurrentQuestionIndex: (idx) => {
        set({ currentQuestionIndex: idx });
      },

      submitCurrentSimulation: async () => {
        const { simulatedQuestions, simulatedAnswers, activeProfileId, selectedExamDay, selectedSubject } = get();
        if (simulatedQuestions.length === 0) return;

        const answersList = Object.entries(simulatedAnswers).map(([qid, opt]) => ({
          question_id: qid,
          chosen_option: opt,
        }));

        set({ isLoading: true, errorMessage: null });
        try {
          const areaOrSubj = selectedSubject || (selectedExamDay === 1 ? "Dia 1 (Humanas e Linguagens)" : "Dia 2 (Matemática e Natureza)");
          const result = await api.submitSimulatedSession({
            profile_id: activeProfileId,
            exam_day: selectedExamDay || undefined,
            area_or_subject: areaOrSubj,
            answers: answersList,
            duration_seconds: get().simulatedDuration || 180,
          });

          set({
            simulatedResult: result,
            isLoading: false,
          });

          // Refresh history and analytics
          const [simHistory, simAnalytics] = await Promise.all([
            api.fetchSimulatedHistory(activeProfileId),
            api.fetchSimulatedAnalytics(activeProfileId),
          ]);
          set({
            simulatedHistory: simHistory,
            simulatedAnalytics: simAnalytics,
          });

          if (result.raw_accuracy_percentage >= 80) {
            confetti({
              particleCount: 100,
              spread: 60,
              origin: { y: 0.6 },
            });
          }
        } catch (err: any) {
          set({
            isLoading: false,
            errorMessage: err.message || "Erro ao avaliar respostas do simulado.",
          });
        }
      },

      resetSimulation: () => {
        set({
          simulatedQuestions: [],
          simulatedAnswers: {},
          simulatedResult: null,
          currentQuestionIndex: 0,
        });
      },
    }),
    {
      name: "enem-evaluator-storage",
      partialize: (state) => ({
        theme: state.theme,
        text: state.text,
        activeProfileId: state.activeProfileId,
        activeLayers: state.activeLayers,
        hasCompletedWelcome: state.hasCompletedWelcome,
        hintsEnabled: state.hintsEnabled,
      }),
    }
  )
);
