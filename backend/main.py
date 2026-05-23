import os, json
from pathlib import Path
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session

from config import settings
from database import init_db, get_db, save_project, list_projects
from mentor import generate_plan
from models.schemas import ProjectRequest
from tools.llm import LLMError

BACKEND_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Autonomous Project Mentor API", version="1.0.0")


def resolve_pdf_path(pdf_path: str | None) -> str | None:
    """Resolve PDF path relative to backend/ so checks work from any cwd."""
    if not pdf_path:
        return None
    p = Path(pdf_path)
    if not p.is_absolute():
        p = BACKEND_DIR / p
    return str(p) if p.exists() else None

# CORS – allow the Next.js dev server (localhost and 127.0.0.1)
_CORS_ORIGINS = list({
    f"http://localhost:{settings.frontend_port}",
    f"http://127.0.0.1:{settings.frontend_port}",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
})
app.add_middleware(
    CORSMiddleware,
    allow_origins=_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)


@app.exception_handler(LLMError)
async def llm_error_handler(_request: Request, exc: LLMError):
    return JSONResponse(status_code=502, content={"detail": str(exc)})


@app.on_event("startup")
def startup():
    init_db()
    os.makedirs("outputs", exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok", "model": settings.model}


@app.post("/mentor")
def mentor(req: ProjectRequest, db: Session = Depends(get_db)):
    if not req.idea.strip():
        raise HTTPException(status_code=400, detail="Idea cannot be empty.")
    try:
        result = generate_plan(req.idea.strip())
    except LLMError as e:
        raise HTTPException(status_code=502, detail=str(e)) from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Plan generation failed: {e}") from e
    record = save_project(db, req.idea, result)
    result["id"] = record.id
    result["has_pdf"] = resolve_pdf_path(result.get("pdf_path")) is not None
    return result


@app.get("/projects")
def get_projects(db: Session = Depends(get_db)):
    records = list_projects(db)
    projects = []
    for r in records:
        try:
            data = json.loads(r.result_json)
        except Exception:
            data = {}
        resolved_pdf = resolve_pdf_path(data.get("pdf_path"))
        projects.append({
            "id":         r.id,
            "idea":       r.idea,
            "created_at": r.created_at.isoformat(),
            "summary":    (data.get("problem_statement") or "")[:200],
            "has_pdf":    resolved_pdf is not None,
            "plan":       data,
        })
    return projects


@app.get("/projects/{project_id}")
def get_project(project_id: int, db: Session = Depends(get_db)):
    from database import ProjectRecord
    record = db.query(ProjectRecord).filter(ProjectRecord.id == project_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Project not found.")
    try:
        data = json.loads(record.result_json)
    except Exception:
        raise HTTPException(status_code=500, detail="Stored project data is invalid.")
    data["id"] = record.id
    data["idea"] = record.idea
    data["has_pdf"] = resolve_pdf_path(data.get("pdf_path")) is not None
    return data


@app.get("/projects/{project_id}/pdf")
def download_pdf(project_id: int, db: Session = Depends(get_db)):
    from database import ProjectRecord
    record = db.query(ProjectRecord).filter(ProjectRecord.id == project_id).first()
    if not record:
        raise HTTPException(status_code=404, detail="Project not found.")
    data = json.loads(record.result_json)
    pdf_path = resolve_pdf_path(data.get("pdf_path"))
    if not pdf_path:
        raise HTTPException(status_code=404, detail="PDF not found for this project.")
    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename=os.path.basename(pdf_path),
    )
