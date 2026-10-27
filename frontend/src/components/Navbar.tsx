import React, { useState } from "react";
import { useAppStore } from "../store/useAppStore";
import {
  PenTool,
  Search,
  TrendingUp,
  User,
  Plus,
  BookOpen,
  Home,
  CheckCircle2,
  Menu,
  X,
  Compass,
  Trash2,
  ChevronDown,
  AlertTriangle,
} from "lucide-react";

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    profiles,
    activeProfileId,
    switchProfile,
    addNewProfile,
    removeProfile,
  } = useAppStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newProfileName, setNewProfileName] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const activeProfile = profiles.find((p) => p.id === activeProfileId) || profiles[0];

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newProfileName.trim()) {
      await addNewProfile(newProfileName.trim());
      setNewProfileName("");
      setIsModalOpen(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    await removeProfile(id);
    setConfirmDeleteId(null);
  };

  const navLinks = [
    {
      id: "hub",
      label: "Início & Matérias",
      shortLabel: "Início",
      icon: Home,
      badge: "2026",
      badgeColor: "bg-emerald-500/15 text-emerald-700 border-emerald-300",
    },
    {
      id: "corrector",
      label: "Redação",
      shortLabel: "Redação",
      icon: PenTool,
      badge: "Banca",
      badgeColor: "bg-brand-500/15 text-brand-700 border-brand-300",
    },
    {
      id: "simulated",
      label: "Simulados",
      shortLabel: "Simulados",
      icon: Compass,
      badge: "TRI",
      badgeColor: "bg-indigo-500/15 text-indigo-700 border-indigo-300",
    },
    {
      id: "explorer",
      label: "Raio-X (100)",
      shortLabel: "Raio-X",
      icon: Search,
      badge: "1000",
      badgeColor: "bg-purple-500/15 text-purple-700 border-purple-300",
    },
    {
      id: "progress",
      label: "Progresso",
      shortLabel: "Progresso",
      icon: TrendingUp,
    },
    {
      id: "docs",
      label: "Manual",
      shortLabel: "Manual",
      icon: BookOpen,
      badge: "Guia",
      badgeColor: "bg-amber-500/15 text-amber-800 border-amber-300",
    },
  ];

  return (
    <header className="sticky top-0 z-50 px-3 sm:px-6 pt-2.5 pb-1">
      <div className="max-w-7xl mx-auto bg-white/90 backdrop-blur-xl rounded-2xl border-2 border-slate-200/90 shadow-3d-sm px-3 sm:px-5">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Argon 3D Brand Logo */}
          <div
            className="flex items-center space-x-2.5 cursor-pointer shrink-0 select-none group"
            onClick={() => setCurrentView("hub")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-brand-500 to-brand-700 border-t border-brand-300/60 flex items-center justify-center text-white shadow-3d-emerald transform transition-all duration-150 group-hover:-translate-y-0.5 active:translate-y-0.5">
              <CheckCircle2 className="w-5 h-5 text-white drop-shadow-xs" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-black text-lg tracking-tight bg-gradient-to-r from-slate-900 via-brand-900 to-indigo-950 bg-clip-text text-transparent">
                  EnemCorretor
                </span>
                <span className="px-1.5 py-0.5 text-[9px] font-display font-black uppercase tracking-wider bg-gradient-to-r from-emerald-500 to-brand-600 text-white rounded-md shadow-xs">
                  3D
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-semibold leading-none hidden sm:block">
                Banca Oficial • Simulado TRI & 100 Notas 1000
              </p>
            </div>
          </div>

          {/* Desktop 3D Tactile Navigation Dock */}
          <nav className="hidden lg:flex items-center space-x-1 bg-slate-100/95 p-1.5 rounded-xl border border-slate-200/80 shadow-inner">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                currentView === item.id ||
                (item.id === "hub" && (currentView === "welcome" || currentView === "hub"));

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as any)}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-display font-bold transition-all duration-150 whitespace-nowrap ${
                    isActive
                      ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white shadow-3d-emerald -translate-y-0.5"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/80"
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 shrink-0 ${
                      isActive ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <span className="hidden xl:inline">{item.label}</span>
                  <span className="xl:hidden">{item.shortLabel}</span>
                  {item.badge && (
                    <span
                      className={`ml-1 px-1.5 py-0.2 rounded-full text-[9px] font-black uppercase border ${
                        isActive
                          ? "bg-white/20 text-white border-white/30"
                          : item.badgeColor || "bg-slate-200 text-slate-700 border-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Profile & Manage Button */}
          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => {
                setConfirmDeleteId(null);
                setIsModalOpen(true);
              }}
              className="flex items-center bg-slate-50 hover:bg-white border-2 border-slate-200 hover:border-brand-300 rounded-xl p-1 pr-2.5 max-w-[175px] sm:max-w-[210px] shadow-3d-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
              title="Gerenciar, trocar ou excluir perfil de estudante"
            >
              <div
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-display font-black text-xs shrink-0 shadow-xs"
                style={{ backgroundColor: activeProfile?.avatar_color || "#10B981" }}
              >
                {activeProfile?.name ? activeProfile.name[0].toUpperCase() : "E"}
              </div>
              <div className="text-left ml-2 truncate">
                <span className="block text-xs font-display font-bold text-slate-800 leading-tight truncate">
                  {activeProfile?.name || "Estudante"}
                </span>
                <span className="block text-[9px] text-slate-500 font-semibold leading-none truncate">
                  {profiles.length} {profiles.length === 1 ? "perfil ativo" : "perfis salvos"}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1.5 shrink-0" />
            </button>

            {/* Quick Add Profile Button */}
            <button
              onClick={() => {
                setConfirmDeleteId(null);
                setIsModalOpen(true);
              }}
              className="p-2 text-brand-700 bg-brand-50 hover:bg-brand-100 rounded-xl border-2 border-brand-200 shadow-3d-sm transition-all duration-150 hover:-translate-y-0.5 active:translate-y-0.5"
              title="Gerenciar perfis (Criar ou Excluir)"
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-xl border-2 border-slate-200 shadow-3d-sm transition-all"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile / Tablet Responsive Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden max-w-7xl mx-auto mt-2 bg-white/95 backdrop-blur-xl rounded-2xl border-2 border-slate-200 px-4 py-3 space-y-1.5 shadow-3d-card animate-in slide-in-from-top-2 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              currentView === item.id ||
              (item.id === "hub" && (currentView === "welcome" || currentView === "hub"));

            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentView(item.id as any);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-display font-bold transition-all ${
                  isActive
                    ? "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-3d-emerald"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-brand-600"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                      isActive
                        ? "bg-white/20 text-white border-white/30"
                        : item.badgeColor || "bg-slate-200 text-slate-700 border-slate-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* Modal for Managing Profiles (Switch, Create & Delete) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="card-3d p-6 max-w-md w-full animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center border border-brand-200">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-display font-black text-slate-900">
                    Gerenciar Perfis de Estudante
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Alterne entre alunos, crie um novo ou exclua um perfil.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Existing Profiles List with Switch & Delete */}
            <div className="space-y-2 mb-5 max-h-60 overflow-y-auto pr-1">
              <span className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-400 block">
                Perfis cadastrados no banco local ({profiles.length})
              </span>
              {profiles.map((prof) => {
                const isCurrent = prof.id === activeProfileId;
                const isConfirming = confirmDeleteId === prof.id;

                return (
                  <div
                    key={prof.id}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      isCurrent
                        ? "bg-brand-50/70 border-brand-400 shadow-xs"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          switchProfile(prof.id);
                          setConfirmDeleteId(null);
                        }}
                        className="flex items-center space-x-2.5 text-left flex-1 min-w-0"
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-display font-black text-xs shrink-0 shadow-xs"
                          style={{ backgroundColor: prof.avatar_color || "#10B981" }}
                        >
                          {prof.name ? prof.name[0].toUpperCase() : "E"}
                        </div>
                        <div className="truncate">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-display font-bold text-slate-900 truncate">
                              {prof.name}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 text-[9px] font-black uppercase bg-brand-600 text-white rounded-md">
                                Ativo
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-500 block">
                            Clique para selecionar este perfil
                          </span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setConfirmDeleteId(isConfirming ? null : prof.id)
                        }
                        className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg border border-rose-200/80 transition-colors shrink-0"
                        title="Excluir perfil e limpar histórico"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {isConfirming && (
                      <div className="mt-2.5 pt-2.5 border-t border-rose-200 bg-rose-50/90 -mx-1 px-2.5 py-2 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start space-x-1.5 text-rose-900 text-[11px]">
                          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                          <span>
                            Excluir <strong>{prof.name}</strong> e todas as redações/simulados?
                          </span>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0 self-end sm:self-center">
                          <button
                            type="button"
                            onClick={() => setConfirmDeleteId(null)}
                            className="px-2.5 py-1 text-[10px] font-bold text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-100"
                          >
                            Cancelar
                          </button>
                          <button
                            type="button"
                            onClick={() => handleConfirmDelete(prof.id)}
                            className="px-2.5 py-1 text-[10px] font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-md shadow-xs"
                          >
                            Confirmar Exclusão
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Create New Profile Form */}
            <form onSubmit={handleCreateProfile} className="pt-3 border-t border-slate-200">
              <label className="text-[10px] font-display font-bold uppercase tracking-wider text-slate-500 block mb-1.5">
                Adicionar Novo Perfil
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProfileName}
                  onChange={(e) => setNewProfileName(e.target.value)}
                  placeholder="Nome do estudante (ex: Ana Clara)"
                  className="flex-1 px-3.5 py-2 border-2 border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-brand-500"
                />
                <button
                  type="submit"
                  className="btn-3d-emerald px-4 py-2 text-xs shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Criar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
