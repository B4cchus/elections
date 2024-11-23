from typing import Optional
import os, json, gspread, datetime
from fastapi import FastAPI

app = FastAPI()

gc = gspread.service_account_from_dict(json.loads(os.environ.get('GOOGLE_JSON_KEY')))
sh = gc.open("ElectionsDB")

@app.get("/")
async def root():
    wks.update_acell('A1', str(datetime.datetime.now()))
    return {"message": datetime.datetime.now()}

@app.get("/elections/{election_id}")
async def cands(election_id: str):
    return {"cands": sh.named_range(election_id+"_cds")}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
