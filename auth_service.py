"""
Service layer for authentication.

Services orchestrate repositories + security utilities and enforce
business rules (e.g. "email must be unique", "credentials must match").
Routes should stay thin and delegate here.
"""
from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.core.security import hash_password, verify_password, create_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.user import UserCreate, UserLogin


class AuthService:
    def __init__(self, db: Session):
        self.db = db
        self.user_repo = UserRepository(db)

    def register(self, user_in: UserCreate) -> User:
        existing = self.user_repo.get_by_email(user_in.email)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="An account with this email already exists.",
            )
        password_hash = hash_password(user_in.password)
        return self.user_repo.create(user_in, password_hash)

    def authenticate(self, credentials: UserLogin) -> User:
        user = self.user_repo.get_by_email(credentials.email)
        if not user or not verify_password(credentials.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password.",
            )
        return user

    def login(self, credentials: UserLogin) -> tuple[User, str]:
        user = self.authenticate(credentials)
        token = create_access_token(subject=str(user.id))
        return user, token
