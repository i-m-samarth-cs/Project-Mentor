"""
Orchestrates all agents to produce a full project plan.
"""
from agents.research_agent import (
    ResearchAgent, ArchitectureAgent, RoadmapAgent, PitchAgent
)
from tools.pdf_generator import generate_pdf


def parse_sections(raw: str, keys: list) -> dict:
    """Very simple section parser – splits on numbered headings."""
    result = {k: raw for k in keys}   # fallback: entire text per key
    return result


def generate_plan(idea: str) -> dict:
    # ── Run agents ────────────────────────────────────────────────────────────
    research_raw     = ResearchAgent().run(idea)
    architecture_raw = ArchitectureAgent().run(idea)
    roadmap_raw      = RoadmapAgent().run(idea)
    pitch_raw        = PitchAgent().run(idea)

    # ── Parse each agent's output into named sections ─────────────────────────
    def extract(text: str, marker: str) -> str:
        """Extract content after a numbered or ALL-CAPS section heading."""
        lines  = text.split("\n")
        result = []
        inside = False
        for line in lines:
            upper = line.upper()
            if marker.upper() in upper and (line.strip()[0].isdigit() or upper == line.strip()):
                inside = True
                continue
            if inside:
                # stop at next numbered heading
                if line.strip() and line.strip()[0].isdigit() and line.strip()[1] in ".):":
                    break
                result.append(line)
        return "\n".join(result).strip() or text   # fallback to full text

    # research sections
    problem_statement   = extract(research_raw, "PROBLEM STATEMENT")
    market_research     = extract(research_raw, "MARKET RESEARCH")
    competitor_analysis = extract(research_raw, "COMPETITOR ANALYSIS")

    # architecture sections
    architecture = extract(architecture_raw, "SYSTEM ARCHITECTURE")
    tech_stack   = extract(architecture_raw, "TECH STACK")
    deployment   = extract(architecture_raw, "DEPLOYMENT ARCHITECTURE")

    # roadmap sections
    roadmap      = extract(roadmap_raw, "WEEK")
    risks        = extract(roadmap_raw, "RISKS")
    cost         = extract(roadmap_raw, "COST ESTIMATE")
    future_scope = extract(roadmap_raw, "FUTURE SCOPE")

    # If extraction fails, use full raw
    if not roadmap:   roadmap = roadmap_raw
    if not risks:     risks   = roadmap_raw
    if not cost:      cost    = roadmap_raw

    result = {
        "idea":                idea,
        "problem_statement":   problem_statement   or research_raw,
        "market_research":     market_research     or research_raw,
        "competitor_analysis": competitor_analysis or research_raw,
        "architecture":        architecture        or architecture_raw,
        "tech_stack":          tech_stack          or architecture_raw,
        "roadmap":             roadmap,
        "risks":               risks,
        "deployment_plan":     deployment          or architecture_raw,
        "cost_estimate":       cost,
        "future_scope":        future_scope        or roadmap_raw,
        "pitch_deck":          pitch_raw,
    }

    # ── Generate PDF ──────────────────────────────────────────────────────────
    try:
        pdf_path = generate_pdf(result)
        result["pdf_path"] = pdf_path
    except Exception as e:
        result["pdf_path"] = None
        result["pdf_error"] = str(e)

    return result
