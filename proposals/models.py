from pydantic import BaseModel
from typing import List, Optional

class Event(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    date: Optional[str] = None  # ISO format
    location: Optional[str] = None
    # Add any other fields based on your TS model

class Proposal(Event):
    original_event_id: str
    proposal_reason: Optional[str] = "Auto-generated proposal"