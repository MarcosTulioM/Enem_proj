import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  BookOpen,
  Sparkles,
  PenTool,
  Compass,
  ArrowLeft,
  Scale,
  Award,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  CheckSquare,
  Square,
  HelpCircle,
} from "lucide-react";

type GuideTopic =
  | "inicio"
  | "cores"
  | "competencias"
  | "simulado_tri"
  | "banca"
  | "checklist"
  | "faq";

export const LaypersonGuide: React.FC = () => {
  const { setCurrentView } = useAppStore();
  const [activeTopic, setActiveTopic] = useState<GuideTopic>("inicio");
  const [openAccordion, setOpenAccordion] = useState<string | null>("c1");

  const [checklist, setChecklist] = useState<Record<string, boolean>>({
    paragrafos: true,
    tese: true,
    repertorio: false,
    conectivos: true,
    c5_5elementos: false,
    direitos_humanos: true,
    tri_faceis: true,
  });

  const toggleCheck = (k: string) => {
    setChecklist((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const topics = [
    { id: "inicio" as const, title: "1. Como Começar", icon: Sparkles },
    { id: "cores" as const, title: "2. As Cores do Texto", icon: PenTool },
    { id: "competencias" as const, title: "3. As 5 Competências", icon: Award },
    { id: "simulado_tri" as const, title: "4. Simulado & Nota TRI", icon: Compass },
    { id: "banca" as const, title: "5. A Banca Alfa & Beta", icon: Scale },
    { id: "checklist" as const, title: "6. Checklist da Prova", icon: CheckSquare },
    { id: "faq" as const, title: "7. Perguntas Frequentes", icon: HelpCircle },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-300">
      {/* Argon 3D Header Banner */}
      <div className="card-3d-dark p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-display font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Manual do Estudante • Descomplicado</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
            Guia Rápido do Usuário
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-md leading-relaxed">
            Encontre explicações simples e diretas sobre como usar a plataforma, entender as cores do corretor e mandar bem na TRI.
          </p>
        </div>

        <button
          onClick={() => setCurrentView("hub")}
          className="btn-3d-white px-4 py-2.5 text-xs self-start sm:self-auto shrink-0"
        >
          <ArrowLeft className="w-4 h-4 text-brand-600" />
          <span>Voltar ao Início</span>
        </button>
      </div>

      {/* Topic Cards Navigation (Argon 3D Tactile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {topics.map((t) => {
          const Icon = t.icon;
          const isActive = activeTopic === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTopic(t.id)}
              className={`p-3 rounded-2xl border-2 text-left transition-all duration-150 flex items-center space-x-2.5 ${
                isActive
                  ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white border-brand-400 shadow-3d-emerald -translate-y-0.5"
                  : "bg-white border-slate-200 text-slate-700 shadow-3d-sm hover:border-slate-300 hover:-translate-y-0.5"
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 ${
                  isActive ? "text-white" : "text-brand-600"
                }`}
              />
              <span className="text-xs font-display font-bold truncate">
                {t.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* TOPIC 1: COMO COMEÇAR */}
      {activeTopic === "inicio" && (
        <div className="card-3d p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span>Como Usar a Plataforma em 3 Passos</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Tudo foi pensado para ser prático, sem burocracia ou cadastros demorados:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-brand-600 text-white font-mono font-black text-xs flex items-center justify-center mb-2.5 shadow-xs">
                1
              </span>
              <h3 className="text-sm font-display font-bold text-slate-900 mb-1">
                Escolha a Atividade
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No Hub, escolha entre <strong>Redação</strong>,{" "}
                <strong>Simulado do Dia 1</strong> (Humanas/Línguas) ou{" "}
                <strong>Simulado do Dia 2</strong> (Exatas/Natureza).
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-emerald-600 text-white font-mono font-black text-xs flex items-center justify-center mb-2.5 shadow-xs">
                2
              </span>
              <h3 className="text-sm font-display font-bold text-slate-900 mb-1">
                Pratique no Formato ENEM
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Digite sua redação ou responda questões com alternativas A a E. Ative a chave de{" "}
                <strong>Dicas</strong> caso queira pistas durante a prova.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80">
              <span className="w-8 h-8 rounded-xl bg-indigo-600 text-white font-mono font-black text-xs flex items-center justify-center mb-2.5 shadow-xs">
                3
              </span>
              <h3 className="text-sm font-display font-bold text-slate-900 mb-1">
                Receba a Deliberação
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Receba sua nota de 0 a 1000, explicações cirúrgicas de por que cada pegadinha parecia certa e gráficos da sua evolução no banco local.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 2: AS CORES DO TEXTO */}
      {activeTopic === "cores" && (
        <div className="card-3d p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <PenTool className="w-5 h-5 text-brand-600" />
              <span>O Significado das Cores Grifadas na Redação</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Ao corrigir sua redação, os avaliadores destacam trechos com 4 cores principais:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-3.5 h-3.5 rounded-full bg-rose-500"></span>
                <span className="text-xs font-display font-bold text-rose-900">
                  Vermelho: Gramática (C1)
                </span>
              </div>
              <p className="text-xs text-rose-800 leading-relaxed">
                Erros de ortografia, vírgula proibida entre sujeito e verbo, ou falta de crase. Clique no trecho para aplicar a sugestão em 1 clique.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border-2 border-amber-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-3.5 h-3.5 rounded-full bg-amber-500"></span>
                <span className="text-xs font-display font-bold text-amber-900">
                  Amarelo: Conectivos (C4)
                </span>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                Palavras repetidas muitas vezes ou ausência de conectivos de ligação no início dos parágrafos (ex: "Ademais", "Portanto").
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50 border-2 border-purple-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-3.5 h-3.5 rounded-full bg-purple-500"></span>
                <span className="text-xs font-display font-bold text-purple-900">
                  Roxo: Repertório & Tese (C2/C3)
                </span>
              </div>
              <p className="text-xs text-purple-800 leading-relaxed">
                Citações a filósofos, livros, filmes ou leis. Mostra se seu argumento ficou convincente ou se precisa de aprofundamento.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-200">
              <div className="flex items-center space-x-2 mb-1">
                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500"></span>
                <span className="text-xs font-display font-bold text-emerald-900">
                  Verde: Proposta de Intervenção (C5)
                </span>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Identificação dos 5 elementos da conclusão (Agente, Ação, Meio, Efeito e Detalhamento).
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 3: AS 5 COMPETÊNCIAS */}
      {activeTopic === "competencias" && (
        <div className="card-3d p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <Award className="w-5 h-5 text-brand-600" />
              <span>As 5 Competências do ENEM (Explicadas sem Jargão)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Cada competência vale 200 pontos (total de 1000). Clique para ver o checklist:
            </p>
          </div>

          {[
            {
              id: "c1",
              title: "C1: Escrever em Português Formal (0 a 200 pts)",
              desc: "Sem gírias, com no máximo 2 pequenos desvios gramaticais.",
            },
            {
              id: "c2",
              title: "C2: Compreender o Tema e Citar Repertórios (0 a 200 pts)",
              desc: "Não fugir do assunto e citar pelo menos 1 autor, lei ou fato histórico legítimo.",
            },
            {
              id: "c3",
              title: "C3: Organizar e Defender seu Ponto de Vista (0 a 200 pts)",
              desc: "Apresentar projeto de texto claro: 1 introdução, 2 desenvolvimentos e 1 conclusão.",
            },
            {
              id: "c4",
              title: "C4: Conectar Frases e Parágrafos (0 a 200 pts)",
              desc: "Usar conectivos no início dos parágrafos (ex: 'Em primeira análise', 'Ademais').",
            },
            {
              id: "c5",
              title: "C5: Os 5 Elementos da Conclusão (0 a 200 pts)",
              desc: "Quem faz (Agente), O que faz (Ação), Como faz (Meio), Para que faz (Efeito) + 1 Detalhe extra.",
            },
          ].map((item) => (
            <div
              key={item.id}
              className="border-2 border-slate-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() =>
                  setOpenAccordion(openAccordion === item.id ? null : item.id)
                }
                className="w-full p-4 text-left flex items-center justify-between bg-slate-50 hover:bg-slate-100/70 transition-colors"
              >
                <span className="text-xs font-display font-bold text-slate-900">
                  {item.title}
                </span>
                {openAccordion === item.id ? (
                  <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>
              {openAccordion === item.id && (
                <div className="p-4 bg-white text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                  {item.desc}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* TOPIC 4: SIMULADO & NOTA TRI */}
      {activeTopic === "simulado_tri" && (
        <div className="card-3d p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Como Funciona o Simulado e a Nota TRI</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              No ENEM, a pontuação não é calculada apenas contando quantas questões você acertou:
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border-2 border-indigo-200 space-y-2">
            <h3 className="text-xs font-display font-bold text-indigo-950 flex items-center space-x-1.5">
              <Lightbulb className="w-4 h-4 text-indigo-600" />
              <span>O que é a TRI (Teoria de Resposta ao Item)?</span>
            </h3>
            <p className="text-xs text-indigo-900 leading-relaxed">
              O algoritmo do ENEM avalia a sua <strong>coerência pedagógica</strong>:
            </p>
            <ul className="text-xs text-indigo-900 space-y-1.5 list-disc pl-5">
              <li>
                Acertar questões <strong>fáceis</strong> garante a base da sua nota (500 a 700 pts).
              </li>
              <li>
                Se você acertar uma questão <strong>difícil</strong> mas errar as fáceis, o sistema interpreta como "chute" e valoriza pouco aquele acerto.
              </li>
              <li>
                Nosso simulador calcula essa mesma coerência em tempo real e entrega sua nota estimada de 0 a 1000!
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border-2 border-amber-200 text-xs text-amber-900">
            <strong>⚠️ Atenção à Prova de Língua Estrangeira:</strong> No caderno oficial do ENEM, a prova de Inglês ou Espanhol tem exatamente <strong>5 questões</strong>. Nosso sistema respeita esse teto oficial na seleção de matérias.
          </div>
        </div>
      )}

      {/* TOPIC 5: A BANCA ALFA & BETA */}
      {activeTopic === "banca" && (
        <div className="card-3d p-6 sm:p-8 space-y-5">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <Scale className="w-5 h-5 text-brand-600" />
              <span>A Banca Dupla com Arbitragem Oficial</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Como funciona o julgamento das redações por inteligências artificiais especializadas:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <strong className="font-display text-brand-700 block mb-1">
                Avaliador Alfa (C1 & C4)
              </strong>
              Especialista em gramática, pontuação, acentuação e repertório de conectivos de transição.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <strong className="font-display text-indigo-700 block mb-1">
                Avaliador Beta (C2, C3 & C5)
              </strong>
              Especialista no tema, repertório cultural (autores, leis), argumentação e proposta de intervenção.
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200">
              <strong className="font-display text-amber-700 block mb-1">
                Supervisor (Árbitro)
              </strong>
              Entra em ação caso haja diferença maior que 80 pontos em qualquer competência ou violação aos Direitos Humanos.
            </div>
          </div>
        </div>
      )}

      {/* TOPIC 6: CHECKLIST DA PROVA */}
      {activeTopic === "checklist" && (
        <div className="card-3d p-6 sm:p-8 space-y-4">
          <div>
            <h2 className="text-lg font-display font-black text-slate-900 flex items-center space-x-2">
              <CheckSquare className="w-5 h-5 text-brand-600" />
              <span>Checklist da Aprovação (Marque antes de entregar)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Confira os pontos essenciais da sua preparação:
            </p>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: "paragrafos",
                label: "Texto estruturado em exatamente 4 parágrafos (Introdução, 2 D’s e Conclusão)",
              },
              {
                id: "tese",
                label: "Tese clara com duas causas apresentadas logo no primeiro parágrafo",
              },
              {
                id: "repertorio",
                label: "Pelo menos 1 repertório sociocultural legitimado e com uso produtivo",
              },
              {
                id: "conectivos",
                label: "Pelo menos dois parágrafos iniciados com conectivos interparágrafos",
              },
              {
                id: "c5_5elementos",
                label: "Conclusão com os 5 elementos (Quem, O quê, Como, Para quê e Detalhe)",
              },
              {
                id: "direitos_humanos",
                label: "Respeito total à dignidade humana (sem defender violência ou censura)",
              },
              {
                id: "tri_faceis",
                label: "Nas questões objetivas: garantiu as fáceis primeiro antes de empacar nas difíceis",
              },
            ].map((item) => (
              <div
                key={item.id}
                onClick={() => toggleCheck(item.id)}
                className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-center space-x-3 text-xs font-medium ${
                  checklist[item.id]
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                {checklist[item.id] ? (
                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TOPIC 7: PERGUNTAS FREQUENTES */}
      {activeTopic === "faq" && (
        <div className="card-3d p-6 sm:p-8 space-y-3.5">
          <h2 className="text-lg font-display font-black text-slate-900 mb-2">
            Perguntas Mais Frequentes
          </h2>

          {[
            {
              q: "Onde ficam salvas minhas notas e simulados?",
              a: "Tudo fica salvo no banco de dados local SQLite (arquivo enem_local.db) no seu computador. Nada se perde quando você fecha a janela.",
            },
            {
              q: "Posso criar ou excluir um perfil de estudante?",
              a: "Sim! Na barra superior (ou na aba Progresso), clique sobre o seu perfil para abrir o Gerenciador, onde você pode criar novos perfis, alternar entre eles ou excluir um perfil existente.",
            },
            {
              q: "O que acontece se eu errar uma questão no simulado?",
              a: "Ao finalizar, a plataforma te mostra o gabarito oficial, a análise de por que a pegadinha parecia certa e uma 'Dica de Ouro' para você não cair mais naquele erro no ENEM.",
            },
          ].map((faq, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl bg-slate-50 border-2 border-slate-200/80 text-xs"
            >
              <strong className="font-display text-slate-900 block mb-1">
                ❓ {faq.q}
              </strong>
              <p className="text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
