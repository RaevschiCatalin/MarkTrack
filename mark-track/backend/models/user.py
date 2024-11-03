from pydantic import BaseModel, EmailStr
from firebase_admin import auth as firebase_auth
from firebase_setup import db



class UserRegister(BaseModel):
    email: EmailStr
    password: str

class User(BaseModel):
    email: EmailStr

    @classmethod
    def create_user(cls, email: str, password: str) -> "User":
        firebase_user = firebase_auth.create_user(email=email, password=password)
        user = cls(email=email)
        user.save_to_firestore()
        return user

    @classmethod
    def verify_user(cls, email: str, password: str) -> "User":
        try:
            user_info = firebase_auth.get_user_by_email(email)
            return cls(email=user_info.email)
        except Exception as e:
            raise ValueError("Invalid credentials")


    def save_to_firestore(self):
        user_ref = db.collection('users').document(self.email)
        user_ref.set({
            'email': self.email,
        })

    @staticmethod
    def load_from_firestore(email: str):
        user_ref = db.collection('users').document(email).get()
        if user_ref.exists:
            user_data = user_ref.to_dict()
            return User(email=user_data['email'])
        return None
