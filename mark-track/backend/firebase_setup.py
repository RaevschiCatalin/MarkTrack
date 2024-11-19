import os

import firebase_admin
from firebase_admin import credentials, firestore, auth


cred = credentials.Certificate("./credentials/marktrack-655e8-firebase-adminsdk-uev46-1af6e0dced.json")
try:
    app = firebase_admin.initialize_app(cred)
    db = firestore.client()
    print("Firebase app initialized successfully")
except Exception as e:
    print(f"Error initializing Firebase: {e}")

def get_user_by_email(email: str):
    user_ref = db.collection("users").where("email", "==", email).limit(1).get()
    if user_ref:
        return user_ref[0].to_dict()
    else:
        return None