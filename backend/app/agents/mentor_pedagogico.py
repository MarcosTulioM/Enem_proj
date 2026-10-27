"""
Sub-Agent: Mentor Pedagógico & Guia para Leigos.
Converte a frieza dos números e dos relatórios da banca em orientações acolhedoras,
práticas e em linguagem humana acessível para qualquer pessoa.
"""
from typing import Dict, List, Any
from app.schemas.models import (
    CompetencyScore,
    PedagogicalMentorSummary,
    AnnotationSpan,
    TextMetrics
)

class MentorPedagogico:
    def __init__(self):
        self.name = "Mentor Pedagógico"

    def synthesize(
        self,
        total_score: int,
        competency_scores: Dict[str, CompetencyScore],
        annotations: List[AnnotationSpan],
        metrics: TextMetrics,
        similar_benchmark_themes: List[str]
    ) -> PedagogicalMentorSummary:
        # Determine greatest strength and primary focus area
        sorted_comps = sorted(competency_scores.items(), key=lambda x: x[1].score, reverse=True)
        best_comp_id, best_comp = sorted_comps[0]
        worst_comp_id, worst_comp = sorted_comps[-1]

        # Greeting according to score tier
        if total_score >= 960:
            greeting = "Impressionante! Sua redação está no nível de excelência máxima da prova do ENEM."
            verdict = "Seu texto tem a maturidade, a consistência e o brilho dos textos publicados pelo INEP na Cartilha Nota 1000."
        elif total_score >= 880:
            greeting = "Parabéns! Você alcançou uma pontuação muito competitiva, acima do corte das melhores universidades públicas."
            verdict = "Com apenas pequenos ajustes pontuais na norma culta ou no detalhamento da conclusão, você chega aos 1000 pontos."
        elif total_score >= 700:
            greeting = "Muito bom trabalho! Sua base de redação é sólida e você já domina a estrutura fundamental do texto."
            verdict = "Você tem ótimas ideias. O segredo agora é organizar melhor as palavras de ligação e aprofundar os exemplos."
        else:
            greeting = "Bem-vindo! Todo grande escritor começa pelo rascunho, e você já deu o passo mais importante: colocar suas ideias no papel."
            verdict = "Identificamos pontos fáceis onde você pode ganhar muitos pontos rapidamente seguindo a estrutura do ENEM."

        # Practical action plan in clear Portuguese
        action_plan = []
        if worst_comp_id == "C1":
            action_plan.append("Revise com atenção as vírgulas e a concordância verbal das frases antes de finalizar.")
        elif worst_comp_id == "C2":
            action_plan.append("Adicione uma citação de um pensador, livro ou artigo da Constituição que tenha relação direta com o tema.")
        elif worst_comp_id == "C3":
            action_plan.append("Na introdução, anuncie claramente dois problemas; depois, explique um no parágrafo 2 e o outro no parágrafo 3.")
        elif worst_comp_id == "C4":
            action_plan.append("Comece o 2º, 3º e 4º parágrafos com palavras de conexão como 'Em primeira análise,', 'Ademais,' e 'Portanto,'.")
        elif worst_comp_id == "C5":
            action_plan.append("Na conclusão, responda às 5 perguntinhas: Quem faz? O que faz? Como faz? Para que faz? E dê um detalhe extra.")

        action_plan.append(f"Explore a redação nota 1000 sobre '{similar_benchmark_themes[0] if similar_benchmark_themes else 'o tema'}' no Explorador Raio-X para ver na prática como estruturar o parágrafo.")
        action_plan.append("Clique no botão 'Aplicar Correção' nos cartões destacados do seu texto para ver a frase melhorada instantaneamente.")

        return PedagogicalMentorSummary(
            greeting=greeting,
            overall_verdict=verdict,
            greatest_strength=f"{best_comp.name} ({best_comp.score}/200): Você demonstrou forte segurança neste critério.",
            primary_focus_area=f"{worst_comp.name} ({worst_comp.score}/200): Focando aqui, você tem potencial imediato de subir sua nota.",
            suggested_action_plan=action_plan,
            inspirational_quote="'A escrita não é fruto de mágica, mas de técnica e persistência.' — Boa prática rumo à nota 1000!"
        )
