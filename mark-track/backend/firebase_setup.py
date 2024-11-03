import firebase_admin
from firebase_admin import credentials, firestore, auth

cred = credentials.Certificate("./credentials/marktrack-655e8-firebase-adminsdk-uev46-6f263fdc70.json")
firebase_admin.initialize_app(cred)
db = firestore.client()