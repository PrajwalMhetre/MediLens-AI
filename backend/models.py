from sqlalchemy import Column, Integer, String, Boolean, DateTime
from database import Base
import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    blood_type = Column(String)
    weight = Column(String)
    allergies = Column(String)  # Comma-separated string, e.g., "Penicillin,Sulfa drugs"

class Medicine(Base):
    __tablename__ = "medicines"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    dosage = Column(String)
    frequency = Column(String)
    instructions = Column(String)
    image_asset = Column(String)
    scanned_date = Column(DateTime, default=datetime.datetime.utcnow)
    side_effects = Column(String)  # Comma-separated string
    warnings = Column(String)  # Comma-separated string
    active_allergies_conflict = Column(Boolean, default=False)
    time_list = Column(String)  # Comma-separated string, e.g., "08:00 AM,08:00 PM"

class MedicationReminder(Base):
    __tablename__ = "reminders"

    id = Column(String, primary_key=True, index=True)
    medicine_name = Column(String, index=True)
    dosage = Column(String)
    time = Column(String)
    is_taken = Column(Boolean, default=False)
    date = Column(DateTime, default=datetime.datetime.utcnow)

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    text = Column(String)
    is_user = Column(Boolean, default=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
