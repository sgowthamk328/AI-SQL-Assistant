from pydantic import BaseModel
from datetime import datetime
from typing import Optional


class CustomerCreate(BaseModel):
    name: str
    email: str
    city: str

class CustomerResponse(BaseModel):
    id: int
    name: str
    email: str
    city: str
    created_at:datetime
    
    class Config:
        form_attributes=True

class CustomerUpdate(BaseModel):
    name:Optional[str]=None
    email:Optional[str]=None
    city:Optional[str]=None

