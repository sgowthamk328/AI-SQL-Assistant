from sqlalchemy import inspect
from ..database import engine

#The engine gives us access to the database, and the inspector lets us discover the 
#database structure dynamically using built-in SQLAlchemy methods such as get_table_names() and get_columns().

def get_database_schema():
    #it is like telling SQLAlchemy,
    #use this database connection and tell me what's inside the database.
    inspector = inspect(engine)

    schema_text = ""

    tables = inspector.get_table_names()

    for table in tables:
        schema_text += f"\nTable: {table}\n"

        columns = inspector.get_columns(table)

        for column in columns:
            column_name = column["name"]
            column_type = str(column["type"])

            schema_text += f"- {column_name} ({column_type})\n"

    return schema_text