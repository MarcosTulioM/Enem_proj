# 🎓 Plataforma de Preparação Oficial para o ENEM 2026
## Redação com Sub-Agentes, Simulados TRI & Corpus de 100 Notas 1000

> Plataforma completa de preparação de alta fidelidade para o Exame Nacional do Ensino Médio, combinando **banca de sub-agentes examinadores** (Alfa, Beta e Supervisor), banco curado de **100 redações Nota 1000 reais dissecadas**, simulados oficiais com cálculo de **pontuação TRI**, análise de pegadinhas e banco de dados local **SQLite**.

---

## 🚀 Como Iniciar em 1 Clique (Zero Configuração)

### Opção 1: Inicializador Rápido no Windows (Recomendado)
Dê um duplo clique no arquivo executável na raiz do projeto:
```bat
START_APP.bat
```
*O inicializador subirá a API FastAPI com a interface web compilada embutida e abrirá automaticamente seu navegador em `http://localhost:8000`.*

---

### Opção 2: Modo Desenvolvedor (Backend com Hot-Reload + Vite)
Para desenvolver e modificar componentes em tempo real:
```bat
start_dev.bat
```
- **Frontend (Vite):** [http://localhost:5173](http://localhost:5173)
- **Backend (FastAPI & Swagger Docs):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🧪 Suíte de Testes Automatizados (33 Testes Aprovados)

O projeto conta com cobertura completa de testes unitários e de integração, garantindo que as regras do INEP, as detecções gramaticais, os cálculos da TRI e as operações no banco SQLite funcionem com 100% de precisão.

Para rodar todos os testes:
```bash
python -m pytest backend/tests -v
```

### Resultados dos Testes:
```text
backend/tests/test_api_endpoints.py .....                [15%]
backend/tests/test_benchmarks_golden_dataset.py ....     [27%]
backend/tests/test_corpus_100.py .....                   [42%]
backend/tests/test_inep_rules.py .....                   [57%]
backend/tests/test_nlp_engine.py ......                  [75%]
backend/tests/test_simulated_and_sqlite.py .....         [90%]
backend/tests/test_student_repository.py ...             [100%]

============================= 33 passed in 0.82s =============================
```

---

## 🏛️ Funcionalidades Principais da Plataforma

### 1. Hub de Estudos por Dias Oficiais do ENEM
- **Dia 1 (1º Domingo):**
  - **Redação Nota 1000:** Correção em tempo real por banca dupla, apontamento de erros com 1 clique e raio-x das 100 redações nota 1000.
  - **Linguagens e Códigos:** Língua Portuguesa, Literatura Brasileira, Artes e Língua Estrangeira (Inglês/Espanhol, respeitando o teto de 5 questões do caderno oficial).
  - **Ciências Humanas:** História, Geografia, Filosofia e Sociologia.
- **Dia 2 (2º Domingo):**
  - **Matemática e suas Tecnologias:** Geometria, funções, proporções, estatística e probabilidade.
  - **Ciências da Natureza:** Biologia, Física e Química.

---

### 2. Motor de Questões Autênticas & Estimativa TRI
- Formato oficial do exame com alternativas selecionáveis de **A a E**.
- Opções de simulados rápidos de **5, 10, 15 ou 20 questões**.
- **Chave de Dicas (Toggle):** Modo Treino com pistas cognitivas vs. Modo Prova silencioso.
- **Feedback Cirúrgico Pós-Simulado:**
  - **Método 1: Taxa Bruta de Acertos (%)**
  - **Método 2: Estimativa de Pontuação TRI (0 a 1000 pontos)** com penalização de chutes incoerentes e valorização das questões fáceis/médias.
  - **Método 3: Radar de Competências e Lacunas** por disciplina.
  - **Análise dos Distratores:** Explicação detalhada de por que a pegadinha parecia correta e qual armadilha o elaborador montou.
  - **Dica de Ouro:** Dica prática e mnemônica para gabaritar questões daquele padrão no ENEM.

---

### 3. Banco de Dados Local Simples & Expansível (SQLite)
- Persistência nativa em arquivo local (`backend/app/data/enem_local.db`).
- Padrão **Repository** desacoplado (`SqliteEnemRepository`), pronto para migração em nuvem (PostgreSQL, Supabase, MySQL) sem alterações na lógica de negócio.
- Registro de questões já respondidas pelo estudante para evitar repetições desnecessárias.

---

### 4. Correção de Redação com Sub-Agentes (Alfa, Beta e Supervisor)
- **Avaliador Alfa:** Especialista em C1 (norma culta) e C4 (conectivos e coesão).
- **Avaliador Beta:** Especialista em C2 (tema e repertório), C3 (projeto de texto) e C5 (proposta de intervenção).
- **Auditor Supervisor:** Árbitro de discrepâncias oficial do INEP ($|\Delta| > 80$ em competência ou $> 100$ no total) e verificação de Direitos Humanos.
- **Mentor Pedagógico:** Traduz termos técnicos para linguagem simples e cria planos de ação práticos.

---

### 5. Design Responsivo Adaptativo e Tátil
- Cabeçalho reformulado com estética 3D, eliminando compressão de botões e vazamentos em qualquer resolução de tela ou zoom.
- Drawer responsivo e otimizado para celulares e tablets.
- Guia do Aluno despoluído, tátil e rápido de consultar.

---

*Projeto desenvolvido com rigor técnico, respeito às matrizes do INEP e foco total na aprovação do estudante.*
