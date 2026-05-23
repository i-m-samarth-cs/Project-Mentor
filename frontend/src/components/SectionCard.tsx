"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  icon: string;
  title: string;
  content: string;
  accent?: string;
  defaultOpen?: boolean;
  sectionId?: string;
}

export default function SectionCard({
  icon,
  title,
  content,
  accent = "#4f8ef7",
  defaultOpen = false,
  sectionId,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={sectionId} className="section-card animate-fade-in scroll-mt-24">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left group"
        aria-expanded={open}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span
            className="text-2xl w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
            style={{ background: `${accent}18`, border: `1px solid ${accent}44` }}
          >
            {icon}
          </span>
          <h3
            className="text-lg font-semibold truncate"
            style={{ fontFamily: "'Syne', sans-serif", color: accent }}
          >
            {title}
          </h3>
        </div>
        <span className="text-[var(--fog)] group-hover:text-white transition-colors flex-shrink-0 ml-3">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </span>
      </button>

      {open && (
        <div className="mt-5 pt-5 border-t border-[#2a2a45]">
          <div className="result-prose">
            <ReactMarkdown>{content || "_No content generated._"}</ReactMarkdown>
          </div>
        </div>
      )}
    </section>
  );
}
