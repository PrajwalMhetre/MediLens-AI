from pydantic import BaseModel
from typing import List, Optional
import datetime

# Helper functions to convert between DB comma-separated strings and Pydantic lists
def str_to_list(val: Optional[str]) -> List[str]:
    if not val:
        return []
    return [item.strip() for item in val.split(",") if item.strip()]

def list_to_str(lst: Optional[List[str]]) -> str:
    if not lst:
        return ""
    return ",".join(lst)

# User schemas
class UserBase(BaseModel):
    name: str
    email: str
    blood_type: str
    weight: str
    allergies: List[str] = []

class UserCreate(UserBase):
    pass

class UserResponse(UserBase):
    id: int

    class Config:
        from_attributes = True

# Medicine schemas
class MedicineBase(BaseModel):
    name: str
    dosage: str
    frequency: str
    instructions: str
    image_asset: str
    side_effects: List[str] = []
    warnings: List[str] = []
    active_allergies_conflict: bool = False
    time_list: List[str] = []

class MedicineCreate(MedicineBase):
    pass

class MedicineResponse(BaseModel):
    id: int
    name: str
    dosage: str
    frequency: str
    instructions: str
    image_asset: str
    scanned_date: datetime.datetime
    side_effects: List[str] = []
    warnings: List[str] = []
    active_allergies_conflict: bool = False
    time_list: List[str] = []

    class Config:
        from_attributes = True

# Reminder schemas
class ReminderBase(BaseModel):
    id: str
    medicine_name: str
    dosage: str
    time: str
    is_taken: bool = False

class ReminderCreate(ReminderBase):
    pass

class ReminderResponse(ReminderBase):
    date: datetime.datetime

    class Config:
        from_attributes = True

# Chat schemas
class ChatMessageBase(BaseModel):
    text: str
    is_user: bool = False

class ChatMessageCreate(ChatMessageBase):
    pass

class ChatMessageResponse(ChatMessageBase):
    id: int
    timestamp: datetime.datetime

    class Config:
        from_attributes = True
