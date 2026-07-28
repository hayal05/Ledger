"""
Centralized application settings.

All configuration is loaded from environment variables (see .env.example).
Never hardcode secrets or connection strings elsewhere in the codebase —
import `settings` from this module instead.
"""
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # Database
    DATABASE_URL: str

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # CORS - comma separated string of origins, parsed into a list
    CORS_ORIGINS: str = "http://localhost:5173"

    # App
    ENVIRONMENT: str = "development"
    PROJECT_NAME: str = "LedgerPro"
    API_V1_PREFIX: str = "/api/v1"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins_list(self) -> list[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Cached settings accessor so the .env file is parsed only once."""
    return Settings()


settings = get_settings()
