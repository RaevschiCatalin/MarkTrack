from pydantic import BaseModel

class Notification(BaseModel):
    user_id: str
    title: str
    body: str
    date: str
    