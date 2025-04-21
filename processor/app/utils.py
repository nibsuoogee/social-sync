from typing import List, Tuple, Optional, Set
from datetime import datetime, timedelta, time, date
from app.schemas import ProcessorEvent
from random import sample

def get_time_bounds(events: List[ProcessorEvent]) -> Optional[Tuple[datetime, datetime]]:
    """
    Returns the earliest start_time and latest end_time from a list of ProcessorEvent objects.

    If the list is empty, returns None.
    """
    if not events:
        return None

    earliest_start = min(event.start_time for event in events)
    latest_end = max(event.end_time for event in events)

    return earliest_start, latest_end

def suggest_events_on_empty_days(
    existing_events: List[ProcessorEvent],
    max_suggestions: int = 5,
    proposal_day_range: int = 14
) -> List[ProcessorEvent]:
    """
    Returns a list of up to max_suggestions events on days with no other events.
    """
    today = date.today()
    tomorrow = today + timedelta(days=1)

    # 1. Collect days that already have events
    days_with_events: Set[date] = {
        event.start_time.date() for event in existing_events
    }

    # 2. Build a set of all candidate days in the range
    candidate_days: Set[date] = {
        tomorrow + timedelta(days=i)
        for i in range(proposal_day_range)
    }

    # 3. Filter out days that already have events
    available_days = list(candidate_days - days_with_events)

    # 4. Randomly select up to max_suggestions days
    selected_days = (
        available_days
        if len(available_days) <= max_suggestions
        else sample(available_days, max_suggestions)
    )

    # 5. Create ProcessorEvent suggestions
    suggestions: List[ProcessorEvent] = []
    for day in selected_days:
        suggestion_start = datetime.combine(day, time(9, 0))
        suggestion_end = datetime.combine(day, time(10, 0))
        suggestions.append(ProcessorEvent(
            start_time=suggestion_start,
            end_time=suggestion_end,
            timezone="UTC",  # adjust if needed
            all_day=True
        ))

    return suggestions