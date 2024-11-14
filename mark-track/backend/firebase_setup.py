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
