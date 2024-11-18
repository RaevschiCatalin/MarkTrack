from pydantic import BaseModel


class TeacherDetails(BaseModel):
    uid: str
    first_name: str
    last_name: str
    father_name: str
    gov_number: str
    subject_id: str

