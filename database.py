"""
Database engine and session management.

Provides:
- `engine`: the SQLAlchemy engine bound to the configured DATABASE_URL (Neon Postgres)
- `SessionLocal`: a session factory for creating DB sessions
- `Base`: the declarative base all ORM models inherit from
- `get_db`: a FastAPI dependency that yields a request-scoped session
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

from app.core.config import settings

# `pool_pre_ping` avoids stale-connection errors, which matters for
# serverless Postgres providers like Neon that can close idle connections.
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    future=True,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine, future=True)

Base = declarative_base()


def get_db():
    """FastAPI dependency that provides a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
