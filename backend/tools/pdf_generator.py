"""
Generates a multi-section PDF report from a ProjectResponse dict.
"""
import os, textwrap
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, HRFlowable
)
from reportlab.lib.enums import TA_LEFT, TA_CENTER

ACCENT = colors.HexColor("#1a73e8")
DARK   = colors.HexColor("#1e1e2e")

SECTIONS = [
    ("Problem Statement",   "problem_statement"),
    ("Market Research",     "market_research"),
    ("Competitor Analysis", "competitor_analysis"),
    ("Architecture",        "architecture"),
    ("Tech Stack",          "tech_stack"),
    ("Development Roadmap", "roadmap"),
    ("Risks",               "risks"),
    ("Deployment Plan",     "deployment_plan"),
    ("Cost Estimate",       "cost_estimate"),
    ("Future Scope",        "future_scope"),
    ("Pitch Deck Outline",  "pitch_deck"),
]


def generate_pdf(data: dict, output_dir: str = "outputs") -> str:
    os.makedirs(output_dir, exist_ok=True)
    filename  = f"project_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.pdf"
    filepath  = os.path.join(output_dir, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize=A4,
        leftMargin=2*cm, rightMargin=2*cm,
        topMargin=2*cm,  bottomMargin=2*cm,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle("Title2",
        fontSize=24, textColor=ACCENT, spaceAfter=6,
        fontName="Helvetica-Bold", alignment=TA_CENTER)
    sub_style = ParagraphStyle("Sub",
        fontSize=11, textColor=colors.grey,
        fontName="Helvetica", alignment=TA_CENTER, spaceAfter=20)
    h2_style = ParagraphStyle("H2",
        fontSize=15, textColor=DARK,
        fontName="Helvetica-Bold", spaceBefore=14, spaceAfter=6)
    body_style = ParagraphStyle("Body2",
        fontSize=10, leading=15, textColor=DARK,
        fontName="Helvetica", spaceAfter=8)

    story = []
    # Cover
    story.append(Spacer(1, 2*cm))
    story.append(Paragraph("Autonomous Project Mentor", title_style))
    story.append(Paragraph(f"<b>Project Idea:</b> {data.get('idea','')}", sub_style))
    story.append(Paragraph(datetime.now().strftime("%B %d, %Y"), sub_style))
    story.append(HRFlowable(width="100%", thickness=1, color=ACCENT))
    story.append(PageBreak())

    for label, key in SECTIONS:
        content = data.get(key, "")
        story.append(Paragraph(label, h2_style))
        story.append(HRFlowable(width="100%", thickness=0.5, color=colors.lightgrey))
        story.append(Spacer(1, 0.2*cm))
        for line in content.split("\n"):
            line = line.strip()
            if line:
                safe = line.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
                story.append(Paragraph(safe, body_style))
        story.append(Spacer(1, 0.4*cm))

    doc.build(story)
    return filepath
