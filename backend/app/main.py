from fastapi import FastAPI
from .routes.chat import router as chat_router
from .routes.customers import router as customer_router
from .routes.products import router as product_router
from .routes.sales import router as sales_router
from .database import Base,engine
from .models import customer_model,product_model,sales_model

app=FastAPI()

app.include_router(chat_router)
app.include_router(customer_router)
app.include_router(product_router)
app.include_router(sales_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message":"Welcome to SQL Assistant AI "}