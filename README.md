# Autonomous Project Mentor

## Quick Start

```bash
# 1 – Start everything at once
./start-all.sh

# 2 – Or start separately
./start-backend.sh    # Terminal 1
./start-frontend.sh   # Terminal 2
```

Open: http://localhost:3000

## Architecture

```
project-mentor/
├── backend/
│   ├── main.py          – FastAPI app + routes
│   ├── mentor.py        – Agent orchestrator
│   ├── config.py        – Settings (reads .env)
│   ├── database.py      – SQLite + SQLAlchemy
│   ├── agents/
│   │   ├── base_agent.py
│   │   └── research_agent.py  – 4 agents inside
│   ├── tools/
│   │   ├── llm.py             – OpenRouter wrapper
│   │   └── pdf_generator.py
│   └── models/
│       └── schemas.py
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── layout.tsx
│       │   ├── page.tsx        – Main UI
│       │   └── globals.css
│       ├── components/
│       │   ├── SectionCard.tsx
│       │   ├── Loader.tsx
│       │   └── HistoryPanel.tsx
│       └── lib/
│           └── api.ts
├── data/               – SQLite DB lives here
├── start-backend.sh
├── start-frontend.sh
└── start-all.sh
```

## Agents

| Agent | Role |
|---|---|
| ResearchAgent | Problem statement, market research, competitor analysis |
| ArchitectureAgent | System design, tech stack, deployment |
| RoadmapAgent | 12-week roadmap, risks, cost, future scope |
| PitchAgent | Investor pitch deck outline |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| GET | /health | Health check |
| POST | /mentor | Generate full project plan |
| GET | /projects | List saved projects |
| GET | /projects/{id}/pdf | Download PDF for a project |
