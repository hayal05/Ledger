"""
Repository layer for Transaction.

Every query is scoped to `user_id` so one user can never read, edit, or
delete another user's transactions purely at the data-access level —
this is enforced here rather than trusted to callers.
"""
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models.transaction import Transaction, TransactionType
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionRepository:
    def __init__(self, db: Session):
        self.db = db

    def list_for_user(self, user_id: int) -> list[Transaction]:
        stmt = (
            select(Transaction)
            .where(Transaction.user_id == user_id)
            .order_by(Transaction.date.desc(), Transaction.id.desc())
        )
        return list(self.db.execute(stmt).scalars().all())

    def get_for_user(self, transaction_id: int, user_id: int) -> Transaction | None:
        stmt = select(Transaction).where(
            Transaction.id == transaction_id, Transaction.user_id == user_id
        )
        return self.db.execute(stmt).scalar_one_or_none()

    def create(self, user_id: int, data: TransactionCreate) -> Transaction:
        transaction = Transaction(user_id=user_id, **data.model_dump())
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def update(self, transaction: Transaction, data: TransactionUpdate) -> Transaction:
        updates = data.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(transaction, field, value)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def delete(self, transaction: Transaction) -> None:
        self.db.delete(transaction)
        self.db.commit()

    def sums_for_user(self, user_id: int) -> dict[str, float]:
        """Returns aggregate totals used by both the dashboard and reports."""
        stmt = (
            select(Transaction.type, func.coalesce(func.sum(Transaction.amount), 0))
            .where(Transaction.user_id == user_id)
            .group_by(Transaction.type)
        )
        rows = self.db.execute(stmt).all()
        totals = {TransactionType.INCOME.value: 0.0, TransactionType.EXPENSE.value: 0.0}
        for tx_type, total in rows:
            totals[tx_type.value if hasattr(tx_type, "value") else tx_type] = float(total)
        return totals

    def count_for_user(self, user_id: int) -> int:
        stmt = select(func.count()).select_from(Transaction).where(Transaction.user_id == user_id)
        return self.db.execute(stmt).scalar_one()
