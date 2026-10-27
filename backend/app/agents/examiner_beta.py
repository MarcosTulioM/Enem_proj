"""
Sub-Agent: Examinador Beta (Especialista em Tema, Repertório Sociocultural, Projeto de Texto e Intervenção - C2, C3 & C5).
Simula o segundo avaliador independente da banca do INEP.
"""
import re
from typing import Dict, Any, List
from app.schemas.models import ExaminerScore, TextMetrics, AnnotationSpan

REPERTOIRE_KEYWORDS = [
    "filósofo", "sociólogo", "constituição", "carta magna", "artigo",
    "bauman", "foucault", "habermas", "hobbes", "rousseau", "durkheim",
    "século", "história", "obra", "livro", "dignidade", "cidadão de papel",
    "machado de assis", "simone de beauvoir", "gilberto freyre", "quarto de despejo",
    "lévi-strauss", "claude lévi-strauss", "dimenstein"
]

class ExaminerBeta:
    def __init__(self):
        self.name = "Examinador Beta"
        self.focus = "Compreensão Temática (C2), Projeto de Texto (C3) e Proposta de Intervenção (C5)"

    def evaluate(self, text: str, theme: str, metrics: TextMetrics, annotations: List[AnnotationSpan]) -> ExaminerScore:
        t_lower = text.lower()
        theme_tokens = [w for w in re.findall(r"\b\w{4,}\b", theme.lower())]

        # 1. C2 Evaluation: Theme coverage & Repertoire
        theme_matches = sum(1 for w in theme_tokens if w in t_lower)
        repertoire_hits = sum(1 for kw in REPERTOIRE_KEYWORDS if kw in t_lower)

        if theme_matches == 0:
            c2_score = 40  # Tangenciamento severo
        elif metrics.total_paragraphs == 1:
            c2_score = 40  # Monobloco
        elif repertoire_hits >= 2 and metrics.total_paragraphs >= 4:
            c2_score = 200
        elif repertoire_hits >= 1 and metrics.total_paragraphs >= 3:
            c2_score = 160
        elif theme_matches >= len(theme_tokens) // 2:
            c2_score = 120
        else:
            c2_score = 80

        # 2. C3 Evaluation: Text project and argument development
        if metrics.total_paragraphs == 4 and metrics.total_sentences >= 8 and repertoire_hits >= 1 and metrics.total_words >= 240:
            c3_score = 200
        elif metrics.total_paragraphs >= 3 and metrics.total_words >= 200:
            c3_score = 160
        elif metrics.total_paragraphs >= 2:
            c3_score = 120
        else:
            c3_score = 40

        # 3. C5 Evaluation: Granular count of the 5 elements
        c5_elements = metrics.c5_elements_present
        elements_count = sum(1 for present in c5_elements.values() if present)
        c5_score = min(200, elements_count * 40)
        if c5_score == 0 and metrics.total_paragraphs >= 4:
            c5_score = 40

        # 4. C1 and C4 estimation from Beta's perspective
        c1_errors = [a for a in annotations if a.competency == "C1" and a.severity == "erro"]
        if len(c1_errors) == 0:
            c1_score = 200
        elif len(c1_errors) <= 3:
            c1_score = 160
        elif len(c1_errors) <= 5:
            c1_score = 120
        else:
            c1_score = 80

        c4_score = 200 if metrics.interparagraph_connectors_count >= 2 else (160 if metrics.interparagraph_connectors_count == 1 else 120)

        scores = {
            "C1": c1_score,
            "C2": c2_score,
            "C3": c3_score,
            "C4": c4_score,
            "C5": c5_score
        }
        total = sum(scores.values())

        rationale = (
            f"Avaliação da perspectiva temático-argumentativa: Localizados {repertoire_hits} repertórios socioculturais. "
            f"Cobertura temática validada ({theme_matches}/{len(theme_tokens)} termos centrais). "
            f"Proposta de intervenção identificou {elements_count}/5 elementos obrigatórios."
        )

        return ExaminerScore(
            examiner_name=self.name,
            focus=self.focus,
            scores=scores,
            total=total,
            rationale=rationale
        )
