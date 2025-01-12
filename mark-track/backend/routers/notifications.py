from fastapi import APIRouter, HTTPException

from database.firebase_setup import db
from models.notification import Notification

router = APIRouter()

@router.get("/get-user-notification")
async def get_user_notifications(notification: Notification):
    try:
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching notifications: {e}")