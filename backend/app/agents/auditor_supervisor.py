"""
Sub-Agent: Auditor / Supervisor da Banca INEP.
Intervém como 3º avaliador soberano em caso de discrepância oficial (>80 pts em competência ou >100 pts no total).
"""
from typing import Dict, Any, List
from app.schemas.models import ExaminerScore, TextMetrics, AnnotationSpan

class AuditorSupervisor:
    def __init__(self):
        self.name = "Supervisor da Banca INEP"
        self.focus = "Resolução de Discrepâncias e Arbitragem Soberana"

    def arbitrate(
        self,
        alfa_scores: Dict[str, int],
        beta_scores: Dict[str, int],
        discrepant_competencies: List[str],
        metrics: TextMetrics,
        annotations: List[AnnotationSpan]
    ) -> Dict[str, int]:
        resolved_scores: Dict[str, int] = {}

        for comp in ["C1", "C2", "C3", "C4", "C5"]:
            score_a = alfa_scores.get(comp, 120)
            score_b = beta_scores.get(comp, 120)

            if comp in discrepant_competencies:
                # Rigorous mediation based on objective evidence
                if comp == "C1":
                    c1_errors = len([a for a in annotations if a.competency == "C1" and a.severity == "erro"])
                    if c1_errors == 0:
                        resolved_scores[comp] = 200
                    elif c1_errors <= 2:
                        resolved_scores[comp] = 160
                    elif c1_errors <= 4:
                        resolved_scores[comp] = 120
                    else:
                        resolved_scores[comp] = 80
                elif comp == "C4":
                    if metrics.interparagraph_connectors_count >= 2:
                        resolved_scores[comp] = 200
                    elif metrics.interparagraph_connectors_count == 1:
                        resolved_scores[comp] = 160
                    else:
                        resolved_scores[comp] = 120
                elif comp == "C5":
                    present = sum(1 for v in metrics.c5_elements_present.values() if v)
                    resolved_scores[comp] = min(200, present * 40)
                else:
                    # C2 or C3: choose median rounded to 40
                    mid = (score_a + score_b) / 2.0
                    resolved_scores[comp] = int(round(mid / 40.0) * 40)
            else:
                # No discrepancy in this competency, calculate official mean
                mid = (score_a + score_b) / 2.0
                resolved_scores[comp] = int(round(mid / 40.0) * 40)

        return resolved_scores
