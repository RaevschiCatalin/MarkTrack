from pydantic import BaseModel


class StudentDetails(BaseModel):
    uid: str
    first_name: str
    last_name: str
    gov_number: str