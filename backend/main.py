from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
import os
import pandas as pd
import io

# --- CONFIG & DATABASE ---
# On Render/Railway, we will provide the MONGO_URL via environment variables
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.getenv("DB_NAME", "sunvizors_tour")

client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]
votes_collection = db["votes"]

# --- SCHEMAS ---
class VoteCreate(BaseModel):
    email: EmailStr
    city: str

class VoteUpdate(BaseModel):
    first_name: str
    last_name: str
    phone: str
    venue_proposal: Optional[str] = None
    intentions: List[str] = []
    message: Optional[str] = None

class VoteOut(BaseModel):
    id: str
    email: EmailStr
    city: str
    created_at: datetime
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    venue_proposal: Optional[str] = None
    intentions: Optional[List[str]] = []
    message: Optional[str] = None

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}

# --- DATABASE HELPERS ---
async def get_all_votes() -> List[Dict]:
    cursor = votes_collection.find()
    votes = await cursor.to_list(length=10000)
    for v in votes:
        v["_id"] = str(v["_id"])
    return votes

async def save_vote(vote_data: Dict) -> Dict:
    result = await votes_collection.insert_one(vote_data)
    vote_data["_id"] = str(result.inserted_id)
    return vote_data

async def update_vote(vote_id: str, update_data: Dict) -> Optional[Dict]:
    if not ObjectId.is_valid(vote_id): return None
    result = await votes_collection.update_one({"_id": ObjectId(vote_id)}, {"$set": update_data})
    if result.matched_count == 0: return None
    updated = await votes_collection.find_one({"_id": ObjectId(vote_id)})
    if updated: updated["_id"] = str(updated["_id"])
    return updated

async def find_vote_by_email_city(email: str, city: str) -> Optional[Dict]:
    vote = await votes_collection.find_one({"email": email, "city": city})
    if vote: vote["_id"] = str(vote["_id"])
    return vote

# --- APP ---
app = FastAPI(title="Sunvizors Tour Map API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Sunvizors Tour API is running (MongoDB Monolith)"}

@app.post("/api/vote", response_model=VoteOut)
async def create_vote(vote: VoteCreate):
    existing_vote = await find_vote_by_email_city(vote.email, vote.city)
    if existing_vote:
        existing_vote["id"] = existing_vote["_id"]
        return existing_vote

    new_vote = vote.dict()
    new_vote["created_at"] = datetime.utcnow()
    new_vote.update({
        "first_name": None, "last_name": None, "phone": None,
        "venue_proposal": None, "intentions": [], "message": None
    })
    
    created_vote = await save_vote(new_vote)
    created_vote["id"] = created_vote["_id"]
    return created_vote

@app.put("/api/vote/{vote_id}", response_model=VoteOut)
async def update_vote_details(vote_id: str, details: VoteUpdate):
    update_data = details.dict(exclude_unset=True)
    updated_vote = await update_vote(vote_id, update_data)
    if not updated_vote:
        raise HTTPException(status_code=404, detail="Vote not found")
    updated_vote["id"] = updated_vote["_id"]
    return updated_vote

@app.get("/api/stats")
async def get_stats():
    votes = await get_all_votes()
    city_counts = {}
    for vote in votes:
        city = vote.get("city")
        if city:
            city_counts[city] = city_counts.get(city, 0) + 1
    sorted_cities = sorted(city_counts.items(), key=lambda item: item[1], reverse=True)
    return [{"city": city, "votes": count} for city, count in sorted_cities]

@app.get("/api/votes/{city}")
async def get_city_votes(city: str):
    all_votes = await get_all_votes()
    return [{
        "id": v.get("_id"),
        "email": v.get("email"),
        "first_name": v.get("first_name"),
        "last_name": v.get("last_name"),
        "phone": v.get("phone"),
        "venue_proposal": v.get("venue_proposal"),
        "message": v.get("message"),
        "created_at": v.get("created_at")
    } for v in all_votes if v.get("city") == city]

@app.get("/api/export_csv")
async def export_csv():
    votes_list = await get_all_votes()
    if not votes_list: return Response(content="No data", media_type="text/csv")
    clean_list = []
    for v in votes_list:
        item = v.copy()
        item["id"] = item.get("_id")
        if "_id" in item: del item["_id"]
        clean_list.append(item)
    df = pd.DataFrame(clean_list)
    stream = io.StringIO()
    df.to_csv(stream, index=False)
    response = Response(content=stream.getvalue(), media_type="text/csv")
    response.headers["Content-Disposition"] = "attachment; filename=sunvizors_votes.csv"
    return response
