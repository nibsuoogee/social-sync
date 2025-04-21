from typing import List
from app.schemas import ProcessorEvent
from app.utils import get_time_bounds, suggest_events_on_empty_days
from datetime import date
# from ml_model import suggest_meeting_reason
# import random

# processor/app/model.py
# import json
# import numpy as np
# from app.config import settings
# from app.schemas import BookRecommendation

class ProposalGenerator:
    def __init__(self):
        pass

    def generate_proposals(self, events: List[ProcessorEvent]) -> List[ProcessorEvent]:
        if not events:
            return []
        
        bounds = get_time_bounds(events)

        if not bounds:
            return []
        
        earliest_start, latest_end = bounds
        print(f"Earliest: {earliest_start}, Latest: {latest_end}")

        # TODO use the bounds
        
        proposals = suggest_events_on_empty_days(existing_events=events, 
            max_suggestions=5, proposal_day_range=14)

        return proposals

# Create singleton instance
proposer = None

def get_proposal_generator():
    global proposer
    if proposer is None:
        proposer = ProposalGenerator()
    return proposer
