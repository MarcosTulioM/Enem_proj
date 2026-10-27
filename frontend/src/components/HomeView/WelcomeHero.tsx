import React, { useState } from "react";
import { useAppStore } from "../../store/useAppStore";
import {
  Sparkles,
  ArrowRight,
  PenTool,
  Compass,
  Search,
  Calendar,
  Layers,
  Award,
  CheckCircle2,
} from "lucide-react";

export const WelcomeHero: React.FC = () => {
  const {
    profiles,
    activeProfileId,
    addNewProfile,
    setCurrentView,
    setSelectedExamDay,
    setHasCompletedWelcome,
  } = useAppStore();

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];
  const [userName, setUserName] = useState(
    activeProfile?.name && activeProfile.name !== "Estudante ENEM" ? activeProfile.name : ""
  );
  const [isSettingName, setIsSettingName] = useState(false);

  const handleStart = (
    targetView: "hub" | "corrector" | "simulated" | "explorer" = "hub",
    day?: 1 | 2
  ) => {
    if (userName.trim() && userName.trim() !== activeProfile?.name) {
      addNewProfile(userName.trim());
    }
    setHasCompletedWelcome(true);
    if (day) {
      setSelectedExamDay(day);
    }
    setCurrentView(targetView);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-2 sm:py-4 animate-in fade-in duration-300">
      {/* Argon 3D Visual Depth Hero Banner */}
      <div className="relative overflow-hidden card-3d-dark p-6 sm:p-10 lg:p-12">
        {/* Soft Background Glowing Orbs */}
        <div className="absolute -top-24 -left-24 w-80 h-80 bg-brand-500/25 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            {/* 3D Pill Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-display font-black bg-white/10 text-emerald-300 border border-emerald-400/30 backdrop-blur-md shadow-xs mb-5">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="tracking-wide uppercase">Plataforma Argon 3D • ENEM 2026</span>
            </div>

            {/* Title with Tactile 3D Depth */}
            <h1 className="text-3xl sm:text-5xl font-display font-black tracking-tight text-white leading-[1.12]">
              Preparação Oficial para o{" "}
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
                ENEM 2026
              </span>
            </h1>

            {/* 3-Line Welcoming Description */}
            <p className="text-slate-300 text-xs sm:text-sm mt-4 leading-relaxed max-w-2xl font-normal">
              Treine sua redação com a <strong>Banca Dupla do INEP</strong>, resolva questões oficiais com análise de
              pegadinhas e cálculo de <strong>pontuação TRI</strong>, e estude com o raio-x cirúrgico de 100 redações
              nota máxima autênticas.
            </p>

            {/* Name Setup or Welcome Back */}
            <div className="mt-7 pt-6 border-t border-slate-800/90">
              {!isSettingName && activeProfile?.name && activeProfile.name !== "Estudante ENEM" ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-display font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                      Perfil Conectado
                    </span>
                    <div className="text-xl font-display font-black text-white flex items-center space-x-2.5">
                      <span>Olá, {activeProfile.name}!</span>
                      <button
                        onClick={() => setIsSettingName(true)}
                        className="text-xs text-slate-400 hover:text-white underline font-sans font-medium"
                      >
                        (Criar outro perfil)
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => handleStart("hub")}
                    className="btn-3d-emerald px-7 py-3.5 text-sm"
                  >
                    <span>Vamos Começar?</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row sm:items-end gap-3 max-w-xl">
                  <div className="flex-1">
                    <label className="block text-[11px] font-display font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                      Como devemos te chamar?
                    </label>
                    <input
                      type="text"
                      placeholder="Digite seu nome (ex: Marcos)..."
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border-2 border-white/20 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 transition-all font-medium"
                    />
                  </div>
                  <button
                    onClick={() => handleStart("hub")}
                    className="btn-3d-emerald px-6 py-3 text-xs shrink-0"
                  >
                    <span>Vamos Começar?</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right 3D Floating Showcase Badges */}
          <div className="lg:col-span-4 hidden lg:flex flex-col gap-3.5">
            <div className="bg-white/10 backdrop-blur-md border-2 border-white/15 rounded-2xl p-4 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-brand-400 to-brand-600 text-white flex items-center justify-center shadow-3d-emerald shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-display font-black uppercase text-emerald-300 block">
                    Rigor Oficial INEP
                  </span>
                  <span className="text-sm font-display font-black text-white">
                    2 Corretores + Auditor
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border-2 border-white/15 rounded-2xl p-4 shadow-lg transform rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-indigo-400 to-indigo-600 text-white flex items-center justify-center shadow-3d-indigo shrink-0">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-display font-black uppercase text-indigo-300 block">
                    3 Métodos de Correção
                  </span>
                  <span className="text-sm font-display font-black text-white">
                    Nota TRI + Taxa Bruta + Radar
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md border-2 border-white/15 rounded-2xl p-4 shadow-lg transform -rotate-1 hover:rotate-0 transition-transform">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-3d-amber shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-display font-black uppercase text-amber-300 block">
                    Acervo 100% Humano
                  </span>
                  <span className="text-sm font-display font-black text-white">
                    100 Redações Nota 1000
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Cards with 3D Tactile Aesthetics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-display font-black text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Layers className="w-4 h-4 text-brand-600" />
            <span>O que você deseja praticar hoje?</span>
          </h2>
          <span className="text-xs font-semibold text-slate-400">Escolha uma modalidade 3D</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Redação */}
          <div
            onClick={() => handleStart("corrector")}
            className="card-3d-interactive p-5 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-brand-500 to-brand-600 text-white flex items-center justify-center mb-3.5 shadow-3d-emerald group-hover:scale-105 transition-transform">
                <PenTool className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-brand-700 block mb-1">
                Banca Dupla Oficial
              </span>
              <h3 className="text-base font-display font-black text-slate-900 mb-1.5 group-hover:text-brand-700 transition-colors">
                Redação Nota 1000
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Avaliação de C1 a C5 por dois corretores com arbitragem de discrepâncias e correção de erros com 1 clique.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold text-brand-700">
              <span>Abrir Corretor</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Simulado Dia 1 */}
          <div
            onClick={() => {
              setSelectedExamDay(1);
              handleStart("hub", 1);
            }}
            className="card-3d-interactive p-5 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-emerald-500 to-teal-600 text-white flex items-center justify-center mb-3.5 shadow-3d-emerald group-hover:scale-105 transition-transform">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-emerald-700 block mb-1">
                1º Domingo do ENEM
              </span>
              <h3 className="text-base font-display font-black text-slate-900 mb-1.5 group-hover:text-emerald-700 transition-colors">
                Dia 1: Humanas & Línguas
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Português, Literatura, Artes, Inglês/Espanhol, História, Geografia, Filosofia e Sociologia.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold text-emerald-700">
              <span>Ver Matérias do Dia 1</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Simulado Dia 2 */}
          <div
            onClick={() => {
              setSelectedExamDay(2);
              handleStart("hub", 2);
            }}
            className="card-3d-interactive p-5 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-indigo-500 to-indigo-600 text-white flex items-center justify-center mb-3.5 shadow-3d-indigo group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-indigo-700 block mb-1">
                2º Domingo do ENEM
              </span>
              <h3 className="text-base font-display font-black text-slate-900 mb-1.5 group-hover:text-indigo-700 transition-colors">
                Dia 2: Exatas & Natureza
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Matemática e suas Tecnologias, Biologia, Física e Química com cálculo de pontuação estimada pela TRI.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold text-indigo-700">
              <span>Ver Matérias do Dia 2</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Raio-X 100 Redações */}
          <div
            onClick={() => handleStart("explorer")}
            className="card-3d-interactive p-5 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-amber-500 to-amber-600 text-white flex items-center justify-center mb-3.5 shadow-3d-amber group-hover:scale-105 transition-transform">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-display font-black uppercase tracking-wider text-amber-700 block mb-1">
                100 Textos Reais
              </span>
              <h3 className="text-base font-display font-black text-slate-900 mb-1.5 group-hover:text-amber-700 transition-colors">
                Raio-X Anatômico
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                100 redações nota máxima dissecadas em Introdução, D1, D2, repertórios filosóficos e elementos da C5.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-display font-bold text-amber-700">
              <span>Explorar Acervo</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
