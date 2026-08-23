from ollama import chat
from .schema_service import get_database_schema
def generate_sql_from_question(question):
    schema = get_database_schema()
    response = chat(model="sqlcoder:latest",messages=[
    {"role":"user",
    "content":f"""You are a SQL generation assistant.
    Return only SQL.
    Use the schema given below to write the SQL queries
    Do not explain.
    Do not ask questions.

    Question:
    {question}
    Database Schema:
    {schema}"""}
    ])
    return response.message.content