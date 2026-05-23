"use client";
import { useState, useRef, useCallback } from "react";
import { generatePlan, fetchProject, getPdfDownloadUrl, type ProjectPlan, type ProjectSummary } from "@/lib/api";
import SectionCard from "@/components/SectionCard";
import Loader from "@/components/Loader";
import HistoryPanel from "@/components/HistoryPanel";
import { Sparkles, Download, RotateCcw, List } from "lucide-react";

const SECTIONS = [
  { key: "problem_statement",   icon: "🎯", title: "Problem Statement",   accent: "#f87171" },
  { key: "market_research",     icon: "📊", title: "Market Research",     accent: "#fb923c" },
  { key: "competitor_analysis", icon: "🔭", title: "Competitor Analysis", accent: "#facc15" },
  { key: "architecture",        icon: "🏗️", title: "System Architecture", accent: "#4ade80" },
  { key: "tech_stack",          icon: "⚙️", title: "Tech Stack",          accent: "#34d399" },
  { key: "roadmap",             icon: "🗓️", title: "Development Roadmap", accent: "#60a5fa" },
  { key: "risks",               icon: "⚠️", title: "Risks & Mitigation",  accent: "#f472b6" },
  { key: "deployment_plan",     icon: "🚀", title: "Deployment Plan",     accent: "#a78bfa" },
  { key: "cost_estimate",       icon: "💰", title: "Cost Estimate",       accent: "#fbbf24" },
  { key: "future_scope",        icon: "🔮", title: "Future Scope",        accent: "#38bdf8" },
  { key: "pitch_deck",          icon: "🎤", title: "Pitch Deck Outline",  accent: "#e879f9" },
] as const;

