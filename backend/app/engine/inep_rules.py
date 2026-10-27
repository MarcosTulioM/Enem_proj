"""
Official INEP Rules, Discrepancy Engine, and Grading Thresholds.
Faithfully models the double-examiner board and third-reader arbitration protocols.
"""
from typing import Dict, Tuple, List, Optional
from app.schemas.models import CompetencyScore, DiscrepancyReport, ExaminerScore

INEP_DESCRIPTORS = {
    "C1": {
        0: "Desconhecimento da modalidade escrita formal da língua portuguesa.",
        40: "Domínio precário da modalidade escrita formal, com desvios gramaticais sistemáticos e diversificados.",
        80: "Domínio insuficiente da modalidade escrita formal, com muitos desvios gramaticais e de convenções da escrita.",
        120: "Domínio mediano da modalidade escrita formal, com desvios gramaticais pontuais e vocabulário simples.",
        160: "Bom domínio da modalidade escrita formal e de convenções da escrita, com poucos desvios gramaticais.",
        200: "Excelente domínio da modalidade escrita formal, com no máximo dois desvios gramaticais leves tolerados."
    },
    "C2": {
        0: "Fuga total ao tema ou não atendimento à estrutura dissertativo-argumentativa.",
        40: "Tangenciamento do tema ou traços constantes de outros tipos textuais.",
        80: "Abordagem completa do tema, mas com repertório baseado apenas nos textos motivadores ou sem repertório legitimado.",
        120: "Repertório legitimado, mas não pertinente ao tema, ou pertinente porém improdutivo na argumentação.",
        160: "Repertório legitimado e pertinente ao tema, com desenvolvimento produtivo razoável.",
        200: "Repertório legitimado, pertinente e produtivo, com excelente desenvolvimento do tema e perfeita dissertação."
    },
    "C3": {
        0: "Informações e argumentos desconexos, sem defesa de um ponto de vista.",
        40: "Defesa de ponto de vista com argumentos inconsistentes ou contraditórios.",
        80: "Projeto de texto com falhas visíveis, informações limitadas aos textos de apoio e lacunas argumentativas.",
        120: "Projeto de texto com algumas falhas, apresentando argumentos pertinentes mas com desenvolvimento superficial.",
        160: "Projeto de texto estratégico com poucos desvios, com autoria e boa fundamentação das teses.",
        200: "Projeto de texto estratégico, consistente e com autoria consolidada, sem quaisquer lacunas argumentativas."
    },
    "C4": {
        0: "Ausência total de mecanismos de coesão ou frases desconexas.",
        40: "Coesão precária, com inadequações graves e repetições excessivas de vocábulos.",
        80: "Uso insuficiente de recursos coesivos, com muitas repetições e poucos conectivos interparágrafos.",
        120: "Uso mediano de recursos coesivos, com algumas repetições e presença tímida de operadores argumentativos.",
        160: "Uso diversificado de operadores argumentativos, com poucos desvios e presença regular de coesão interparágrafos.",
        200: "Uso expressivo e diversificado de recursos coesivos inter e intraparágrafos, sem repetições viciosas."
    },
    "C5": {
        0: "Ausência de proposta de intervenção, proposta desconexa ou violação explícita aos Direitos Humanos.",
        40: "Presença de apenas 1 elemento válido da proposta de intervenção.",
        80: "Presença de 2 elementos válidos da proposta de intervenção.",
        120: "Presença de 3 elementos válidos da proposta de intervenção.",
        160: "Presença de 4 elementos válidos da proposta de intervenção (geralmente sem detalhamento).",
        200: "Proposta de intervenção completa com os 5 elementos válidos (Agente, Ação, Meio, Efeito e Detalhamento)."
    }
}

COMPETENCY_NAMES = {
    "C1": "Domínio da Norma Culta da Língua Portuguesa",
    "C2": "Compreensão da Proposta e Repertório Sociocultural",
    "C3": "Projeto de Texto e Consistência Argumentativa",
    "C4": "Mecanismos Linguísticos de Coesão",
    "C5": "Proposta de Intervenção Social e Cidadã"
}

VIOLATION_TERMS = [
    "tortura", "pena de morte", "linchamento", "fazer justiça com as próprias mãos",
    "eliminar os bandidos", "extermínio", "limpeza social", "privar de direitos básicos"
]


