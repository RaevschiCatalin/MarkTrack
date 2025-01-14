from fastapi import APIRouter, HTTPException, Query
from datetime import datetime
from models.notification import MarkNotification, AbsenceNotification
import asyncio

from database.firebase_setup import db

router = APIRouter()

async def get_notifications_from_firestore(student_id: str):
    # Get the collection of notifications
    notifications_ref = db.collection("Notifications")
    
    # Query the notifications where the student_id matches
    query = notifications_ref.where("student_id", "==", student_id)
    
    # Run the query in a separate thread because stream() is blocking
    notifications = await asyncio.to_thread(query.stream)
    
    student_notifications = []
    
    # Parse the notifications
    for notification in notifications:
        student_notifications.append(notification.to_dict())  # Add the notification data
    
    return student_notifications

@router.get("/")
async def get_notifications(student_id: str = Query(...)):
    try:
        student_notifications = await get_notifications_from_firestore(student_id)

        if not student_notifications:
            raise HTTPException(status_code=404, detail="No notifications found for the student.")
        
        return {"notifications": student_notifications}

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
        raise HTTPException(status_code=500, detail=f"Error adding mark notification: {str(e)}")

@router.post("/post-absence")
async def post_absence_notification(notification_request: AbsenceNotification):
    notification = {
            "student_id": notification_request.student_id,
            "teacher_id": notification_request.teacher_id,
            "subject_id": notification_request.subject_id,
            "is_motivated": False,
            "date": datetime.now().isoformat(),
            "description": notification_request.description,
            "is_read": False
        }
    try:
        db.collection("Notifications").add(notification)
        return {"message": "Notification added successfully"}
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error adding absence notification: {str(e)}")   

