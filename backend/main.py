import os

from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import datetime

from database import engine, Base, get_db
import models
import schemas
from schemas import str_to_list, list_to_str

def get_cors_origins():
    raw_origins = os.getenv(
        "CORS_ORIGINS",
        "http://localhost:3000,http://localhost:8080,http://localhost:5173",
    )
    return [origin.strip() for origin in raw_origins.split(",") if origin.strip()]


# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title=os.getenv("API_TITLE", "MediLens AI Backend"))

# Add CORS Middleware to support Flutter web/simulator requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event to populate seed data
@app.on_event("startup")
def startup_populate_data():
    db = next(get_db())
    
    # 1. Create Mock User if not exists
    user = db.query(models.User).filter_by(email="alex.rivera@medilens.com").first()
    if not user:
        user = models.User(
            name="Alex Rivera",
            email="alex.rivera@medilens.com",
            blood_type="O+ Positive",
            weight="72 kg",
            allergies="Penicillin,Sulfa drugs"
        )
        db.add(user)
        db.commit()

    # 2. Create Initial Paracetamol Medicine if none exist
    med = db.query(models.Medicine).filter_by(name="Paracetamol").first()
    if not med:
        med = models.Medicine(
            name="Paracetamol",
            dosage="500 mg",
            frequency="Twice daily",
            instructions="Take after meals with warm water.",
            image_asset="assets/images/medicine_details.png",
            side_effects="Nausea or stomach discomfort,Allergic skin rash (rare),Drowsiness if combined with certain medications",
            warnings="Do not exceed 4,000 mg (8 tablets of 500 mg) in 24 hours.,Avoid alcohol consumption while taking this medication as it increases the risk of liver toxicity.,Consult doctor if fever persists for more than 3 days.",
            active_allergies_conflict=False,
            time_list="08:00 AM,08:00 PM"
        )
        db.add(med)
        db.commit()

    # 3. Create Initial Reminders if none exist
    reminders = db.query(models.MedicationReminder).all()
    if not reminders:
        now = datetime.datetime.utcnow()
        rem1 = models.MedicationReminder(
            id="rem_1",
            medicine_name="Paracetamol",
            dosage="500 mg",
            time="08:00 AM",
            is_taken=True,
            date=now
        )
        rem2 = models.MedicationReminder(
            id="rem_2",
            medicine_name="Paracetamol",
            dosage="500 mg",
            time="08:00 PM",
            is_taken=False,
            date=now
        )
        db.add(rem1)
        db.add(rem2)
        db.commit()

    # 4. Create Initial Greeting Chat message if none exist
    chat = db.query(models.ChatMessage).all()
    if not chat:
        msg = models.ChatMessage(
            text="Hello Alex! I am your MediLens AI Pharmacist. Ask me any question about your medications, side effects, or schedule guidelines.",
            is_user=False,
            timestamp=datetime.datetime.utcnow() - datetime.timedelta(minutes=10)
        )
        db.add(msg)
        db.commit()

# Helper mappers
def map_user(u):
    return {
        "id": u.id,
        "name": u.name,
        "email": u.email,
        "blood_type": u.blood_type,
        "weight": u.weight,
        "allergies": str_to_list(u.allergies)
    }

def map_medicine(m):
    return {
        "id": m.id,
        "name": m.name,
        "dosage": m.dosage,
        "frequency": m.frequency,
        "instructions": m.instructions,
        "image_asset": m.image_asset,
        "scanned_date": m.scanned_date,
        "side_effects": str_to_list(m.side_effects),
        "warnings": str_to_list(m.warnings),
        "active_allergies_conflict": m.active_allergies_conflict,
        "time_list": str_to_list(m.time_list)
    }

# Endpoints
@app.get("/api/user", response_model=schemas.UserResponse)
def get_user(db: Session = Depends(get_db)):
    u = db.query(models.User).filter_by(email="alex.rivera@medilens.com").first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    return map_user(u)

@app.get("/api/medicines")
def get_medicines(db: Session = Depends(get_db)):
    meds = db.query(models.Medicine).all()
    return [map_medicine(m) for m in meds]

@app.post("/api/medicines")
def add_medicine(med: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_med = models.Medicine(
        name=med.name,
        dosage=med.dosage,
        frequency=med.frequency,
        instructions=med.instructions,
        image_asset=med.image_asset,
        side_effects=list_to_str(med.side_effects),
        warnings=list_to_str(med.warnings),
        active_allergies_conflict=med.active_allergies_conflict,
        time_list=list_to_str(med.time_list)
    )
    db.add(db_med)
    db.commit()
    db.refresh(db_med)
    return map_medicine(db_med)

@app.get("/api/reminders")
def get_reminders(db: Session = Depends(get_db)):
    reminders = db.query(models.MedicationReminder).all()
    return reminders

@app.post("/api/reminders")
def add_reminder(rem: schemas.ReminderCreate, db: Session = Depends(get_db)):
    db_rem = models.MedicationReminder(
        id=rem.id,
        medicine_name=rem.medicine_name,
        dosage=rem.dosage,
        time=rem.time,
        is_taken=rem.is_taken,
        date=datetime.datetime.utcnow()
    )
    db.add(db_rem)
    db.commit()
    db.refresh(db_rem)
    return db_rem

@app.patch("/api/reminders/{reminder_id}/toggle")
def toggle_reminder(reminder_id: str, db: Session = Depends(get_db)):
    rem = db.query(models.MedicationReminder).filter_by(id=reminder_id).first()
    if not rem:
        raise HTTPException(status_code=404, detail="Reminder not found")
    rem.is_taken = not rem.is_taken
    db.commit()
    db.refresh(rem)
    return rem

@app.get("/api/chat")
def get_chat_messages(db: Session = Depends(get_db)):
    messages = db.query(models.ChatMessage).order_by(models.ChatMessage.timestamp.asc()).all()
    return messages

@app.post("/api/chat")
def post_chat_message(msg: schemas.ChatMessageCreate, db: Session = Depends(get_db)):
    # 1. Save user message
    user_msg = models.ChatMessage(
        text=msg.text,
        is_user=True,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(user_msg)
    db.commit()
    
    # 2. Formulate simulated AI response
    query = msg.text.lower()
    response_text = ""
    if "paracetamol" in query or "acetaminophen" in query:
        response_text = "Paracetamol (500 mg) is safe for general pain and fever. Avoid taking other cold or flu medications containing paracetamol at the same time to prevent accidental overdose. Limit use to a maximum of 4g per day."
    elif "penicillin" in query or "allergy" in query:
        response_text = "I see Penicillin listed in your profile allergies. You must avoid Penicillin, Amoxicillin, and other beta-lactam antibiotics. Always inform your prescribing doctor of this allergy."
    elif "remind" in query or "schedule" in query:
        response_text = "You have Paracetamol scheduled for 08:00 AM (taken) and 08:00 PM today. You can add new reminders in the Reminders tab."
    elif "side effect" in query:
        response_text = "Common side effects for your active medications are listed in their respective detail screens. For Paracetamol, mild stomach upset is possible. If you experience skin rashes or swelling, stop usage immediately."
    else:
        response_text = "I've analyzed your query. To ensure absolute safety, please verify the exact label of the medicine. Based on your profile, I don't see any immediate conflicts, but consult a clinician for long-term usage guidelines."

    ai_msg = models.ChatMessage(
        text=response_text,
        is_user=False,
        timestamp=datetime.datetime.utcnow()
    )
    db.add(ai_msg)
    db.commit()
    
    return {"user_message": user_msg, "ai_message": ai_msg}
