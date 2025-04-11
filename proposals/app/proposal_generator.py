from typing import List
from models import Event, Proposal
from ml_model import suggest_meeting_reason
import random

def generate_proposals(events: List[Event]) -> List[Proposal]:
    proposals = []

    for event in events:
        num_proposals = random.randint(2, 5)
        for i in range(num_proposals):
            reason = suggest_meeting_reason(event.title)

            proposals.append(Proposal(
                id=f"{event.id}-proposal-{i+1}",
                title=f"{event.title} - {reason}",
                description=event.description or "No description",
                date=event.date,
                location=event.location,
                original_event_id=event.id,
                proposal_reason=reason
            ))
    
    return proposals