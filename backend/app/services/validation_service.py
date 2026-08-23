def validate_sql(query:str)->bool:
    sql_query=query.strip().upper()
    forbidden_keywords=[
        "DROP",
        "DELETE",
        "UPDATE",
        "TRUNCATE",
        "INSERT",
        "ALTER"
    ]

    if not sql_query.startswith("SELECT"):
        return False
    for keyword in forbidden_keywords:
        if keyword in sql_query:
            return False
    return True
