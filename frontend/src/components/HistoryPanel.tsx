"use client";
import { useEffect, useState } from "react";
import { fetchProjects, type ProjectSummary } from "@/lib/api";
import { Clock, FileText, Loader2 } from "lucide-react";

interface Props {
  onSelect: (project: ProjectSummary) => void;
  loadingId?: number | null;
}

export default function HistoryPanel({ onSelect, loadingId = null }: Props) {
  const [projects, setProjects] = useState<ProjectSummary[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    fetchProjects()
      .then(setProjects)
      .catch(() => setLoadError("Could not load saved projects. Is the backend running on port 8000?"));
  }, []);

  if (loadError) {
    return (
      <div className="section-card mb-8 text-sm text-amber-200/90 border-amber-900/50 bg-amber-950/30">
        {loadError}
      </div>
    );
  }

  if (!projects.length) return null;

  return (
    <div className="section-card mb-8 border-[var(--accent)]/30">
      <h3 className="text-base font-semibold text-white mb-1 flex items-center gap-2">
        <Clock size={16} className="text-[var(--accent)]" /> Saved project memory
      </h3>
      <p className="text-sm text-[var(--fog)] mb-4">
        Open a past plan below — click the blue <strong className="text-[var(--accent)]">View plan</strong> button.
      </p>
      <div className="flex flex-col gap-3">
        {projects.slice(0, 8).map((p) => {
          const isLoading = loadingId === p.id;
          return (
            <div
              key={p.id}
              className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-xl px-4 py-4 border border-[#2a2a45] bg-[#12121f]/80"
            >
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-[#e8e8f0] line-clamp-2">{p.idea}</p>
                {p.summary && (
                  <p className="text-xs text-[var(--fog)] mt-1 line-clamp-2 leading-relaxed">{p.summary}</p>
                )}
                <p className="text-xs text-[var(--fog)] mt-2">
                  {new Date(p.created_at).toLocaleString()}
                  {p.has_pdf ? " · PDF ready" : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelect(p)}
                disabled={isLoading}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white shrink-0 disabled:opacity-60 transition-all hover:brightness-110"
                style={{
                  background: "linear-gradient(135deg, #4f8ef7, #7b5ea7)",
                  boxShadow: "0 4px 16px #4f8ef733",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Opening…
                  </>
                ) : (
                  <>
                    <FileText size={16} /> View plan
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
