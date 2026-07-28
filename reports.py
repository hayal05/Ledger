from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.core.database import get_db
from app.models.user import User
from app.schemas.report import IncomeSummary, ExpenseSummary, ProfitSummary
from app.services.report_service import ReportService

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/income", response_model=IncomeSummary)
def income_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService(db).get_income_summary(current_user.id)


@router.get("/expenses", response_model=ExpenseSummary)
def expense_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService(db).get_expense_summary(current_user.id)


@router.get("/profit", response_model=ProfitSummary)
def profit_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return ReportService(db).get_profit_summary(current_user.id)
