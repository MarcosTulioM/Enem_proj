"""
Deterministic NLP Engine for ENEM Essay Evaluation.
Computes text metrics, lexical richness (TTR), C4 connector audits,
C5 intervention element extraction, and exact character offset mapping.
"""
import re
from typing import List, Dict, Tuple, Optional, Any
from app.schemas.models import RangeOffset, AnnotationSpan, TextMetrics

# Interparagraph Connectors recognized by INEP evaluators
INTER_CONNECTORS_P2 = [
    "em primeira análise", "em primeiro plano", "nesse contexto", "nesse viés",
    "sob essa perspectiva", "sob esse prisma", "de início", "a princípio",
    "primeiramente", "como ponto de partida", "em princípio"
]

INTER_CONNECTORS_P3 = [
    "ademais", "outrossim", "além disso", "paralelamente a isso",
    "outro ponto fulcral", "de outra parte", "sob outra ótica",
    "por outro lado", "igualmente", "em adição", "somado a isso"
]

INTER_CONNECTORS_P4 = [
    "portanto", "desse modo", "por conseguinte", "assim", "logo",
    "infere-se, logo, que", "torna-se imperioso, portanto", "conclui-se que",
    "em suma", "diante dos fatos expostos", "à vista disso"
]

INTRA_CONNECTORS = [
    "com efeito", "haja vista que", "visto que", "uma vez que", "já que",
    "contudo", "no entanto", "entretanto", "todavia", "não obstante",
    "nesse sentido", "sob essa ótica", "por conseguinte", "dessa forma",
    "por sua vez", "embora", "ainda que", "mesmo que", "conquanto",
    "ao passo que", "à medida que", "tanto quanto", "assim como"
]

COMMON_COLLOQUIALISMS = [
    ("pra", "para"),
    ("pra ir", "para ir"),
    ("muito legal", "significativo ou relevante"),
    ("coisa", "elemento, aspecto ou fator"),
    ("olho da cara", "custo desproporcional"),
    ("todo mundo", "a totalidade dos cidadãos ou o corpo social"),
    ("hoje em dia", "na contemporaneidade"),
    ("tem que", "é imperativo que ou deve-se"),
    ("tipo assim", "a saber ou como exemplo"),
    ("bastante gente", "parcela expressiva da população"),
]


