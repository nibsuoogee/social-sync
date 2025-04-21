from pydantic import BaseModel
from datetime import datetime
from enum import Enum

class EventStatus(str, Enum):
    confirmed = "confirmed"
    tentative = "tentative"
    cancelled = "cancelled"

class Event(BaseModel):
    id: int
    ics_uid: str
    title: str
    description: str
    location: str
    start_time: datetime
    end_time: datetime
    timezone: str
    all_day: bool
    recurrence_rule: str
    status: EventStatus
    created_at: datetime
    updated_at: datetime
    proposed_by_user_id: int
    user_read_only: bool

class ProcessorEvent(BaseModel):
    start_time: datetime
    end_time: datetime
    timezone: str
    all_day: bool

class ProposalRequest(BaseModel):
    events: list[ProcessorEvent]

class ProposalResponse(BaseModel):
    proposals: list[ProcessorEvent]
