from pydantic import BaseModel
from typing import Optional

class Grade(BaseModel):
    id: Optional[int]
    student_id: int
    subject: str
    score: float
