from typing import Optional
import os, json, gspread, datetime
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")

gc = gspread.service_account_from_dict(json.loads(os.environ.get('GOOGLE_JSON_KEY')))
sh = gc.open("ElectionsDB")

#Root endpoint does nothing for now except record date of access in the DB
@app.get("/")
async def root():
    sh.sheet1.update_acell('A1', str(datetime.datetime.now()))
    return {"message": datetime.datetime.now()}

@app.get("/vote")
async def vote(election_id: str = "test_election"):
    cds = ",".join(cd.value for cd in sh.named_range(election_id+"_cds"))
    return RedirectResponse(url="/static/index.html?cds="+cds+"&id="+election_id)

@app.get("/view")
async def cands(election_id: str = "test_election"):
    return {"candidates": [cd.value for cd in sh.named_range(election_id+"_cds")],
            "voters": [cd.value for cd in sh.named_range(election_id+"_vrs")]}

@app.post("/submit_vote", status_code=201)
async def submit_vote(election_id: str, cds: str):
    start = sh.worksheet("Results").find(election_id)
    response = sh.values_append("Results!"+start.address, {"value_input_option": "RAW"}, {"values": [[cds]]})
    return response