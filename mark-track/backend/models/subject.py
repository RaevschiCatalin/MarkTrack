from pydantic import BaseModel

class Subject(BaseModel):
    subject_id: str
    teacher_id: str