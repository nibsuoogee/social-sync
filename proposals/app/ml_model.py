from transformers import pipeline

# Load a pre-trained model for zero-shot classification
# Or use text-generation or seq2seq based on your task
classifier = pipeline("zero-shot-classification", model="facebook/bart-large-mnli")

def suggest_meeting_reason(event_title: str):
    labels = ["Team Meeting", "One-on-One", "Project Kickoff", "Deadline Discussion", "Strategy Session"]
    result = classifier(event_title, labels)
    return result["labels"][0]  # Most probable label