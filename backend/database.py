import os, json
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker

os.makedirs("data", exist_ok=True)

from config import settings

engine = create_engine(
    settings.database_url,
    connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


class ProjectRecord(Base):
    __tablename__ = "projects"
    id          = Column(Integer, primary_key=True, index=True)
    idea        = Column(String(500))
    result_json = Column(Text)
    created_at  = Column(DateTime, default=datetime.utcnow)


def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def save_project(db, idea: str, result: dict):
    record = ProjectRecord(idea=idea, result_json=json.dumps(result))
    db.add(record)
    db.commit()
    db.refresh(record)
    return record


def list_projects(db):
    return db.query(ProjectRecord).order_by(ProjectRecord.created_at.desc()).all()
