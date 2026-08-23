from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

# creates a connection to the database
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# factory for creating new database sessions which uses the engine to talk to the db and perform queries
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=engine)

# it is the registry where you define table models
Base = declarative_base()

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()