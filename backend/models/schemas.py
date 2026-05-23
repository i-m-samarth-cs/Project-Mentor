from pydantic import BaseModel
from typing import Optional

class ProjectRequest(BaseModel):
    idea: str

class AgentResult(BaseModel):
    section: str
    content: str

class ProjectResponse(BaseModel):
    idea: str
    problem_statement: str
    market_research: str
    competitor_analysis: str
    architecture: str
    tech_stack: str
    roadmap: str
    risks: str
    deployment_plan: str
    cost_estimate: str
    future_scope: str
    pitch_deck: str
    pdf_path: Optional[str] = None
