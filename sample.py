from ollama import chat


print("hello")
response = chat(model="sqlcoder:latest",messages=[
    {"role":"user",
    "content":"""You are a SQL generation assistant.
    Return only SQL.
    Do not explain.
    Do not ask questions.

    Question:
    Get me the top 5 customers from sales."""}
])

print(response.message.content)