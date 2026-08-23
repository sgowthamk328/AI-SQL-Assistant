# pyrefly: ignore [missing-import]
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from typing import Annotated
from ..models.product_model import Product
from ..schemas.product_schema import ProductCreate,ProductResponse

db_dependency=Annotated[Session, Depends(get_db)]

router=APIRouter(
    prefix="/products",
    tags=["Products"]
)

@router.get("/", response_model=list[ProductResponse])
def get_all_products(db:db_dependency):
    products=db.query(Product).all()
    return products

@router.post("/",response_model=ProductResponse)
def create_product(product:ProductCreate,db:db_dependency):
    new_product = Product(
        name=product.name,
        category=product.category,
        price=product.price
    )
    db.add(new_product)
    db.commit()
    db.refresh(new_product)
    return new_product