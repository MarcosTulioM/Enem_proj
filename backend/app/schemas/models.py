"""
Pydantic v2 Models for the ENEM Essay Correction System.
Strict typing, comprehensive validation, and full JSON schema compliance.
"""
from typing import List, Optional, Dict, Any, Literal
from pydantic import BaseModel, Field
from datetime import datetime


class RangeOffset(BaseModel):
    start: int = Field(..., description="Character start offset in full text (0-indexed)")
    end: int = Field(..., description="Character end offset in full text (exclusive)")
    paragraph: int = Field(..., description="Paragraph index (1-indexed)")
    sentence: Optional[int] = Field(None, description="Sentence index within paragraph")


class AnnotationSpan(BaseModel):
    id: str = Field(..., description="Unique annotation identifier")
    competency: Literal["C1", "C2", "C3", "C4", "C5"] = Field(..., description="Target INEP Competency")
    severity: Literal["erro", "atencao", "elogio"] = Field(..., description="Severity level of feedback")
    range: RangeOffset
    original_text: str = Field(..., description="Exact substring in user's text")
    title: str = Field(..., description="Short descriptive label")
    description: str = Field(..., description="Detailed explanation of the issue or praise")
    layperson_tip: str = Field(..., description="Simple, humanized explanation without technical jargon")
    suggested_fix: Optional[str] = Field(None, description="Actionable replacement text (Nota 1000 standard)")
    benchmark_comparison: Optional[str] = Field(None, description="Comparison against actual Nota 1000 essays")


class CompetencyScore(BaseModel):
    competency: Literal["C1", "C2", "C3", "C4", "C5"]
    name: str = Field(..., description="Official title of the competency")
    score: int = Field(..., ge=0, le=200, description="Score in increments of 40: 0, 40, 80, 120, 160, 200")
    level: int = Field(..., ge=0, le=5, description="Performance tier level 0-5")
    description: str = Field(..., description="Official INEP descriptor for this level")
    strengths: List[str] = Field(default_factory=list, description="Points where candidate scored well")
    improvements: List[str] = Field(default_factory=list, description="Points where candidate can gain points")
    evidence: List[str] = Field(default_factory=list, description="Citations directly from student text justifying score")


class ExaminerScore(BaseModel):
    examiner_name: str
    focus: str
    scores: Dict[str, int] = Field(..., description="Map of C1..C5 to scores")
    total: int
    rationale: str


class DiscrepancyReport(BaseModel):
    has_discrepancy: bool
    discrepant_competencies: List[str] = Field(default_factory=list)
    total_diff: int
    auditor_intervened: bool
    final_decision_summary: str


class TextMetrics(BaseModel):
    total_words: int
    total_paragraphs: int
    total_sentences: int
    avg_words_per_sentence: float
    avg_words_per_paragraph: float
    type_token_ratio: float = Field(..., description="Lexical richness ratio (TTR)")
    interparagraph_connectors_count: int
    interparagraph_connectors_found: List[str] = Field(default_factory=list)
    c5_elements_present: Dict[str, bool] = Field(default_factory=dict)


class PedagogicalMentorSummary(BaseModel):
    greeting: str
    overall_verdict: str
    greatest_strength: str
    primary_focus_area: str
    suggested_action_plan: List[str]
    inspirational_quote: str


class CorrectionResult(BaseModel):
    id: str
    timestamp: datetime
    profile_id: str
    theme: str
    text: str
    total_score: int = Field(..., ge=0, le=1000)
    competency_scores: Dict[str, CompetencyScore]
    examiner_alfa: ExaminerScore
    examiner_beta: ExaminerScore
    discrepancy_report: DiscrepancyReport
    annotations: List[AnnotationSpan]
    metrics: TextMetrics
    pedagogical_summary: PedagogicalMentorSummary
    similar_benchmarks: List[str] = Field(default_factory=list, description="IDs of matching Nota 1000 essays")


class SubmissionRequest(BaseModel):
    profile_id: Optional[str] = Field("default", description="Student profile ID")
    theme: str = Field(..., min_length=3, description="Redaction prompt theme")
    text: str = Field(..., min_length=50, description="Full typed essay text")


# Corpus and Anatomy Models
class RepertoireItem(BaseModel):
    source: str
    category: str  # Filosofia, Sociologia, Literatura, CF88, Historia, Cinema, etc.
    why_productive: str
    excerpt: Optional[str] = None


