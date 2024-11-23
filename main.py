from typing import Optional
import os, json, gspread, datetime
from fastapi import FastAPI

app = FastAPI()

gc = gspread.authorize(os.environ.get('GOOGLE_JSON_KEY'))
wks = gspread.open("ElectcionsDB").sheet1

@app.get("/")
async def root():
    wks.update_acell('A1', datetime.datetime.now())
    return {"message": datetime.datetime.now()}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
