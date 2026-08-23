# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from typing import Annotated
from ..models.sales_model import Sales
from ..schemas.sales_schema import SalesResponse,SalesCreate

db_dependency=Annotated[Session, Depends(get_db)]

router=APIRouter(
    prefix="/sales",
    tags=["Sales"]
)

@router.get("/", response_model=list[SalesResponse])
def get_all_sales(db:db_dependency):
    sales=db.query(Sales).all()
    return sales

@router.post("/",response_model=SalesResponse)
def create_sales(sales:SalesCreate,db:db_dependency):
    new_sales = Sales(
        customer_id=sales.customer_id,
        product_id=sales.product_id,
        quantity=sales.quantity,
        total_amount=sales.total_amount,
        sale_date=sales.sale_date
    )
    db.add(new_sales)
    db.commit()
    db.refresh(new_sales)
    return new_sales