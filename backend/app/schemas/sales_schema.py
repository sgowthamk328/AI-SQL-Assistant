from datetime import datetime
from pydantic import BaseModel

class SalesCreate(BaseModel):
    customer_id:int
    product_id:int
    quantity:int
    total_amount:float
    sale_date:datetime

class SalesResponse(BaseModel):
    id:int
    customer_id:int
    product_id:int
    quantity:int
    total_amount:float
    sale_date:datetime

    class Config:
        form_attributes=True