class INEPDiscrepancyEngine:
    @staticmethod
    def check_human_rights_violation(text: str) -> bool:
        t = text.lower()
        return any(term in t for term in VIOLATION_TERMS)

    @staticmethod
    def evaluate_discrepancy(
        alfa_scores: Dict[str, int],
        beta_scores: Dict[str, int]
    ) -> Tuple[bool, List[str], int]:
        discrepant_comps = []
        for comp in ["C1", "C2", "C3", "C4", "C5"]:
            diff = abs(alfa_scores.get(comp, 0) - beta_scores.get(comp, 0))
            if diff > 80:
                discrepant_comps.append(comp)

        total_alfa = sum(alfa_scores.get(comp, 0) for comp in ["C1", "C2", "C3", "C4", "C5"])
        total_beta = sum(beta_scores.get(comp, 0) for comp in ["C1", "C2", "C3", "C4", "C5"])
        total_diff = abs(total_alfa - total_beta)

        has_discrepancy = len(discrepant_comps) > 0 or total_diff > 100
        return has_discrepancy, discrepant_comps, total_diff

    @staticmethod
    def calculate_final_scores(
        alfa_scores: Dict[str, int],
        beta_scores: Dict[str, int],
        auditor_scores: Optional[Dict[str, int]] = None,
        violates_human_rights: bool = False
    ) -> Tuple[Dict[str, int], DiscrepancyReport]:
        has_disc, disc_comps, total_diff = INEPDiscrepancyEngine.evaluate_discrepancy(alfa_scores, beta_scores)
        final_scores: Dict[str, int] = {}

        if has_disc and auditor_scores:
            for comp in ["C1", "C2", "C3", "C4", "C5"]:
                final_scores[comp] = auditor_scores.get(comp, int(round((alfa_scores[comp] + beta_scores[comp]) / 2.0)))
            report = DiscrepancyReport(
                has_discrepancy=True,
                discrepant_competencies=disc_comps,
                total_diff=total_diff,
                auditor_intervened=True,
                final_decision_summary=f"Discrepância detectada ({', '.join(disc_comps)} ou diff total {total_diff} pts). O Supervisor da Banca realizou a 3ª leitura soberana."
            )
        else:
            for comp in ["C1", "C2", "C3", "C4", "C5"]:
                # Official INEP arithmetic mean
                avg = (alfa_scores.get(comp, 0) + beta_scores.get(comp, 0)) / 2.0
                final_scores[comp] = int(round(avg))
            report = DiscrepancyReport(
                has_discrepancy=False,
                discrepant_competencies=[],
                total_diff=total_diff,
                auditor_intervened=False,
                final_decision_summary=f"Concordância plena entre Examinadores Alfa e Beta (Diferença de {total_diff} pts dentro da margem oficial). Média aritmética INEP aplicada."
            )

        if violates_human_rights:
            final_scores["C5"] = 0
            report.final_decision_summary += " ALERTA: Competência 5 zerada por violação explícita aos Direitos Humanos."

        return final_scores, report

    @staticmethod
    def build_competency_score_models(final_scores: Dict[str, int]) -> Dict[str, CompetencyScore]:
        result = {}
        for comp in ["C1", "C2", "C3", "C4", "C5"]:
            score = final_scores.get(comp, 120)
            level = min(5, score // 40)
            # Find closest descriptor key (0, 40, 80, 120, 160, 200)
            descriptor_key = min([0, 40, 80, 120, 160, 200], key=lambda x: abs(x - score))
            desc = INEP_DESCRIPTORS[comp].get(descriptor_key, "Nível avaliado segundo critérios do INEP.")
            strengths = []
            improvements = []
            
            if score >= 160:
                strengths.append(f"Excelente pontuação em {comp} ({score}/200).")
            else:
                improvements.append(f"Oportunidade de elevar {comp} de {score} para 200 pontos.")

            result[comp] = CompetencyScore(
                competency=comp,
                name=COMPETENCY_NAMES[comp],
                score=score,
                level=level,
                description=desc,
                strengths=strengths,
                improvements=improvements,
                evidence=[]
            )
        return result
