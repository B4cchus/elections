from typing import Optional
import os, json, gspread, datetime
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

gc = gspread.service_account_from_dict(json.loads(os.environ.get('GOOGLE_JSON_KEY')))
sh = gc.open("ElectionsDB")

@app.get("/")
async def root():
    sh.sheet1.update_acell('A1', str(datetime.datetime.now()))
    return {"message": datetime.datetime.now()}

@app.get("/vote")
async def vote(election_id: str = "test_election"):
    return {"Nothing here": None}

@app.get("/view")
async def cands(election_id: str = "test_election"):
    return {"cands": sh.named_range(election_id+"_cds"), "vrs": sh.named_range(election_id+"_vrs")}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
