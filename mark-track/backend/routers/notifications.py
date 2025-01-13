from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from models.notification import MarkNotification

from database.firebase_setup import db

router = APIRouter()

@router.get("/")
async def get_notifications(student_id: str = Query(...)):
    try:
        notifications = db.collection("Notifications").where("student_id", "==", student_id)
        

    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {str(e)}")
    
@router.post("/post-mark")
async def post_mark_notification(notification_request: MarkNotification):
    notification = {
            "student_id": notification_request.student_id,
            "teacher_id": notification_request.teacher_id,
            "subject_id": notification_request.subject_id,
            "value": notification_request.value,
            "date": datetime.now().isoformat(),
            "description": notification_request.description,
            "is_read": False
        }
    try:
        db.collection("Notifications").add(notification)
        return {"message": "Notification added successfully"}
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding mark: {str(e)}")
    

