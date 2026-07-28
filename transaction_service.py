from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from app.models.transaction import Transaction
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.transaction import TransactionCreate, TransactionUpdate


class TransactionService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = TransactionRepository(db)

    def list_transactions(self, user_id: int) -> list[Transaction]:
        return self.repo.list_for_user(user_id)

    def get_transaction(self, transaction_id: int, user_id: int) -> Transaction:
        transaction = self.repo.get_for_user(transaction_id, user_id)
        if transaction is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found."
            )
        return transaction

    def create_transaction(self, user_id: int, data: TransactionCreate) -> Transaction:
        return self.repo.create(user_id, data)

    def update_transaction(
        self, transaction_id: int, user_id: int, data: TransactionUpdate
    ) -> Transaction:
        transaction = self.get_transaction(transaction_id, user_id)  # raises 404 + ownership check
        return self.repo.update(transaction, data)

    def delete_transaction(self, transaction_id: int, user_id: int) -> None:
        transaction = self.get_transaction(transaction_id, user_id)  # raises 404 + ownership check
        self.repo.delete(transaction)
