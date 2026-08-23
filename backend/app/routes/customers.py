from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from typing import Annotated
from ..models.customer_model import Customer
from ..schemas.customer_schema import CustomerCreate,CustomerResponse,CustomerUpdate

router = APIRouter(
    prefix="/customers",
    tags=["Customers"]
)

db_dependency = Annotated[Session, Depends(get_db)]

@router.get("/", response_model=list[CustomerResponse])
def get_all_customers(db:db_dependency):
    customers=db.query(Customer).all()
    return customers


@router.get("/{customer_id}", response_model=CustomerResponse)
def get_customer(customer_id:int, db:db_dependency):
    customer=db.query(Customer).filter(Customer.id==customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@router.post("/",response_model=CustomerResponse)
def create_customer(customer:CustomerCreate, db:db_dependency):
    new_customer = Customer(name=customer.name, email=customer.email, city=customer.city)
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return new_customer

@router.patch("/{customer_id}", response_model=CustomerResponse)
def customer_update(customer_id:int, customer:CustomerUpdate, db:db_dependency):
    curr_customer=db.query(Customer).filter(Customer.id==customer_id).first()
    if not curr_customer:
        raise HTTPException(status_code=404, detail="Customer Not Found")
    data = customer.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(curr_customer,key,value)
    db.commit()
    db.refresh(curr_customer)
    return curr_customer

@router.delete("/{customer_id}")
def customer_delete(customer_id:int, db:db_dependency):
    customer=db.query(Customer).filter(Customer.id==customer_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer Not Found")
    db.delete(customer)
    db.commit()
    return customer