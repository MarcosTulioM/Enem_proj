export interface RangeOffset {
  start: number;
  end: number;
  paragraph: number;
  sentence?: number;
}

export interface AnnotationSpan {
  id: string;
  competency: "C1" | "C2" | "C3" | "C4" | "C5";
  severity: "erro" | "atencao" | "elogio";
  range: {
    start: number;
    end: number;
    paragraph: number;
  };
  original_text: string;
  title: string;
  description: string;
  layperson_tip: string;
  suggested_fix?: string;
  benchmark_comparison?: string;
}

export interface CompetencyScore {
  competency: "C1" | "C2" | "C3" | "C4" | "C5";
  name: string;
  score: number;
  level: number;
  description: string;
  strengths: string[];
  improvements: string[];
  evidence: string[];
}

export interface ExaminerScore {
  examiner_name: string;
  focus: string;
  scores: Record<string, number>;
  total: number;
  rationale: string;
}

export interface DiscrepancyReport {
  has_discrepancy: boolean;
  discrepant_competencies: string[];
  total_diff: number;
  auditor_intervened: boolean;
  final_decision_summary: string;
}

export interface TextMetrics {
  total_words: number;
  total_paragraphs: number;
  total_sentences: number;
  avg_words_per_sentence: number;
  avg_words_per_paragraph: number;
  type_token_ratio: number;
  interparagraph_connectors_count: number;
  interparagraph_connectors_found: string[];
  c5_elements_present: Record<string, boolean>;
}

export interface PedagogicalMentorSummary {
  greeting: string;
  overall_verdict: string;
  greatest_strength: string;
  primary_focus_area: string;
  suggested_action_plan: string[];
  inspirational_quote: string;
}

export interface CorrectionResult {
  id: string;
  timestamp: string;
  profile_id: string;
  theme: string;
  text: string;
  total_score: number;
  competency_scores: Record<string, CompetencyScore>;
  examiner_alfa: ExaminerScore;
  examiner_beta: ExaminerScore;
  discrepancy_report: DiscrepancyReport;
  annotations: AnnotationSpan[];
  metrics: TextMetrics;
  pedagogical_summary: PedagogicalMentorSummary;
  similar_benchmarks: string[];
}

export interface RepertoireItem {
  source: string;
  category: string;
  why_productive: string;
  excerpt?: string;
}

export interface AnatomySection {
  paragraph_index: number;
  type: "introducao" | "desenvolvimento_1" | "desenvolvimento_2" | "conclusao";
  text: string;
  interparagraph_connector?: string;
  intra_connectors: string[];
  repertoires: RepertoireItem[];
  thesis_or_focus?: string;
  c5_elements?: Record<string, string>;
}

export interface Redacao1000 {
  id: string;
  year: number;
  theme: string;
  author: string;
  state?: string;
  full_text: string;
  word_count: number;
  paragraph_count: number;
  sentence_count: number;
  repertoire_categories: string[];
  c5_agent_type?: string;
  sections: AnatomySection[];
  key_takeaways: string[];
}

export interface StudentProfile {
  id: string;
  name: string;
  created_at: string;
  avatar_color?: string;
}

export interface SubmissionHistoryItem {
  id: string;
  timestamp: string;
  theme: string;
  total_score: number;
  c1: number;
  c2: number;
  c3: number;
  c4: number;
  c5: number;
  word_count: number;
}

export interface RecurringIssue {
  competency: string;
  issue_type: string;
  occurrences: number;
  description: string;
  pedagogical_guidance: string;
}

export interface StudentAnalytics {
  profile_id: string;
  total_essays: number;
  average_score: number;
  highest_score: number;
  competency_averages: Record<string, number>;
  score_progression: Array<{
    index: number;
    date: string;
    score: number;
    theme: string;
    c1: number;
    c2: number;
    c3: number;
    c4: number;
    c5: number;
  }>;
  strongest_competency: string;
  focus_competency: string;
  recurring_issues: RecurringIssue[];
}

export interface PresetEssay {
  id: string;
  title: string;
  theme: string;
  expected_score: number;
  description: string;
  tag: "nota_1000" | "nota_920" | "nota_760" | "nota_560";
  text: string;
}

export interface EnemQuestion {
  id: string;
  year: number;
  exam_day: number;
  area: "linguagens" | "humanas" | "natureza" | "matematica";
  subject: string;
  topic: string;
  statement: string;
  context_text?: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  option_e: string;
  correct_option: "A" | "B" | "C" | "D" | "E";
  explanation: string;
  distractor_analysis?: Record<string, string>;
  difficulty_tri: "facil" | "medio" | "dificil";
  historical_success_rate: number;
  golden_tip: string;
}

export interface SubjectInfo {
  id: string;
  name: string;
  area: string;
  exam_day: number;
  question_count_available: number;
  exam_ceiling_note?: string | null;
  key_topics: string[];
}

export interface SimulatedAnswerItem {
  question_id: string;
  chosen_option: "A" | "B" | "C" | "D" | "E";
}

export interface QuestionFeedbackResult {
  question_id: string;
  chosen_option: string;
  is_correct: boolean;
  correct_option: string;
  explanation: string;
  distractor_note?: string;
  difficulty_tri: string;
  historical_success_rate: number;
  golden_tip: string;
}

export interface SimulatedSessionResult {
  session_id: string;
  timestamp: string;
  profile_id: string;
  exam_day?: number;
  area_or_subject: string;
  total_questions: number;
  correct_count: number;
  raw_accuracy_percentage: number;
  estimated_tri_score: number;
  competency_radar: Record<string, number>;
  question_feedbacks: QuestionFeedbackResult[];
  pedagogical_advice: string;
}

export interface SimulatedHistoryItem {
  id: string;
  timestamp: string;
  exam_day?: number;
  area_or_subject: string;
  total_questions: number;
  correct_count: number;
  raw_accuracy_percentage: number;
  estimated_tri_score: number;
  duration_seconds: number;
}

export interface SimulatedAnalytics {
  total_simulations: number;
  total_questions_answered: number;
  average_raw_accuracy: number;
  average_tri_score: number;
  best_tri_score: number;
  subject_accuracy: Record<string, number>;
  tri_progression: Array<{
    index: number;
    date: string;
    tri_score: number;
    raw_accuracy: number;
    area_or_subject: string;
  }>;
}

