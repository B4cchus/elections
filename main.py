from typing import Optional
import os, json
from fastapi import FastAPI

app = FastAPI()

sheets_key = os.environ.get('GOOGLE_JSON_KEY')
key_data = json.loads(sheets_key)

@app.get("/")
async def root():
    return {"message": {"Hello World", key_data["type"]}}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
