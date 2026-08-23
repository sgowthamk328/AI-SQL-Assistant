from pydantic import BaseModel

class ProductCreate(BaseModel):
    name:str
    category:str
    price:float

class ProductResponse(BaseModel):
    id:int
    name:str
    category:str
    price:float

    class Config:
        form_attributes=True