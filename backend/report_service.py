"""
Service layer for the dashboard summary and financial reports.

Both dashboard and reports are just different views over the same
aggregate data, so they share one service and the repository's SQL-level
SUM/COUNT queries rather than pulling all rows into Python.
"""
from sqlalchemy.orm import Session

from app.models.transaction import TransactionType
from app.repositories.transaction_repository import TransactionRepository
from app.schemas.report import (
    DashboardSummary,
    IncomeSummary,
    ExpenseSummary,
    ProfitSummary,
)


class ReportService:
    def __init__(self, db: Session):
        self.repo = TransactionRepository(db)

    def _totals(self, user_id: int) -> tuple[float, float]:
        sums = self.repo.sums_for_user(user_id)
        income = sums.get(TransactionType.INCOME.value, 0.0)
        expenses = sums.get(TransactionType.EXPENSE.value, 0.0)
        return income, expenses

    def get_dashboard_summary(self, user_id: int) -> DashboardSummary:
        income, expenses = self._totals(user_id)
        count = self.repo.count_for_user(user_id)
        return DashboardSummary(
            total_income=income,
            total_expenses=expenses,
            net_profit=income - expenses,
            transaction_count=count,
        )

    def get_income_summary(self, user_id: int) -> IncomeSummary:
        income, _ = self._totals(user_id)
        return IncomeSummary(total_income=income)

    def get_expense_summary(self, user_id: int) -> ExpenseSummary:
        _, expenses = self._totals(user_id)
        return ExpenseSummary(total_expenses=expenses)

    def get_profit_summary(self, user_id: int) -> ProfitSummary:
        income, expenses = self._totals(user_id)
        return ProfitSummary(
            total_income=income, total_expenses=expenses, net_profit=income - expenses
        )
