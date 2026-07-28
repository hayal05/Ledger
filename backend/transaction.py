from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field, ConfigDict

from app.models.transaction import TransactionType


class TransactionBase(BaseModel):
    date: date
    description: str = Field(min_length=1, max_length=500)
    type: TransactionType
    amount: Decimal = Field(gt=0, description="Must be a positive number; type indicates direction.")


class TransactionCreate(TransactionBase):
    pass


class TransactionUpdate(BaseModel):
    """All fields optional to support partial updates (PATCH-like semantics via PUT)."""
    date: date | None = None
    description: str | None = Field(default=None, min_length=1, max_length=500)
    type: TransactionType | None = None
    amount: Decimal | None = Field(default=None, gt=0)


class TransactionOut(TransactionBase):
    id: int
    user_id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
