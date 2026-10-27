"""
Master Orchestrator Sub-Agent.
Coordinates the multi-agent mission pipeline according to subagent-orchestrator
and subagent-driven-development guidelines.
"""
import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from app.schemas.models import (
    SubmissionRequest,
    CorrectionResult,
    RangeOffset,
    AnnotationSpan
)
from app.engine.nlp_engine import NLPEngine
from app.engine.inep_rules import INEPDiscrepancyEngine
from app.engine.rag_engine import RAGEngine
from app.agents.examiner_alfa import ExaminerAlfa
from app.agents.examiner_beta import ExaminerBeta
from app.agents.auditor_supervisor import AuditorSupervisor
from app.agents.mentor_pedagogico import MentorPedagogico

class MasterOrchestrator:
    def __init__(self, corpus_path: Optional[str] = None):
        self.nlp_engine = NLPEngine()
        self.examiner_alfa = ExaminerAlfa()
        self.examiner_beta = ExaminerBeta()
        self.auditor = AuditorSupervisor()
        self.mentor = MentorPedagogico()
        self.rag = RAGEngine(corpus_path=corpus_path)

    def process_submission(self, request: SubmissionRequest) -> CorrectionResult:
        submission_id = f"corr-{uuid.uuid4().hex[:10]}"
        now = datetime.now()

        # Step 1: Deterministic NLP Engine
        metrics = self.nlp_engine.compute_metrics(request.text)
        annotations = self.nlp_engine.extract_annotations(request.text)

        # Step 2: Human rights check
        violates_hr = INEPDiscrepancyEngine.check_human_rights_violation(request.text)

        # Step 3: Examiner Alfa evaluation
        alfa_result = self.examiner_alfa.evaluate(request.text, metrics, annotations)

        # Step 4: Examiner Beta evaluation
        beta_result = self.examiner_beta.evaluate(request.text, request.theme, metrics, annotations)

        # Step 5: Check Discrepancy
        has_disc, disc_comps, total_diff = INEPDiscrepancyEngine.evaluate_discrepancy(
            alfa_result.scores,
            beta_result.scores
        )

        auditor_scores = None
        if has_disc:
            auditor_scores = self.auditor.arbitrate(
                alfa_result.scores,
                beta_result.scores,
                disc_comps,
                metrics,
                annotations
            )

        # Step 6: Final scores and discrepancy report
        final_scores_dict, disc_report = INEPDiscrepancyEngine.calculate_final_scores(
            alfa_result.scores,
            beta_result.scores,
            auditor_scores=auditor_scores,
            violates_human_rights=violates_hr
        )

        competency_models = INEPDiscrepancyEngine.build_competency_score_models(final_scores_dict)
        total_score = sum(final_scores_dict.values())

        # Step 7: RAG retrieval for similar Nota 1000 essays
        similar_essays = self.rag.search_similar_essays(request.theme, top_k=3)
        similar_ids = [e["id"] for e in similar_essays]
        similar_themes = [e["theme"] for e in similar_essays]

        # Step 8: Mentor synthesis
        mentor_summary = self.mentor.synthesize(
            total_score=total_score,
            competency_scores=competency_models,
            annotations=annotations,
            metrics=metrics,
            similar_benchmark_themes=similar_themes
        )

        return CorrectionResult(
            id=submission_id,
            timestamp=now,
            profile_id=request.profile_id or "default",
            theme=request.theme,
            text=request.text,
            total_score=total_score,
            competency_scores=competency_models,
            examiner_alfa=alfa_result,
            examiner_beta=beta_result,
            discrepancy_report=disc_report,
            annotations=annotations,
            metrics=metrics,
            pedagogical_summary=mentor_summary,
            similar_benchmarks=similar_ids
        )
