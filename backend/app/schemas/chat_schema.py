from pydantic import BaseModel

class ChatRequest(BaseModel):
    question:str
    
class ChatResponse(BaseModel):
    question:str
    generated_sql:str
    results:list[dict]