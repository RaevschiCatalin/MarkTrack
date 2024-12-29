from fastapi import APIRouter,HTTPException
from models.teacher import TeacherRequest


router = APIRouter()

# Get all classes they teach
@router.get("/classes")
async def get_all_classes(request: TeacherRequest):
    teacher_id = request.teacher_id
    pass