class NLPEngine:
    def __init__(self):
        pass

    def compute_metrics(self, text: str) -> TextMetrics:
        paragraphs = [p.strip() for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [p.strip() for p in text.split("\n") if p.strip()]
        
        words = re.findall(r"\b[\w'-]+\b", text.lower())
        total_words = len(words)
        
        raw_sentences = re.split(r"[.!?]+", text)
        sentences = [s.strip() for s in raw_sentences if len(s.strip()) > 3]
        total_sentences = len(sentences) if sentences else 1
        
        unique_words = set(words)
        ttr = round(len(unique_words) / total_words, 4) if total_words > 0 else 0.0
        
        inter_found = []
        for i, p in enumerate(paragraphs[1:], start=2):
            p_start = p[:60].lower()
            if i == 2 and any(c in p_start for c in INTER_CONNECTORS_P2):
                inter_found.append(f"Parágrafo 2: {p[:30]}...")
            elif i == 3 and any(c in p_start for c in INTER_CONNECTORS_P3):
                inter_found.append(f"Parágrafo 3: {p[:30]}...")
            elif i >= 4 and any(c in p_start for c in INTER_CONNECTORS_P4):
                inter_found.append(f"Parágrafo 4: {p[:30]}...")

        c5_elements = self._check_c5_presence(paragraphs[-1] if paragraphs else text)

        return TextMetrics(
            total_words=total_words,
            total_paragraphs=len(paragraphs),
            total_sentences=total_sentences,
            avg_words_per_sentence=round(total_words / total_sentences, 1) if total_sentences else 0.0,
            avg_words_per_paragraph=round(total_words / len(paragraphs), 1) if paragraphs else 0.0,
            type_token_ratio=ttr,
            interparagraph_connectors_count=len(inter_found),
            interparagraph_connectors_found=inter_found,
            c5_elements_present=c5_elements
        )

    def extract_annotations(self, text: str) -> List[AnnotationSpan]:
        annotations: List[AnnotationSpan] = []
        paragraphs = [p for p in text.split("\n\n") if p.strip()]
        if not paragraphs:
            paragraphs = [p for p in text.split("\n") if p.strip()]

        current_offset = 0

        for p_idx, p_text in enumerate(paragraphs, start=1):
            p_start = text.find(p_text, current_offset)
            if p_start == -1:
                p_start = current_offset
            p_end = p_start + len(p_text)
            current_offset = p_end

            # 1. Competência 1: Colloquialisms
            for bad_word, suggestion in COMMON_COLLOQUIALISMS:
                pattern = rf"\b{re.escape(bad_word)}\b"
                for match in re.finditer(pattern, p_text, flags=re.IGNORECASE):
                    start = p_start + match.start()
                    end = p_start + match.end()
                    annotations.append(AnnotationSpan(
                        id=f"ann-c1-colloquial-{start}",
                        competency="C1",
                        severity="erro",
                        range=RangeOffset(start=start, end=end, paragraph=p_idx),
                        original_text=match.group(0),
                        title="Marca de Coloquialismo / Oralidade",
                        description=f"A expressão '{match.group(0)}' pertence à linguagem oral informal e fere a norma culta do ENEM.",
                        layperson_tip="Substitua gírias e expressões do dia a dia por palavras mais formais e acadêmicas.",
                        suggested_fix=suggestion,
                        benchmark_comparison="Em redações Nota 1000, o registro linguístico é estritamente formal e denotativo."
                    ))

            # 2. Competência 1: Comma between subject and predicate
            comma_subj_pattern = r"\b(o|a|os|as)\s+([A-Za-zÀ-ÿ\s]{2,45}?),\s+(perpetuam|perpetua|corroboram|corrobora|revelam|revela|obstaculizam|obstaculiza|impedem|impede|promovem|promove|geram|gera|acarretam|acarreta|trazem|traz)\b"
            for match in re.finditer(comma_subj_pattern, p_text, flags=re.IGNORECASE):
                start = p_start + match.start()
                end = p_start + match.end()
                wrong_str = match.group(0)
                fixed_str = wrong_str.replace(",", "")
                annotations.append(AnnotationSpan(
                    id=f"ann-c1-comma-subj-{start}",
                    competency="C1",
                    severity="erro",
                    range=RangeOffset(start=start, end=end, paragraph=p_idx),
                    original_text=wrong_str,
                    title="Vírgula proibida entre Sujeito e Predicado",
                    description="É proibido separar o sujeito do verbo por vírgula em língua portuguesa.",
                    layperson_tip="Não coloque vírgula entre quem realiza a ação e a própria ação da frase.",
                    suggested_fix=fixed_str,
                    benchmark_comparison="Desvio grave que impede atingir a pontuação máxima de 200 pontos na Competência 1."
                ))

            # 3. Competência 4: Interparagraph Connectors Check
            if len(paragraphs) >= 3:
                if p_idx == 2:
                    has_conn = any(c in p_text[:60].lower() for c in INTER_CONNECTORS_P2)
                    if not has_conn:
                        annotations.append(AnnotationSpan(
                            id=f"ann-c4-missing-conn-d1-{p_start}",
                            competency="C4",
                            severity="atencao",
                            range=RangeOffset(start=p_start, end=min(p_start + 40, p_end), paragraph=2),
                            original_text=p_text[:40],
                            title="Ausência de Conectivo Interparágrafo em D1",
                            description="O segundo parágrafo deve ser iniciado com operador argumentativo interparágrafo.",
                            layperson_tip="Inicie seu 2º parágrafo com expressões de ligação como 'Em primeira análise,' ou 'Nesse contexto,'.",
                            suggested_fix=f"Em primeira análise, {p_text[:40].lower()}",
                            benchmark_comparison="Toda redação Nota 1000 do ENEM inicia o desenvolvimento com operador argumentativo interparágrafo."
                        ))
                elif p_idx == 3:
                    has_conn = any(c in p_text[:60].lower() for c in INTER_CONNECTORS_P3)
                    if not has_conn:
                        annotations.append(AnnotationSpan(
                            id=f"ann-c4-missing-conn-d2-{p_start}",
                            competency="C4",
                            severity="atencao",
                            range=RangeOffset(start=p_start, end=min(p_start + 40, p_end), paragraph=3),
                            original_text=p_text[:40],
                            title="Ausência de Conectivo Interparágrafo em D2",
                            description="O terceiro parágrafo deve conter operador coesivo demonstrando continuidade argumentativa.",
                            layperson_tip="Inicie seu 3º parágrafo com conectivos de soma como 'Ademais,' ou 'Outrossim,'.",
                            suggested_fix=f"Ademais, {p_text[:40].lower()}",
                            benchmark_comparison="O INEP exige pelo menos dois conectivos interparágrafos expressivos para nota máxima na C4."
                        ))
                elif p_idx == len(paragraphs) and len(paragraphs) >= 4:
                    has_conn = any(c in p_text[:60].lower() for c in INTER_CONNECTORS_P4)
                    if not has_conn:
                        annotations.append(AnnotationSpan(
                            id=f"ann-c4-missing-conn-c5-{p_start}",
                            competency="C4",
                            severity="atencao",
                            range=RangeOffset(start=p_start, end=min(p_start + 40, p_end), paragraph=p_idx),
                            original_text=p_text[:40],
                            title="Ausência de Conectivo Conclusivo na Intervenção",
                            description="A conclusão deve ser introduzida por operador argumentativo de valor conclusivo.",
                            layperson_tip="Abra seu parágrafo final com 'Portanto,' ou 'Desse modo,'.",
                            suggested_fix=f"Portanto, medidas são necessárias para {p_text[:40].lower()}",
                            benchmark_comparison="Redações nota 1000 sempre iniciam a conclusão com conjunção conclusiva."
                        ))

            # 4. Competência 5: Full Elements Audit in Conclusion / Last Paragraph
            if p_idx == len(paragraphs):
                c5_annotations = self._audit_c5_elements(p_text, p_start, p_idx)
                annotations.extend(c5_annotations)

        # 5. Competência 2 / 3: Monobloco check (only 1 paragraph)
        if len(paragraphs) == 1 and len(text) > 200:
            annotations.append(AnnotationSpan(
                id="ann-c2-monobloco",
                competency="C2",
                severity="erro",
                range=RangeOffset(start=0, end=min(80, len(text)), paragraph=1),
                original_text=text[:80],
                title="Texto em Monobloco (Falta de Paragrafação)",
                description="O texto foi escrito em um único bloco. O ENEM exige a estrutura clássica de 4 parágrafos (Introdução, D1, D2 e Conclusão).",
                layperson_tip="Separe seu texto em 4 partes bem divididas: 1 de introdução, 2 de desenvolvimento e 1 de conclusão.",
                suggested_fix=None,
                benchmark_comparison="O texto em monobloco é severamente penalizado na Competência 2 e 3 da banca do INEP."
            ))

        return annotations

    def _check_c5_presence(self, conclusion_text: str) -> Dict[str, bool]:
        t = conclusion_text.lower()
        has_agent = bool(re.search(r"\b(cabe ao|cabe à|cabe a|compete ao|compete à|compete a|o ministério|o governo|a sociedade|as escolas|o poder público|a família)\b", t))
        has_action = bool(re.search(r"\b(criar|instituir|promover|desenvolver|elaborar|fiscalizar|implementar|combater|garantir)\b", t))
        has_medium = bool(re.search(r"\b(por meio d[eao]s?|por intermédio d[eao]s?|mediante|através d[eao]s?|com a criação d[eao]s?|por intermedio d[eao]s?)\b", t))
        has_effect = bool(re.search(r"\b(a fim de|com o fito de|com o objetivo de|com o intuito de|para que|com o propósito de|com a finalidade de)\b", t))
        has_detail = bool(re.search(r",\s*(órgão responsável|orgao responsavel|pasta incumbida|instância máxima|especificamente|como forma de|a exemplo de)[^,]+,", t))
        return {
            "agente": has_agent,
            "acao": has_action,
            "meio": has_medium,
            "efeito": has_effect,
            "detalhamento": has_detail
        }

    def _audit_c5_elements(self, p_text: str, p_start: int, p_idx: int) -> List[AnnotationSpan]:
        ann = []
        checks = self._check_c5_presence(p_text)

        # Praise elements present
        if checks["agente"]:
            m = re.search(r"\b(cabe ao|cabe à|cabe a|compete ao|compete à|o ministério|o governo|a sociedade|as escolas)[^,\.]+", p_text, flags=re.IGNORECASE)
            if m:
                s, e = p_start + m.start(), p_start + m.end()
                ann.append(AnnotationSpan(
                    id=f"ann-c5-praise-agent-{s}",
                    competency="C5",
                    severity="elogio",
                    range=RangeOffset(start=s, end=e, paragraph=p_idx),
                    original_text=m.group(0),
                    title="Elemento Identificado: Agente (Comp. 5)",
                    description="Agente executor da proposta claramente especificado.",
                    layperson_tip="Excelente! Você indicou QUEM deve agir para resolver o problema.",
                    suggested_fix=None,
                    benchmark_comparison="O agente bem determinado garante os primeiros 40 pontos da Competência 5."
                ))
        else:
            ann.append(AnnotationSpan(
                id=f"ann-c5-missing-agent-{p_start}",
                competency="C5",
                severity="erro",
                range=RangeOffset(start=p_start, end=min(p_start + 60, p_start + len(p_text)), paragraph=p_idx),
                original_text=p_text[:60],
                title="Elemento Ausente: Agente Específico (Comp. 5)",
                description="Não foi localizado um agente executor formal (ex: Ministério, Governo Federal, Poder Legislativo).",
                layperson_tip="Diga claramente quem deve agir. Exemplo: 'Cabe ao Ministério da Educação...'",
                suggested_fix="Cabe ao Governo Federal, em conjunto com os Ministérios competentes,",
                benchmark_comparison="Cada elemento faltante na proposta de intervenção desconta 40 pontos na nota oficial."
            ))

        if not checks["meio"]:
            ann.append(AnnotationSpan(
                id=f"ann-c5-missing-medium-{p_start}",
                competency="C5",
                severity="erro",
                range=RangeOffset(start=p_start, end=min(p_start + 80, p_start + len(p_text)), paragraph=p_idx),
                original_text=p_text[:80],
                title="Elemento Ausente: Modo / Meio (Comp. 5)",
                description="A proposta não detalha COMO a ação será posta em prática.",
                layperson_tip="Explique o meio ou método usando 'por meio de...' ou 'mediante...'.",
                suggested_fix="por intermédio do direcionamento prioritário de verbas orçamentárias e capacitação profissional,",
                benchmark_comparison="O meio/modo é requisito obrigatório na cartilha do corretor do INEP."
            ))

        if not checks["detalhamento"]:
            ann.append(AnnotationSpan(
                id=f"ann-c5-missing-detail-{p_start}",
                competency="C5",
                severity="atencao",
                range=RangeOffset(start=p_start, end=min(p_start + 70, p_start + len(p_text)), paragraph=p_idx),
                original_text=p_text[:70],
                title="Elemento Ausente: Detalhamento (Comp. 5)",
                description="Faltou detalhar um dos 4 elementos da proposta (explicar a função do agente ou exemplificar o meio).",
                layperson_tip="Acrescente uma explicação entre vírgulas para o agente ou para o meio. Ex: 'Ministério da Saúde, pasta responsável pela política pública preventiva...'",
                suggested_fix="órgão responsável pela formulação das políticas de proteção coletiva,",
                benchmark_comparison="A falta de detalhamento é a causa mais comum de redações ficarem com 160 pontos na C5."
            ))

        return ann
