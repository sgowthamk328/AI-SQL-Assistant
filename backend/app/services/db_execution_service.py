from sqlalchemy import text
from sqlalchemy.orm import Session


def execute_sql_query(db: Session, sql_query: str) -> list[dict]:
    result = db.execute(text(sql_query))
    
    rows = []

    for row in result.mappings():
        rows.append(dict(row))

    return rows