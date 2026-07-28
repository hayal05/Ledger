"""
Repository layer for User.

Repositories only talk to the database (via the SQLAlchemy session) and
know nothing about HTTP, JWTs, or password hashing — that logic lives in
the service layer. This keeps data access swappable/testable in isolation.
"""
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.user import User
from app.schemas.user import UserCreate


class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, user_id: int) -> User | None:
        return self.db.get(User, user_id)

    def get_by_email(self, email: str) -> User | None:
        stmt = select(User).where(User.email == email)
        return self.db.execute(stmt).scalar_one_or_none()

    def create(self, user_in: UserCreate, password_hash: str) -> User:
        user = User(
            full_name=user_in.full_name,
            email=user_in.email,
            password_hash=password_hash,
        )
        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)
        return user