function scrollToSection(key: string) {
  document.getElementById(`section-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Home() {
  const [idea, setIdea]             = useState("");
  const [result, setResult]         = useState<ProjectPlan | null>(null);
  const [loading, setLoading]       = useState(false);
  const [historyLoadingId, setHistoryLoadingId] = useState<number | null>(null);
  const [loadStep, setLoadStep]     = useState(0);
  const [error, setError]           = useState("");
  const [pdfError, setPdfError]     = useState("");
  const resultRef                   = useRef<HTMLDivElement>(null);

  const showResults = Boolean(result && !loading);

  const openProject = useCallback(async (project: ProjectSummary) => {
    setError("");
    setPdfError("");
    setHistoryLoadingId(project.id);

    const applyPlan = (data: ProjectPlan) => {
      setIdea(String(data.idea ?? project.idea));
      setResult({
        ...data,
        id: project.id,
        idea: data.idea ?? project.idea,
        has_pdf: project.has_pdf ?? data.has_pdf,
      });
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    };

    try {
      if (project.plan && typeof project.plan === "object") {
        applyPlan(project.plan);
        return;
      }
      const data = await fetchProject(project.id);
      applyPlan(data);
    } catch (e: unknown) {
      setError(
        e instanceof Error
          ? e.message
          : "Could not open saved project. Restart the backend: python -m uvicorn main:app --reload --port 8000"
      );
    } finally {
      setHistoryLoadingId(null);
    }
  }, []);

  async function generate() {
    if (!idea.trim()) return;
    setError("");
    setPdfError("");
    setLoading(true);
    setResult(null);
    setLoadStep(0);

    const timer = setInterval(() => {
      setLoadStep((s) => (s < 4 ? s + 1 : 4));
    }, 4000);

    try {
      const data = await generatePlan(idea);
      clearInterval(timer);
      setResult(data);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    } catch (e: unknown) {
      clearInterval(timer);
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setResult(null);
    setIdea("");
    setError("");
    setPdfError("");
  }

  const projectId = typeof result?.id === "number" ? result.id : null;
  const showPdfButton = projectId !== null;

  async function handlePdfDownload() {
    if (!projectId) {
      setPdfError("Save the project first, or regenerate to create a PDF.");
      return;
    }
    setPdfError("");
    try {
      const res = await fetch(getPdfDownloadUrl(projectId));
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? `Download failed (${res.status})`);
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `project-plan-${projectId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e: unknown) {
      setPdfError(e instanceof Error ? e.message : "PDF download failed.");
    }
  }

  return (
    <main className="min-h-screen">
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #4f8ef7, transparent)" }} />
        <div className="absolute top-1/2 -right-40 w-80 h-80 rounded-full opacity-10"
             style={{ background: "radial-gradient(circle, #7b5ea7, transparent)" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-8"
             style={{ background: "radial-gradient(circle, #4f8ef7, transparent)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#2a2a45] text-xs text-[var(--fog)] mb-8"
               style={{ background: "#1a1a2e" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--lime)] animate-pulse" />
            AI-Powered · Multi-Agent · Full Project Plan
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold mb-4 leading-tight"
              style={{ fontFamily: "'Syne', sans-serif" }}>
            Autonomous
            <br />
            <span style={{ color: "var(--accent)" }}>Project Mentor</span>
          </h1>

          <p className="text-[var(--fog)] text-lg max-w-xl mx-auto leading-relaxed">
            Describe your idea. Four specialized AI agents research, architect,
            plan, and pitch your project — then export a full PDF report.
          </p>
        </div>

        <HistoryPanel onSelect={openProject} loadingId={historyLoadingId} />

        {!showResults && (
          <div className="animate-slide-up">
            <div className="section-card mb-6">
              <label className="block text-xs font-mono text-[var(--fog)] mb-3 uppercase tracking-widest">
                Your Project Idea
              </label>
              <textarea
                className="idea-input"
                rows={4}
                placeholder="e.g. Build a Plant Disease Detection System using AI and mobile cameras for smallholder farmers in rural India…"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generate();
                }}
              />
              <p className="text-xs text-[var(--fog)] mt-2">Ctrl+Enter to generate</p>
            </div>

            <button
              type="button"
              onClick={generate}
              disabled={loading || !idea.trim()}
              className="w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-3 transition-all duration-300"
              style={{
                background: loading || !idea.trim()
                  ? "#2a2a45"
                  : "linear-gradient(135deg, #4f8ef7, #7b5ea7)",
                color: loading || !idea.trim() ? "var(--fog)" : "white",
                cursor: loading || !idea.trim() ? "not-allowed" : "pointer",
                boxShadow: loading || !idea.trim() ? "none" : "0 8px 32px #4f8ef744",
                fontFamily: "'Syne', sans-serif",
              }}
            >
              <Sparkles size={18} />
              {loading ? "Generating…" : "Generate Full Project Plan"}
            </button>

            {error && (
              <div className="mt-4 px-5 py-4 rounded-xl border border-red-800 bg-red-950 text-red-300 text-sm">
                {error}
              </div>
            )}
          </div>
        )}

        {loading && <Loader step={loadStep} />}

        {showResults && result && (
          <div ref={resultRef} className="animate-fade-in">
            <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
              <div className="min-w-0">
                <p className="text-xs font-mono text-[var(--fog)] mb-1 uppercase tracking-widest">
                  {historyLoadingId ? "Loading…" : "Project Plan Ready"}
                </p>
                <h2 className="text-2xl md:text-3xl font-bold leading-snug" style={{ fontFamily: "'Syne', sans-serif" }}>
                  {String(result.idea ?? idea)}
                </h2>
              </div>
              <div className="flex gap-3 flex-wrap">
                <button
                  type="button"
                  onClick={reset}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#2a2a45] hover:border-[var(--fog)] text-sm text-[var(--fog)] hover:text-white transition-all"
                >
                  <RotateCcw size={14} /> New Idea
                </button>
                {showPdfButton && (
                  <button
                    type="button"
                    onClick={handlePdfDownload}
                    className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                    style={{ background: "linear-gradient(135deg, #4f8ef7, #7b5ea7)" }}
                  >
                    <Download size={14} /> Download PDF
                  </button>
                )}
              </div>
            </div>

            {pdfError && (
              <div className="mb-6 px-5 py-4 rounded-xl border border-red-800 bg-red-950 text-red-300 text-sm">
                {pdfError}
              </div>
            )}

            {error && (
              <div className="mb-6 px-5 py-4 rounded-xl border border-red-800 bg-red-950 text-red-300 text-sm">
                {error}
              </div>
            )}

            <nav className="section-card mb-8 sticky top-4 z-20 backdrop-blur-md bg-[#1a1a2ee6]">
              <h3 className="text-sm font-semibold text-[var(--fog)] mb-3 flex items-center gap-2">
                <List size={14} /> Jump to section
              </h3>
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((s) => (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => scrollToSection(s.key)}
                    className="text-xs px-3 py-1.5 rounded-full border border-[#2a2a45] hover:border-[var(--accent)] hover:text-[var(--accent)] text-[#c8c8d8] transition-colors"
                  >
                    {s.icon} {s.title}
                  </button>
                ))}
              </div>
            </nav>

            <div className="flex flex-col gap-5">
              {SECTIONS.map((s, i) => (
                <SectionCard
                  key={s.key}
                  sectionId={`section-${s.key}`}
                  icon={s.icon}
                  title={s.title}
                  content={String(result[s.key] ?? "")}
                  accent={s.accent}
                  defaultOpen={i === 0}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
