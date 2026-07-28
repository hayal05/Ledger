from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import Base, engine
from app.api.routes import auth as auth_routes
from app.api.routes import transactions as transactions_routes
from app.api.routes import dashboard as dashboard_routes
from app.api.routes import reports as reports_routes

# Import models so their tables are registered on Base.metadata before create_all.
from app.models import user, transaction  # noqa: F401

app = FastAPI(title=settings.PROJECT_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup():
    # MVP approach: auto-create tables if they don't exist.
    # For production hardening in v2, replace with Alembic migrations.
    Base.metadata.create_all(bind=engine)


@app.get("/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}


app.include_router(auth_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(transactions_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(dashboard_routes.router, prefix=settings.API_V1_PREFIX)
app.include_router(reports_routes.router, prefix=settings.API_V1_PREFIX)
