from ..database import Base
from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime

class Customer(Base):
    __tablename__="customers"
    id=Column(Integer,primary_key=True,index=True)
    name=Column(String)
    email=Column(String)
    city=Column(String)
    created_at=Column(DateTime, default=datetime.utcnow)