from ollama import chat
from .schema_service import get_database_schema

# Maximum number of tokens the model is allowed to generate.
# Keeping this tight prevents the model from adding explanations after the SQL.
_MAX_TOKENS = 300

def build_prompt(question: str, schema: str) -> list[dict]:
    """
    Constructs the message list for the Ollama chat API.

    Uses a system + user role split:
      - system: standing rules the model must always follow
      - user:   the actual question + schema context for this request

    This separation helps instruction-tuned models (like sqlcoder) reliably
    follow the rules across all requests.
    """
    system_message = {
        "role": "system",
        "content": (
            "You are an expert SQL generation assistant. "
            "Your only job is to convert a natural language question into a valid SQL SELECT query.\n\n"
            "STRICT RULES — you must follow every rule below without exception:\n"
            "1. Return ONLY the raw SQL query. No markdown, no backticks, no explanation, no comments.\n"
            "2. Only generate SELECT statements. Never use INSERT, UPDATE, DELETE, DROP, ALTER, or TRUNCATE.\n"
            "3. Every table alias used in SELECT, WHERE, JOIN ON, or ORDER BY MUST have a corresponding "
            "FROM or JOIN clause. Never reference an alias that is not declared.\n"
            "4. Always qualify column names with their table alias (e.g., c.name, not just name) "
            "to avoid ambiguity.\n"
            "5. For questions that involve multiple tables, always identify the correct bridge table "
            "using the Relationships section in the schema before writing any JOIN.\n"
            "6. Use only table names and column names that exist exactly as listed in the schema.\n"
            "7. If a column is a foreign key (marked FK), use it in a JOIN ON clause — "
            "do not filter on it directly unless the question specifically asks for an ID.\n"
        )
    }

    user_message = {
        "role": "user",
        "content": (
            f"Database Schema:\n{schema}\n\n"
            "--- EXAMPLE ---\n"
            "Question: Show me the names of customers who bought products in the Electronics category.\n"
            "SQL: SELECT c.name\n"
            "     FROM customers c\n"
            "     JOIN sales s ON c.id = s.customer_id\n"
            "     JOIN products p ON s.product_id = p.id\n"
            "     WHERE LOWER(p.category) = 'electronics';\n"
            "--- END EXAMPLE ---\n\n"
            f"Now answer this question using the schema above.\n"
            f"Question: {question}\n"
            "SQL:"
        )
    }

    return [system_message, user_message]


def _build_correction_prompt(
    question: str,
    schema: str,
    failed_sql: str,
    error_message: str,
) -> list[dict]:
    """
    Constructs the correction prompt sent to the model when a previously
    generated SQL query fails at execution time.

    Feeds back:
      - The original user question (so the model knows the intent)
      - The full DB schema (so the model can re-inspect relationships)
      - The exact SQL that failed (so the model knows what to fix)
      - The exact database error message (the model's self-diagnosis input)

    The model is instructed to return ONLY the corrected SQL, nothing else.
    """
    system_message = {
        "role": "system",
        "content": (
            "You are an expert SQL correction assistant. "
            "A SQL query was generated but failed when executed against the database. "
            "Your job is to analyse the error, fix the SQL, and return only the corrected query.\n\n"
            "STRICT RULES:\n"
            "1. Return ONLY the corrected raw SQL. No markdown, no backticks, no explanation.\n"
            "2. Only return a SELECT statement.\n"
            "3. Every table alias used in SELECT, WHERE, or JOIN ON must have a "
            "corresponding FROM or JOIN clause.\n"
            "4. Use only table and column names that exist in the schema provided.\n"
        ),
    }

    user_message = {
        "role": "user",
        "content": (
            f"Database Schema:\n{schema}\n\n"
            f"Original Question: {question}\n\n"
            f"Failed SQL:\n{failed_sql}\n\n"
            f"Database Error:\n{error_message}\n\n"
            "Analyse the error above, identify what is wrong in the SQL, "
            "and return the corrected SQL query.\n"
            "Corrected SQL:"
        ),
    }

    return [system_message, user_message]


def generate_sql_from_question(question: str) -> str:
    """
    Calls the local sqlcoder model via Ollama and returns a generated SQL query
    for the given natural language question.

    The enriched schema (with PK/FK annotations and a Relationships section)
    and structured prompt rules give the model the full context it needs to
    produce correct multi-table JOIN queries.
    """
    schema = get_database_schema()
    messages = build_prompt(question, schema)

    response = chat(
        model="sqlcoder:latest",
        messages=messages,
        options={"num_predict": _MAX_TOKENS},
    )

    return (response.message.content or "").strip()


def generate_corrected_sql(
    question: str,
    failed_sql: str,
    error_message: str,
) -> str:
    """
    Calls the sqlcoder model with a targeted correction prompt that includes
    the failed SQL and the exact database error message.

    Called by the retry loop in chat.py when execute_sql_query raises an
    exception, allowing the agent to self-heal without human intervention.
    """
    schema = get_database_schema()
    messages = _build_correction_prompt(question, schema, failed_sql, error_message)

    response = chat(
        model="sqlcoder:latest",
        messages=messages,
        options={"num_predict": _MAX_TOKENS},
    )

    return (response.message.content or "").strip()
