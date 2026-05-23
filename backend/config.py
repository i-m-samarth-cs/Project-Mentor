from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    openrouter_api_key: str
    backend_port: int = 8000
    frontend_port: int = 3000
    model: str = "openai/gpt-4o"
    database_url: str = "sqlite:///./data/projects.db"

    class Config:
        env_file = ".env"

settings = Settings()
