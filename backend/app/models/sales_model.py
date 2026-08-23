from ..database import Base
from sqlalchemy import Column, Integer,ForeignKey, DateTime, Float

class Sales(Base):
    __tablename__="sales"
    id=Column(Integer,primary_key=True,index=True)
    customer_id=Column(Integer, ForeignKey('customers.id'))
    product_id=Column(Integer, ForeignKey('products.id'))
    quantity=Column(Integer)
    total_amount=Column(Float)
    sale_date=Column(DateTime)