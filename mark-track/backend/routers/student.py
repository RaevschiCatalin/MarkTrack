from fastapi import APIRouter,HTTPException
from models.student import StudentRequest


router = APIRouter()


# Get all subjects for a student
@router.get("/subjects")
async def get_all_subjects(request: StudentRequest):
    student_id = request.student_id
    pass
    
