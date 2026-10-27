import type {
  CorrectionResult,
  PresetEssay,
  Redacao1000,
  StudentProfile,
  SubmissionHistoryItem,
  StudentAnalytics,
} from "../types";

const API_BASE =
  typeof window !== "undefined" && window.location.origin.includes("localhost:5173")
    ? "http://localhost:8000/api/v1"
    : "/api/v1";

export async function correctEssay(
  theme: string,
  text: string,
  profileId: string = "default"
): Promise<CorrectionResult> {
  const response = await fetch(`${API_BASE}/correct`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ theme, text, profile_id: profileId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro ao corrigir redação");
  }
  return response.json();
}

export async function fetchPresets(): Promise<PresetEssay[]> {
  const response = await fetch(`${API_BASE}/presets`);
  if (!response.ok) throw new Error("Erro ao carregar presets");
  return response.json();
}

export async function fetchCorpus(params?: {
  year?: number;
  repertoire?: string;
  c5_agent?: string;
  search?: string;
}): Promise<Redacao1000[]> {
  const url = new URL(`${API_BASE}/corpus-100`);
  if (params?.year) url.searchParams.set("year", params.year.toString());
  if (params?.repertoire) url.searchParams.set("repertoire", params.repertoire);
  if (params?.c5_agent) url.searchParams.set("c5_agent", params.c5_agent);
  if (params?.search) url.searchParams.set("search", params.search);

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Erro ao buscar redações nota 1000");
  return response.json();
}

export async function fetchCorpusStats(): Promise<any> {
  const response = await fetch(`${API_BASE}/corpus-100/stats`);
  if (!response.ok) throw new Error("Erro ao carregar estatísticas do corpus");
  return response.json();
}

export async function fetchEssayDetail(id: string): Promise<Redacao1000> {
  const response = await fetch(`${API_BASE}/corpus-100/${id}`);
  if (!response.ok) throw new Error("Redação não encontrada");
  return response.json();
}

export async function fetchProfiles(): Promise<StudentProfile[]> {
  const response = await fetch(`${API_BASE}/profiles`);
  if (!response.ok) throw new Error("Erro ao buscar perfis");
  return response.json();
}

export async function createProfile(name: string): Promise<StudentProfile> {
  const response = await fetch(`${API_BASE}/profiles`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!response.ok) throw new Error("Erro ao criar perfil");
  return response.json();
}

export async function deleteProfile(profileId: string): Promise<StudentProfile[]> {
  const response = await fetch(`${API_BASE}/profiles/${encodeURIComponent(profileId)}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Erro ao excluir perfil");
  return response.json();
}

export async function fetchHistory(profileId: string = "default"): Promise<SubmissionHistoryItem[]> {
  const response = await fetch(`${API_BASE}/history?profile_id=${encodeURIComponent(profileId)}`);
  if (!response.ok) throw new Error("Erro ao carregar histórico");
  return response.json();
}

export async function fetchAnalytics(profileId: string = "default"): Promise<StudentAnalytics> {
  const response = await fetch(`${API_BASE}/analytics?profile_id=${encodeURIComponent(profileId)}`);
  if (!response.ok) throw new Error("Erro ao carregar analytics");
  return response.json();
}

export async function fetchSubmissionDetail(id: string): Promise<CorrectionResult> {
  const response = await fetch(`${API_BASE}/submission/${id}`);
  if (!response.ok) throw new Error("Correção não encontrada");
  return response.json();
}

// ==========================================
// Official ENEM Simulated Exams API Calls
// ==========================================

export async function fetchSubjects(): Promise<any[]> {
  const response = await fetch(`${API_BASE}/simulated/subjects`);
  if (!response.ok) throw new Error("Erro ao carregar matérias");
  return response.json();
}

export async function fetchSimulatedQuestions(params: {
  exam_day?: number;
  area?: string;
  subject?: string;
  limit?: number;
  profile_id?: string;
  avoid_already_answered?: boolean;
}): Promise<any[]> {
  const url = new URL(`${API_BASE}/simulated/questions`);
  if (params.exam_day) url.searchParams.set("exam_day", params.exam_day.toString());
  if (params.area) url.searchParams.set("area", params.area);
  if (params.subject) url.searchParams.set("subject", params.subject);
  if (params.limit) url.searchParams.set("limit", params.limit.toString());
  if (params.profile_id) url.searchParams.set("profile_id", params.profile_id);
  if (params.avoid_already_answered) url.searchParams.set("avoid_already_answered", "true");

  const response = await fetch(url.toString());
  if (!response.ok) throw new Error("Erro ao buscar questões");
  return response.json();
}

export async function submitSimulatedSession(payload: {
  profile_id: string;
  exam_day?: number;
  area_or_subject: string;
  answers: Array<{ question_id: string; chosen_option: string }>;
  duration_seconds: number;
}): Promise<any> {
  const response = await fetch(`${API_BASE}/simulated/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || "Erro ao avaliar simulado");
  }
  return response.json();
}

export async function fetchSimulatedHistory(profileId: string = "default"): Promise<any[]> {
  const response = await fetch(`${API_BASE}/simulated/history?profile_id=${encodeURIComponent(profileId)}`);
  if (!response.ok) throw new Error("Erro ao carregar histórico de simulados");
  return response.json();
}

export async function fetchSimulatedAnalytics(profileId: string = "default"): Promise<any> {
  const response = await fetch(`${API_BASE}/simulated/analytics?profile_id=${encodeURIComponent(profileId)}`);
  if (!response.ok) throw new Error("Erro ao carregar métricas dos simulados");
  return response.json();
}