class AnatomySection(BaseModel):
    paragraph_index: int
    type: Literal["introducao", "desenvolvimento_1", "desenvolvimento_2", "conclusao"]
    text: str
    interparagraph_connector: Optional[str] = None
    intra_connectors: List[str] = Field(default_factory=list)
    repertoires: List[RepertoireItem] = Field(default_factory=list)
    thesis_or_focus: Optional[str] = None
    c5_elements: Optional[Dict[str, str]] = None  # agente, acao, meio, efeito, detalhamento


class Redacao1000(BaseModel):
    id: str
    year: int
    theme: str
    author: str
    state: Optional[str] = None
    full_text: str
    word_count: int
    paragraph_count: int
    sentence_count: int
    repertoire_categories: List[str] = Field(default_factory=list)
    c5_agent_type: Optional[str] = None
    sections: List[AnatomySection] = Field(default_factory=list)
    key_takeaways: List[str] = Field(default_factory=list)


# Student & History Models
class StudentProfile(BaseModel):
    id: str
    name: str
    created_at: datetime
    avatar_color: Optional[str] = "#10B981"


class SubmissionHistoryItem(BaseModel):
    id: str
    timestamp: datetime
    theme: str
    total_score: int
    c1: int
    c2: int
    c3: int
    c4: int
    c5: int
    word_count: int


class RecurringIssue(BaseModel):
    competency: str
    issue_type: str
    occurrences: int
    description: str
    pedagogical_guidance: str


class StudentAnalytics(BaseModel):
    profile_id: str
    total_essays: int
    average_score: float
    highest_score: int
    competency_averages: Dict[str, float]
    score_progression: List[Dict[str, Any]]
    strongest_competency: str
    focus_competency: str
    recurring_issues: List[RecurringIssue]


class PresetEssay(BaseModel):
    id: str
    title: str
    theme: str
    expected_score: int
    description: str
    tag: Literal["nota_1000", "nota_920", "nota_760", "nota_560"]
    text: str


# ==========================================
# ENEM Questions & Simulated Exams Models
# ==========================================

class EnemQuestion(BaseModel):
    id: str
    year: int
    exam_day: int  # 1 ou 2
    area: str  # 'linguagens', 'humanas', 'natureza', 'matematica'
    subject: str  # 'portugues', 'literatura', 'artes', 'lingua_estrangeira', 'historia', 'geografia', 'filosofia', 'sociologia', 'matematica', 'biologia', 'fisica', 'quimica'
    topic: str
    statement: str
    context_text: Optional[str] = None
    option_a: str
    option_b: str
    option_c: str
    option_d: str
    option_e: str
    correct_option: Literal["A", "B", "C", "D", "E"]
    explanation: str
    distractor_analysis: Dict[str, str] = Field(default_factory=dict)
    difficulty_tri: Literal["facil", "medio", "dificil"] = "medio"
    historical_success_rate: int = 50  # Porcentagem histórica de acerto no ENEM
    golden_tip: str


class SubjectInfo(BaseModel):
    id: str
    name: str
    area: str
    exam_day: int
    question_count_available: int
    exam_ceiling_note: Optional[str] = None
    key_topics: List[str] = Field(default_factory=list)


class SimulatedAnswerItem(BaseModel):
    question_id: str
    chosen_option: Literal["A", "B", "C", "D", "E"]


class SimulatedSessionSubmit(BaseModel):
    profile_id: str = "default"
    exam_day: Optional[int] = None
    area_or_subject: str = "geral"
    answers: List[SimulatedAnswerItem]
    duration_seconds: int = 0


class QuestionFeedbackResult(BaseModel):
    question_id: str
    chosen_option: str
    is_correct: bool
    correct_option: str
    explanation: str
    distractor_note: Optional[str] = None
    difficulty_tri: str
    historical_success_rate: int
    golden_tip: str


class SimulatedSessionResult(BaseModel):
    session_id: str
    timestamp: datetime
    profile_id: str
    exam_day: Optional[int]
    area_or_subject: str
    total_questions: int
    correct_count: int
    raw_accuracy_percentage: float  # Método 1: Taxa Bruta (%)
    estimated_tri_score: float      # Método 2: Estimativa TRI (0 a 1000)
    competency_radar: Dict[str, float] = Field(default_factory=dict)  # Método 3: Radar de Lacunas
    question_feedbacks: List[QuestionFeedbackResult]
    pedagogical_advice: str


class SimulatedHistoryItem(BaseModel):
    id: str
    timestamp: datetime
    exam_day: Optional[int]
    area_or_subject: str
    total_questions: int
    correct_count: int
    raw_accuracy_percentage: float
    estimated_tri_score: float
    duration_seconds: int

