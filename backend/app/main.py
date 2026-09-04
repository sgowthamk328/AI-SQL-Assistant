from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.chat import router as chat_router
from .routes.customers import router as customer_router
from .routes.products import router as product_router
from .routes.sales import router as sales_router
from .database import Base, engine
from .models import customer_model, product_model, sales_model

app = FastAPI()

# Allow the Next.js frontend (port 3000) to call this API during local development.
# The Next.js API proxy handles most CORS, but this ensures all dev environments work.
# This must be registered before any routes.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8501"],
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)

app.include_router(chat_router)
app.include_router(customer_router)
app.include_router(product_router)
app.include_router(sales_router)

Base.metadata.create_all(bind=engine)

@app.get("/")
def root():
    return {"message": "Welcome to SQL Assistant AI"}