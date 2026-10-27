"""
Sub-Agent: Examinador Alfa (Especialista em Norma Culta e Mecanismos Coesivos - C1 & C4).
Simula o primeiro avaliador oficial da banca do INEP.
"""
from typing import Dict, Any, List
from app.schemas.models import ExaminerScore, TextMetrics, AnnotationSpan

class ExaminerAlfa:
    def __init__(self):
        self.name = "Examinador Alfa"
        self.focus = "Norma Culta da Língua Escrita (C1) e Mecanismos de Coesão (C4)"

    def evaluate(self, text: str, metrics: TextMetrics, annotations: List[AnnotationSpan]) -> ExaminerScore:
        # C1 evaluation based on detected deviations
        c1_errors = [a for a in annotations if a.competency == "C1" and a.severity == "erro"]
        if len(c1_errors) == 0:
            c1_score = 200
        elif len(c1_errors) <= 2:
            c1_score = 160
        elif len(c1_errors) <= 4:
            c1_score = 120
        elif len(c1_errors) <= 7:
            c1_score = 80
        else:
            c1_score = 40

        # C4 evaluation based on interparagraph and intraparagraph operators
        if metrics.interparagraph_connectors_count >= 2 and metrics.type_token_ratio >= 0.45:
            c4_score = 200
        elif metrics.interparagraph_connectors_count >= 1:
            c4_score = 160
        elif metrics.interparagraph_connectors_count == 0 and metrics.total_paragraphs >= 3:
            c4_score = 120
        elif metrics.total_paragraphs <= 2:
            c4_score = 80
        else:
            c4_score = 120

        # Structural C2/C3 estimation from Examiner Alfa's perspective
        if metrics.total_paragraphs == 4 and metrics.total_words >= 240:
            c2_score = 200
            c3_score = 200
        elif metrics.total_paragraphs >= 3 and metrics.total_words >= 200:
            c2_score = 160
            c3_score = 160
        elif metrics.total_paragraphs == 1:
            c2_score = 80
            c3_score = 40
        else:
            c2_score = 120
            c3_score = 120

        # C5 estimation from Examiner Alfa
        present_count = sum(1 for v in metrics.c5_elements_present.values() if v)
        c5_score = min(200, present_count * 40)
        if c5_score == 0 and metrics.total_paragraphs >= 4:
            c5_score = 40

        scores = {
            "C1": c1_score,
            "C2": c2_score,
            "C3": c3_score,
            "C4": c4_score,
            "C5": c5_score
        }
        total = sum(scores.values())

        rationale = (
            f"Avaliação da perspectiva linguística: Identificados {len(c1_errors)} desvios gramaticais em C1. "
            f"Presença de {metrics.interparagraph_connectors_count} conectivos interparágrafos em C4. "
            f"Vocabulário com índice de riqueza lexical TTR={metrics.type_token_ratio:.2f}."
        )

        return ExaminerScore(
            examiner_name=self.name,
            focus=self.focus,
            scores=scores,
            total=total,
            rationale=rationale
        )
