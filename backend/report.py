from pydantic import BaseModel


class DashboardSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_profit: float
    transaction_count: int


class IncomeSummary(BaseModel):
    total_income: float


class ExpenseSummary(BaseModel):
    total_expenses: float


class ProfitSummary(BaseModel):
    total_income: float
    total_expenses: float
    net_profit: float
