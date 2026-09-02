from sqlalchemy import inspect
from ..database import engine

# The engine gives us access to the database, and the inspector lets us discover the
# database structure dynamically using built-in SQLAlchemy methods such as
# get_table_names(), get_columns(), get_pk_constraint(), and get_foreign_keys().

def get_database_schema() -> str:
    """
    Dynamically inspects the connected database and returns a structured schema
    string that includes:
      - All tables with their columns, data types, and PK/FK annotations
      - A dedicated Relationships section listing all foreign key links

    This enriched context allows the LLM to correctly construct multi-table JOINs.
    """
    inspector = inspect(engine)
    tables = inspector.get_table_names()

    schema_text = ""
    all_relationships = []

    for table in tables:
        schema_text += f"\nTable: {table}\n"

        # --- Collect primary key column names for this table ---
        pk_info = inspector.get_pk_constraint(table)
        pk_columns = set(pk_info.get("constrained_columns", []))

        # --- Collect foreign key info keyed by column name ---
        foreign_keys = inspector.get_foreign_keys(table)
        fk_map = {}
        for fk in foreign_keys:
            for col in fk["constrained_columns"]:
                referred_table = fk["referred_table"]
                referred_col = fk["referred_columns"][0]
                fk_map[col] = f"{referred_table}.{referred_col}"
                # Accumulate for the Relationships section
                all_relationships.append(
                    f"  - {table}.{col} → {referred_table}.{referred_col}"
                )
        # --- Build column lines with PK / FK annotations ---
        columns = inspector.get_columns(table)
        for column in columns:
            column_name = column["name"]
            column_type = str(column["type"])

            annotations = []
            if column_name in pk_columns:
                annotations.append("PK")
            if column_name in fk_map:
                annotations.append(f"FK → {fk_map[column_name]}")

            annotation_str = f"  [{', '.join(annotations)}]" if annotations else ""
            schema_text += f"  - {column_name} ({column_type}){annotation_str}\n"

    # --- Append a dedicated Relationships section ---
    if all_relationships:
        schema_text += "\nRelationships (Foreign Keys):\n"
        schema_text += "\n".join(all_relationships) + "\n"

    return schema_text