from pydantic import BaseModel

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    question: str
    generated_sql: str
    results: list[dict]
    # Number of self-correction attempts made after the first generation.
    # 0 = succeeded on first try, 1+ = model corrected itself N times.
    retry_count: int