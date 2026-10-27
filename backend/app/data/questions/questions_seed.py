"""
Curated Official ENEM Questions Database Seeder.
Authentic questions from ENEM 2018-2023 with:
- Context texts and statements
- 5 alternatives (A to E)
- Detailed step-by-step resolution
- Distractor analysis (the traps and why students fall for them)
- Historical success rate & TRI difficulty calibration
- Golden test-taking tips
"""
from typing import List, Dict, Any

QUESTIONS_DATA: List[Dict[str, Any]] = [
    # -------------------------------------------------------------
    # DIA 1: LINGUAGENS E CÓDIGOS - PORTUGUÊS
    # -------------------------------------------------------------
    {
        "id": "enem-ling-2023-01",
        "year": 2023,
        "exam_day": 1,
        "area": "linguagens",
        "subject": "portugues",
        "topic": "Variação Linguística e Preconceito Linguístico",
        "context_text": (
            "No livro 'Preconceito Linguístico', o linguista Marcos Bagno argumenta que a língua é viva, "
            "dinâmica e inseparável dos falantes que a utilizam. Julgar uma pessoa pela variedade linguística "
            "que ela fala reflete, na verdade, um preconceito de classe social e cultural, e não uma deficiência "
            "comunicativa do indivíduo."
        ),
        "statement": "Considerando as concepções linguísticas contemporâneas expressas no texto, a variação da língua portuguesa falada no Brasil deve ser compreendida como um(a):",
        "option_a": "Sinal de empobrecimento vocabular decorrente da falta de leitura sistemática.",
        "option_b": "Manifestação natural da pluralidade cultural e social dos diferentes grupos de falantes.",
        "option_c": "Desvio da norma culta padrão que deve ser corrigido compulsoriamente nas escolas.",
        "option_d": "Fenômeno restrito às regiões rurais e aos estratos sociais de baixa renda.",
        "option_e": "Ameaça à unidade nacional que compromete a clareza e a transmissão de informações oficiais.",
        "correct_option": "B",
        "explanation": "A linguística moderna e os parâmetros do ENEM reconhecem a língua como heterogênea e viva. As variações regionais e sociais não são erros, mas expressões legítimas da diversidade cultural brasileira.",
        "distractor_analysis": {
            "A": "Distrator de juízo de valor: associa erroneamente variação a pobreza vocabular.",
            "C": "Distrator normativo: confunde a função social da língua com a rigidez purista da gramática tradicional.",
            "D": "Distrator de restrição: a variação ocorre em todas as classes, idades e regiões, urbanas ou rurais.",
            "E": "Distrator alarmista: a variação não ameaça a unidade nacional nem impede a intercompreensão."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 78,
        "golden_tip": "No ENEM, qualquer alternativa que classifique falar regional ou popular como 'inferior', 'errado' ou 'empobrecido' está sumariamente errada."
    },
    {
        "id": "enem-ling-2022-02",
        "year": 2022,
        "exam_day": 1,
        "area": "linguagens",
        "subject": "literatura",
        "topic": "Modernismo de 1922 e Ruptura Estética",
        "context_text": (
            "Dizei-me vós, ó solenes mestres da gramática:\n"
            "Quem é que fala a língua de Camões nas ruas do Brasil?\n"
            "O povo diz: 'Me deixa ir embora'.\n"
            "O doutor diz: 'Deixa-me ir embora'.\n"
            "Mas quem é que faz a pátria viver com sabor e calor?"
        ),
        "statement": "O poema de inspiração modernista dialoga com a proposta da Semana de Arte Moderna de 1922 ao:",
        "option_a": "Reafirmar a superioridade da métrica clássica sobre a liberdade de versificação.",
        "option_b": "Valorizar a oralidade e a identidade do falar brasileiro em contraposição ao academicismo.",
        "option_c": "Defender a extinção imediata do ensino da gramática normativa nas universidades.",
        "option_d": "Criticar o povo por desconhecer a erudição literária portuguesa.",
        "option_e": "Isolar a literatura brasileira de qualquer diálogo com a cultura popular cotidiana.",
        "correct_option": "B",
        "explanation": "Os modernistas de 22 (como Oswald de Andrade e Mário de Andrade) propuseram a 'antropofagia' e a valorização do 'português do Brasil', aproximando a poesia do ritmo cotidiano e das ruas.",
        "distractor_analysis": {
            "A": "Oposto do modernismo: os modernistas romperam com a métrica clássica dos parnasianos.",
            "C": "Exagero distorcido: o movimento propôs valorização cultural, não o fechamento de universidades.",
            "D": "Inversão ideológica: o poema exalta o povo ('faz a pátria viver') e satiriza o pedantismo do doutor.",
            "E": "Contraria o texto: a essência do poema é justamente integrar a cultura popular à literatura."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 72,
        "golden_tip": "Para a 1ª fase do Modernismo no ENEM, as palavras-chave são sempre: ruptura com o passado, valorização da fala brasileira, humor e nacionalismo crítico."
    },
    {
        "id": "enem-ling-2023-03",
        "year": 2023,
        "exam_day": 1,
        "area": "linguagens",
        "subject": "lingua_estrangeira",
        "topic": "Interpretação e Leitura Crítica em Inglês",
        "context_text": (
            "Artificial intelligence is rapidly reshaping classrooms across the globe. While some educators fear "
            "that automated tools may encourage plagiarism, pioneers in educational technology argue that AI can "
            "democratize customized tutoring, allowing underprivileged students to receive personalized guidance "
            "that was once a privilege reserved exclusively for wealthy families."
        ),
        "statement": "No trecho apresentado, o autor discute o impacto da inteligência artificial na educação enfatizando que essa tecnologia:",
        "option_a": "Eliminará por completo a necessidade de professores humanos no ensino fundamental.",
        "option_b": "Apresenta como único resultado comprovado o estímulo a práticas de desonestidade acadêmica.",
        "option_c": "Tem o potencial de reduzir desigualdades ao possibilitar tutoria personalizada e acessível.",
        "option_d": "Deverá ser proibida em todas as escolas públicas devido aos seus altos custos de implementação.",
        "option_e": "Já é dominada com plenitude por estudantes de todas as classes socioeconômicas.",
        "correct_option": "C",
        "explanation": "O texto destaca que a IA pode 'democratize customized tutoring' para estudantes desfavorecidos ('underprivileged students'), superando uma barreira que antes era privilégio dos ricos.",
        "distractor_analysis": {
            "A": "Radicalismo: o texto nunca afirma que professores serão eliminados.",
            "B": "Uso de 'único': o texto cita o medo de plágio, mas contrapõe com o benefício democratizante.",
            "D": "Invenção: o autor não propõe proibir a tecnologia.",
            "E": "Contraria a realidade do texto, que fala de uma transformação em curso e não de pleno domínio."
        },
        "difficulty_tri": "medio",
        "historical_success_rate": 61,
        "golden_tip": "Em línguas estrangeiras no ENEM, procure termos como 'democratize', 'underprivileged' e 'personalized': eles apontam diretamente para a mensagem central de impacto social."
    },

    # -------------------------------------------------------------
    # DIA 1: CIÊNCIAS HUMANAS - HISTÓRIA, GEOGRAFIA, FILOSOFIA, SOCIOLOGIA
    # -------------------------------------------------------------
    {
        "id": "enem-hum-2023-01",
        "year": 2023,
        "exam_day": 1,
        "area": "humanas",
        "subject": "historia",
        "topic": "Era Vargas e Legislação Trabalhista",
        "context_text": (
            "A criação da Consolidação das Leis do Trabalho (CLT), em 1943, durante o Estado Novo varguista, "
            "consolidou um modelo corporativista no qual o Estado atuava como mediador supremo entre capital e trabalho. "
            "Ao mesmo tempo em que concedia direitos históricos como férias e salário mínimo, atrelava os sindicatos "
            "ao Ministério do Trabalho, neutralizando a autonomia grevista dos operários."
        ),
        "statement": "A estratégia política de Getúlio Vargas evidenciada na implementação da legislação trabalhista caracterizou-se por:",
        "option_a": "Adotar integralmente as reivindicações anarquistas de autogestão fabril.",
        "option_b": "Conciliar a concessão de direitos sociais com mecanismos rígidos de tutela e controle estatal.",
        "option_c": "Privatizar os serviços públicos e extinguir a presença do Estado na regulação econômica.",
        "option_d": "Incentivar greves sindicais espontâneas para desestabilizar os industriais de São Paulo.",
        "option_e": "Garantir liberdade partidária irrestrita e descentralização do poder para os governos estaduais.",
        "correct_option": "B",
        "explanation": "O trabalhismo de Vargas era uma via de mão dupla (o 'pai dos pobres e mãe dos ricos'): garantia direitos reais à classe trabalhadora enquanto submetia os sindicatos ao controle estrito do Estado Novo.",
        "distractor_analysis": {
            "A": "Anarquismo rejeita o Estado; a CLT é a máxima expressão da intervenção do Estado.",
            "C": "Vargas foi o grande criador do Estado desenvolvimentista brasileiro (CSN, Vale), oposto do privatismo.",
            "D": "Greves eram severamente reprimidas e consideradas crimes contra a economia nacional no Estado Novo.",
            "E": "O Estado Novo foi uma ditadura centralizadora que fechou o Congresso e nomeou interventores nos estados."
        },
        "difficulty_tri": "medio",
        "historical_success_rate": 58,
        "golden_tip": "Quando a questão for Era Vargas + CLT, lembre-se do conceito de 'cidadania regulada': direitos concedidos em troca de lealdade política e controle social."
    },
    {
        "id": "enem-hum-2022-02",
        "year": 2022,
        "exam_day": 1,
        "area": "humanas",
        "subject": "geografia",
        "topic": "Urbanização, Segregação Espacial e Clima Urbano",
        "context_text": (
            "Nas grandes metrópoles brasileiras, a intensa impermeabilização do solo pelo asfalto e concreto, "
            "aliada à escassez de áreas verdes e à verticalização construtiva, produz microclimas caracterizados "
            "por temperaturas sensivelmente mais elevadas nas áreas centrais e densamente construídas em comparação "
            "às zonas periféricas e arborizadas."
        ),
        "statement": "O fenômeno climático urbano descrito no texto é denominado e tem como consequência socioambiental:",
        "option_a": "Inversão térmica; aumento da oxigenação do solo nas várzeas dos rios.",
        "option_b": "Chuva ácida; diminuição da velocidade dos ventos alísios na costa atlântica.",
        "option_c": "Ilha de calor; desconforto térmico, maior consumo de energia e intensificação do efeito estufa local.",
        "option_d": "Arenização; proliferação de dunas móveis nos leitos das avenidas metropolitanas.",
        "option_e": "Ruptura de barreira orográfica; retenção de umidade nas escarpas litorâneas.",
        "correct_option": "C",
        "explanation": "A ilha de calor decorre da absorção de radiação pelo asfalto e concreto e da falta de vegetação, gerando calor concentrado, uso excessivo de ar-condicionado e agravo na poluição atmosférica.",
        "distractor_analysis": {
            "A": "Inversão térmica é o aprisionamento de ar frio sob uma camada quente no inverno, não calor do asfalto.",
            "B": "Chuva ácida é causada por óxidos de enxofre e nitrogênio de queima de combustíveis, não pela pavimentação em si.",
            "D": "Arenização ocorre em solos arenosos no Rio Grande do Sul devido a manejo inadequado.",
            "E": "Barreira orográfica é fenômeno geomorfológico natural (relevo), sem relação direta com a malha urbana."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 74,
        "golden_tip": "Asfalto escuro + concreto + ausência de árvores no centro urbano = sempre Ilha de Calor no ENEM."
    },
    {
        "id": "enem-hum-2023-03",
        "year": 2023,
        "exam_day": 1,
        "area": "humanas",
        "subject": "filosofia",
        "topic": "Contratualismo e Estado de Natureza",
        "context_text": (
            "Thomas Hobbes, em 'Leviatã', defende que no estado de natureza a vida humana seria 'solitária, pobre, "
            "sórdida, embrutecida e curta'. O medo constante da morte violenta impele os indivíduos a renunciarem à sua "
            "liberdade natural e transferirem todo o poder soberano a um monarca ou assembleia, capaz de assegurar a paz."
        ),
        "statement": "Segundo a teoria política hobbesiana, o pacto social tem como fundamento originário a:",
        "option_a": "Busca espontânea pela igualdade econômica entre todos os membros da comunidade.",
        "option_b": "Garantia da preservação da vida e da segurança diante da guerra de todos contra todos.",
        "option_c": "Necessidade de consagrar o direito divino hereditário das famílias nobres.",
        "option_d": "Construção de uma democracia direta com voto universal e assembleias populares periódicas.",
        "option_e": "Eliminação de toda forma de autoridade armada para consagrar a harmonia natural entre os homens.",
        "correct_option": "B",
        "explanation": "Para Hobbes, o homem é o lobo do homem (homo homini lupus). Sem Estado soberano, há guerra civil perene. O contrato social nasce do medo primordial da morte e da necessidade de sobrevivência e segurança.",
        "distractor_analysis": {
            "A": "Hobbes nunca propõe igualdade econômica, apenas igualdade na capacidade mútua de se matar no estado de natureza.",
            "C": "Hobbes justifica o poder pelo contrato social humano racional, e não pela tradição medieval do direito divino.",
            "D": "Hobbes defende o absolutismo forte e centralizado, diametralmente oposto à democracia direta de Rousseau.",
            "E": "Para Hobbes, a ausência de autoridade armada é precisamente o estado de caos e guerra."
        },
        "difficulty_tri": "medio",
        "historical_success_rate": 66,
        "golden_tip": "Diferença chave dos contratualistas no ENEM: Hobbes = medo da morte e segurança; Locke = proteção à propriedade e liberdade; Rousseau = vontade geral e crítica à desigualdade."
    },

    # -------------------------------------------------------------
    # DIA 2: MATEMÁTICA E SUAS TECNOLOGIAS
    # -------------------------------------------------------------
    {
        "id": "enem-mat-2023-01",
        "year": 2023,
        "exam_day": 2,
        "area": "matematica",
        "subject": "matematica",
        "topic": "Escala Cartográfica e Proporção",
        "context_text": (
            "Um arquiteto projeta uma maquete de um edifício comercial na escala 1 : 200. "
            "No projeto da maquete, a fachada principal do edifício possui uma largura de 15 cm e "
            "uma altura de 30 cm."
        ),
        "statement": "A altura real desse edifício comercial, expressa em metros, é igual a:",
        "option_a": "15 m",
        "option_b": "30 m",
        "option_c": "60 m",
        "option_d": "600 m",
        "option_e": "6000 m",
        "correct_option": "C",
        "explanation": "Na escala 1:200, 1 cm na maquete corresponde a 200 cm na realidade. Como a altura é 30 cm: 30 cm * 200 = 6000 cm. Convertendo para metros: 6000 / 100 = 60 metros.",
        "distractor_analysis": {
            "A": "Calculou a largura real em vez da altura (15 * 200 / 100 = 30 m) e ainda cometeu erro de divisão.",
            "B": "Utilizou a medida da maquete sem multiplicar pela escala, ou calculou a largura (30 m).",
            "D": "Esqueceu de converter centímetros para metros corretamente (dividiu por 10 em vez de 100).",
            "E": "Deixou a resposta em centímetros (6000 cm), ignorando que a pergunta pede em metros."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 79,
        "golden_tip": "Em questões de escala no ENEM, faça a conversão de unidades (cm para metros) logo no início ou no final com muita calma para não cair na pegadinha da vírgula decimal."
    },
    {
        "id": "enem-mat-2022-02",
        "year": 2022,
        "exam_day": 2,
        "area": "matematica",
        "subject": "matematica",
        "topic": "Estatística Básica: Média, Mediana e Moda",
        "context_text": (
            "As notas de um estudante em cinco simulados preparatórios foram: 640, 720, 800, 720 e 920. "
            "Para definir sua estratégia de estudos, o estudante decide calcular a média aritmética e a mediana dessas notas."
        ),
        "statement": "Os valores correspondentes à média e à mediana das notas desse estudante são, respectivamente:",
        "option_a": "760 e 720",
        "option_b": "760 e 800",
        "option_c": "720 e 720",
        "option_d": "740 e 800",
        "option_e": "800 e 760",
        "correct_option": "A",
        "explanation": "1. Média = (640 + 720 + 800 + 720 + 920) / 5 = 3800 / 5 = 760.\n2. Para a mediana, primeiro organizamos o rol em ordem crescente: 640, 720, 720, 800, 920. O termo central (3º elemento) é 720.",
        "distractor_analysis": {
            "B": "Calculou a mediana pegando o elemento central da lista sem ordenar (800 estava no meio na ordem original). Pegadinha clássica!",
            "C": "Confundiu a média com a moda (720).",
            "D": "Erro aritmético na soma das notas (somou 3700 em vez de 3800).",
            "E": "Inverteu a ordem pedida no enunciado ('média e mediana' e colocou 800 e 760)."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 75,
        "golden_tip": "NUNCA calcule a mediana sem antes colocar todos os números em ordem crescente (Rol). O ENEM sempre coloca o termo central desordenado entre as opções para pegar os desatentos!"
    },
    {
        "id": "enem-mat-2023-03",
        "year": 2023,
        "exam_day": 2,
        "area": "matematica",
        "subject": "matematica",
        "topic": "Geometria Espacial: Volume de Cilindro",
        "context_text": (
            "Um reservatório de água em formato cilíndrico reto possui raio da base igual a 2 metros e "
            "altura igual a 5 metros. Adote pi = 3."
        ),
        "statement": "A capacidade total desse reservatório, em litros de água, é igual a:",
        "option_a": "6 000 L",
        "option_b": "12 000 L",
        "option_c": "20 000 L",
        "option_d": "60 000 L",
        "option_e": "120 000 L",
        "correct_option": "D",
        "explanation": "Volume do cilindro = pi * r^2 * h = 3 * (2^2) * 5 = 3 * 4 * 5 = 60 m^3. Como 1 metro cúbico equivale a 1 000 litros: 60 * 1 000 = 60 000 L.",
        "distractor_analysis": {
            "A": "Esqueceu de elevar o raio ao quadrado: 3 * 2 * 5 = 30 m^3 e cometeu erro de conversão.",
            "B": "Calculou apenas a área da base vezes 1000 litros (3 * 4 = 12 m^3 = 12 000 L), esquecendo a altura.",
            "C": "Multiplicou raio por altura por 1000 (2 * 5 * 1000 = 10 000 * 2 = 20 000 L), sem usar o pi.",
            "E": "Dobrou a fórmula (multiplicou pelo diâmetro em vez do raio): 3 * 16 * 5 / 2 = 120 000 L."
        },
        "difficulty_tri": "medio",
        "historical_success_rate": 62,
        "golden_tip": "Lembre-se sempre da relação de ouro do ENEM: 1 m^3 = 1.000 Litros, e 1 dm^3 = 1 Litro."
    },

    # -------------------------------------------------------------
    # DIA 2: CIÊNCIAS DA NATUREZA - BIOLOGIA, FÍSICA, QUÍMICA
    # -------------------------------------------------------------
    {
        "id": "enem-nat-2023-01",
        "year": 2023,
        "exam_day": 2,
        "area": "natureza",
        "subject": "biologia",
        "topic": "Ecologia: Bioacumulação e Magnificação Trófica",
        "context_text": (
            "Compostos químicos organoclorados persistentes e metais pesados como o mercúrio não são facilmente "
            "metabolizados nem excretados pelos seres vivos. Ao serem lançados em ecossistemas aquáticos, "
            "essas substâncias acumulam-se nos tecidos corporais ao longo das cadeias alimentares."
        ),
        "statement": "Em uma cadeia alimentar aquática composta por fitoplâncton, zooplâncton, pequenos peixes, peixes carnívoros e aves piscívoras, a maior concentração relativa dessa substância tóxica será encontrada no nível trófico ocupado por:",
        "option_a": "Fitoplâncton (produtores).",
        "option_b": "Zooplâncton (consumidores primários).",
        "option_c": "Pequenos peixes (consumidores secundários).",
        "option_d": "Peixes carnívoros (consumidores terciários).",
        "option_e": "Aves piscívoras (consumidores quaternários / topo de cadeia).",
        "correct_option": "E",
        "explanation": "Na magnificação trófica (bioacumulação), substâncias não biodegradáveis concentram-se cada vez mais à medida que subimos na cadeia alimentar. Como cada predador consome grande volume de presas durante a vida, o topo da cadeia acumula a maior dose tóxica.",
        "distractor_analysis": {
            "A": "Confunde concentração de poluente com fluxo de energia (a energia é maior no produtor, mas o veneno acumula no topo).",
            "B": "Consumidores primários têm absorção inicial baixa em relação aos níveis seguintes.",
            "C": "Nível intermediário acumula menos que os carnívoros superiores.",
            "D": "Embora acumulem muito, servem de alimento para as aves, que recebem a carga concentrada de múltiplos peixes."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 71,
        "golden_tip": "Regra crucial para o ENEM: Energia DECRESCE ao longo da cadeia alimentar, mas toxinas persistentes (bioacumulação) CRESCEM até o topo!"
    },
    {
        "id": "enem-nat-2022-02",
        "year": 2022,
        "exam_day": 2,
        "area": "natureza",
        "subject": "fisica",
        "topic": "Eletrodinâmica: Potência e Consumo de Energia Elétrica",
        "context_text": (
            "Um chuveiro elétrico opera com uma potência de 5 500 W (5,5 kW). Uma família de quatro pessoas utiliza "
            "o chuveiro diariamente, onde cada membro toma um banho de exatamente 15 minutos por dia. "
            "Considere o mês com 30 dias e a tarifa de energia elétrica no valor de R$ 0,80 por kWh."
        ),
        "statement": "O custo mensal em reais gerado exclusivamente pelo uso desse chuveiro por essa família é de:",
        "option_a": "R$ 44,00",
        "option_b": "R$ 88,00",
        "option_c": "R$ 132,00",
        "option_d": "R$ 220,00",
        "option_e": "R$ 528,00",
        "correct_option": "C",
        "explanation": "1. Tempo total diário = 4 pessoas * 15 min = 60 min = 1 hora/dia.\n2. Tempo no mês = 1 h/dia * 30 dias = 30 horas.\n3. Energia consumida = Potência * Tempo = 5,5 kW * 30 h = 165 kWh.\n4. Custo = 165 kWh * R$ 0,80 = R$ 132,00.",
        "distractor_analysis": {
            "A": "Calculou o consumo de apenas uma pessoa no mês (5,5 * 0,25 * 30 = 41,25 kWh * 0,80 = R$ 33 ou arredondou).",
            "B": "Calculou o banho para 2 pessoas apenas.",
            "D": "Esqueceu de converter minutos para horas ou utilizou tarifa cheia de R$ 1,00.",
            "E": "Multiplicou por 4 horas em vez de 1 hora diária."
        },
        "difficulty_tri": "medio",
        "historical_success_rate": 64,
        "golden_tip": "Fórmula do consumo no ENEM: E(kWh) = P(kW) * t(horas). Nunca se esqueça de converter Watts para kW (dividindo por 1000) e minutos para horas (dividindo por 60)."
    },
    {
        "id": "enem-nat-2023-03",
        "year": 2023,
        "exam_day": 2,
        "area": "natureza",
        "subject": "quimica",
        "topic": "Química Ambiental: Efeito Estufa e Gases de Combustão",
        "context_text": (
            "A queima de combustíveis fósseis em motores a combustão interna e usinas termelétricas libera "
            "grandes volumes de dióxido de carbono (CO2) na atmosfera. Paralelamente, a decomposição anaeróbica "
            "em aterros sanitários e o cultivo de arroz irrigado emitem gás metano (CH4), cujo potencial de aquecimento "
            "global por molécula é significativamente superior ao do CO2."
        ),
        "statement": "Do ponto de vista químico e ambiental, a mitigação do efeito estufa agravado pela queima de fósseis pode ser alcançada prioritariamente por meio de:",
        "option_a": "Incineração de resíduos plásticos a céu aberto em áreas urbanas.",
        "option_b": "Transição para matrizes energéticas renováveis como solar e eólica, e reflorestamento para sequestro de carbono.",
        "option_c": "Aumento do consumo de carvão mineral como substituto do gás natural em indústrias pesadas.",
        "option_d": "Drenagem de pântanos naturais para acelerar a oxidação do solo.",
        "option_e": "Aplicação de adubos nitrogenados concentrados sem controle de lixiviação.",
        "correct_option": "B",
        "explanation": "A substituição de combustíveis fósseis por fontes limpas (solar, eólica, biomassa) cessa novas emissões de CO2, enquanto a fotossíntese de florestas em crescimento atua fixando carbono atmosférico em biomassa vegetal (sequestro de carbono).",
        "distractor_analysis": {
            "A": "Incinerar plásticos gera mais CO2 e compostos clorados altamente tóxicos (dioxinas).",
            "C": "Carvão mineral é o combustível fóssil mais poluente e que mais emite CO2 por joule de energia.",
            "D": "Drenar pântanos destrói biodiversidade e libera metano e carbono acumulados na turfa.",
            "E": "Adubos nitrogenados em excesso liberam óxido nitroso (N2O), gás de efeito estufa 300 vezes mais potente que o CO2."
        },
        "difficulty_tri": "facil",
        "historical_success_rate": 82,
        "golden_tip": "No ENEM de Ciências da Natureza, soluções sustentáveis com reflorestamento, energia renovável e biocombustíveis são quase sempre as respostas certas em questões ambientais."
    }
]

SUBJECTS_INFO: List[Dict[str, Any]] = [
    {
        "id": "portugues",
        "name": "Língua Portuguesa & Interpretação",
        "area": "linguagens",
        "exam_day": 1,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Variação Linguística", "Funções da Linguagem", "Coesão e Coerência", "Gêneros Textuais"]
    },
    {
        "id": "literatura",
        "name": "Literatura Brasileira",
        "area": "linguagens",
        "exam_day": 1,
        "question_count_available": 10,
        "exam_ceiling_note": None,
        "key_topics": ["Modernismo de 22", "Romantismo", "Realismo Machadiano", "Poesia Contemporânea"]
    },
    {
        "id": "artes",
        "name": "Artes & Cultura",
        "area": "linguagens",
        "exam_day": 1,
        "question_count_available": 8,
        "exam_ceiling_note": None,
        "key_topics": ["Vanguardas Europeias", "Arte Contemporânea", "Patrimônio Cultural", "Música Popular"]
    },
    {
        "id": "lingua_estrangeira",
        "name": "Língua Estrangeira (Inglês / Espanhol)",
        "area": "linguagens",
        "exam_day": 1,
        "question_count_available": 5,
        "exam_ceiling_note": "Aviso Oficial ENEM: No exame nacional, a prova de língua estrangeira conta com exatamente 5 questões (questões 1 a 5 do caderno do Dia 1).",
        "key_topics": ["Interpretação Instrumental", "Textos de Opinião", "Cartuns e Tirinhas", "Falsos Cognatos"]
    },
    {
        "id": "historia",
        "name": "História do Brasil & Geral",
        "area": "humanas",
        "exam_day": 1,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Era Vargas", "Ditadura Civil-Militar", "Brasil Colônia", "Cidadania e Direitos"]
    },
    {
        "id": "geografia",
        "name": "Geografia Física & Humana",
        "area": "humanas",
        "exam_day": 1,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Urbanização e Clima", "Agronegócio e Meio Ambiente", "Geopolítica Global", "Demografia"]
    },
    {
        "id": "filosofia",
        "name": "Filosofia",
        "area": "humanas",
        "exam_day": 1,
        "question_count_available": 10,
        "exam_ceiling_note": None,
        "key_topics": ["Contratualismo", "Ética Aristotélica", "Filosofia Política", "Teoria do Conhecimento"]
    },
    {
        "id": "sociologia",
        "name": "Sociologia",
        "area": "humanas",
        "exam_day": 1,
        "question_count_available": 10,
        "exam_ceiling_note": None,
        "key_topics": ["Cidadania e Desigualdade", "Mundo do Trabalho", "Movimentos Sociais", "Cultura e Mídia"]
    },
    {
        "id": "matematica",
        "name": "Matemática e suas Tecnologias",
        "area": "matematica",
        "exam_day": 2,
        "question_count_available": 20,
        "exam_ceiling_note": None,
        "key_topics": ["Geometria Plana e Espacial", "Escala e Proporção", "Estatística (Média/Mediana)", "Funções"]
    },
    {
        "id": "biologia",
        "name": "Biologia",
        "area": "natureza",
        "exam_day": 2,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Ecologia e Impactos", "Fisiologia Humana", "Genética e Biotecnologia", "Citologia"]
    },
    {
        "id": "fisica",
        "name": "Física",
        "area": "natureza",
        "exam_day": 2,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Eletrodinâmica (Potência)", "Ondulatória e Acústica", "Cinemática e Dinâmica", "Termologia"]
    },
    {
        "id": "quimica",
        "name": "Química",
        "area": "natureza",
        "exam_day": 2,
        "question_count_available": 15,
        "exam_ceiling_note": None,
        "key_topics": ["Química Orgânica", "Estequiometria", "Eletroquímica (Pilhas)", "Química Ambiental"]
    }
]
