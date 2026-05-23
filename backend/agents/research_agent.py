from agents.base_agent import BaseAgent

class ResearchAgent(BaseAgent):
    system_prompt = (
        "You are a senior market research analyst with expertise in startup ecosystems. "
        "Provide detailed, data-driven, and actionable insights."
    )

    def _build_prompt(self, idea: str) -> str:
        return f"""
For the project idea: "{idea}"

1. PROBLEM STATEMENT
   - Core problem being solved
   - Who faces this problem?
   - Current pain points

2. MARKET RESEARCH
   - Market size (TAM / SAM / SOM)
   - Growth trends
   - Key market segments

3. COMPETITOR ANALYSIS
   Identify 3-5 real competitors. For each:
   - Company name
   - Core features
   - Weaknesses
   - Pricing model
   - Market gap this project exploits

Be specific, structured, and use real-world examples where possible.
"""


class ArchitectureAgent(BaseAgent):
    system_prompt = (
        "You are a principal software architect with 15 years of experience "
        "designing scalable, production-ready systems."
    )

    def _build_prompt(self, idea: str) -> str:
        return f"""
Design a complete technical architecture for: "{idea}"

1. SYSTEM ARCHITECTURE
   - High-level component diagram (text-based)
   - Data flow description
   - Key design decisions

2. DATABASE DESIGN
   - Recommended database(s) and why
   - Core entities / tables
   - Relationships

3. API DESIGN
   - REST or GraphQL? Why?
   - Key endpoints (method + path + description)

4. TECH STACK
   - Frontend framework + reasoning
   - Backend framework + reasoning
   - Infrastructure / cloud services
   - DevOps tooling

5. DEPLOYMENT ARCHITECTURE
   - Hosting strategy
   - CI/CD pipeline
   - Scaling approach
"""


class RoadmapAgent(BaseAgent):
    system_prompt = (
        "You are an experienced technical project manager who creates realistic, "
        "milestone-driven development roadmaps."
    )

    def _build_prompt(self, idea: str) -> str:
        return f"""
Create a detailed 12-week development roadmap for: "{idea}"

For each week provide:
- Week number
- Sprint theme / goal
- Specific tasks (3-5 bullet points)
- Deliverable / milestone

Also include:
RISKS section with top 5 risks + mitigation strategy for each.
DEPLOYMENT PLAN with step-by-step production launch checklist.
COST ESTIMATE (monthly) covering: infrastructure, APIs, team, tools.
FUTURE SCOPE: 3 major feature expansions post-MVP.
"""


class PitchAgent(BaseAgent):
    system_prompt = (
        "You are a startup pitch coach who has helped companies raise Series A funding. "
        "Create compelling, investor-ready pitch deck outlines."
    )

    def _build_prompt(self, idea: str) -> str:
        return f"""
Create a complete pitch deck outline for: "{idea}"

Structure (12 slides):
1. Cover Slide
2. Problem
3. Solution
4. Market Opportunity
5. Product Demo (describe key screens)
6. Business Model
7. Competitor Landscape
8. Traction & Validation
9. Go-To-Market Strategy
10. Team (placeholder roles needed)
11. Financial Projections (3-year high-level)
12. The Ask (funding amount + use of funds)

For each slide: title + 3-5 bullet points of key content.
"""
