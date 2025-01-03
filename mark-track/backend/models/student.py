from pydantic import BaseModel


class StudentDetails(BaseModel):
    uid: str
    first_name: str
    last_name: str
    gov_number: str
    father_name: str


class AddStudentToClass(BaseModel):
    student_id: str

class StudentRequest(BaseModel):
    student_id: str