import os
import re
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException
from firebase_admin import initialize_app, auth
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import jwt

from models.user import AssignRoleRequest,RegisterUserRequest
from models.student import StudentDetails
from models.teacher import TeacherDetails
from models.login_data import LoginData
from firebase_setup import db

# FastAPI app initialization
app = FastAPI()

# Firebase initialization
try:
    initialize_app()
except ValueError:
    pass

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


load_dotenv(dotenv_path='./credentials/.env')
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_jwt_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return token


@app.post("/login")
async def login(data: LoginData):
    try:
        if not isinstance(data.token, str):
            raise ValueError("The token must be a string.")
        decoded_token = auth.verify_id_token(data.token,clock_skew_seconds=60)
        email = decoded_token.get("email")
        jwt_token = create_jwt_token(email)
        return {"access_token": jwt_token, "token_type": "bearer"}
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise HTTPException(status_code=401, detail="Invalid Firebase token.")
TEACHER_CODE = "TEACHER123"
STUDENT_CODE_PREFIX = "LTMV"



@app.post("/register")
async def register_user(user_data: RegisterUserRequest):

    try:
        user_ref = db.collection("users").document(user_data.uid)
        user_ref.set({
            "email": user_data.email,
            "createdAt": datetime.utcnow(),
            "role": "pending"
        })
        return {"message": "User created successfully in Firestore."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {e}")

@app.post("/assign-role")
async def assign_role(role_data: AssignRoleRequest):

    try:
        user_ref = db.collection("users").document(role_data.uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")

        if role_data.code == TEACHER_CODE:
            db.collection("Teachers").document(role_data.uid).set(user_doc.to_dict()).update({"role":"teacher"})
            user_ref.update({"role": "teacher"})
            return {"message": "Teacher account created!"}

        elif role_data.code.startswith(STUDENT_CODE_PREFIX):
            print("Entered regex loop")
            if re.match(rf"^{STUDENT_CODE_PREFIX}\d{{4,5}}$", role_data.code):
                student_id = role_data.code
                print(f"Checking if any student has student_id = {student_id} in Students collection.")
                try:
                    matching_students = db.collection("Students").where("student_id", "==", student_id).stream()
                    for student in matching_students:
                        raise HTTPException(status_code=400, detail="Student ID already exists.")

                    db.collection("Students").add({
                        **user_doc.to_dict(),
                        "role":"student",
                        "student_id": student_id
                    })
                    user_ref.update({"role": "student"})
                    return {"message": "Student account created!"}
                except Exception as e:
                    print(f"Error checking or adding student record: {e}")
                    raise HTTPException(status_code=500, detail=f"Error processing student record: {e}")
            else:
                raise HTTPException(status_code=400, detail="Invalid student code format.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assigning role: {e}")

@app.get("/get-subjects")
async def get_subjects():
    try:
        subjects_ref = db.collection("Subjects")
        docs = subjects_ref.stream()
        subjects = [
            {"id": doc.id, **doc.to_dict()} for doc in docs
        ]
        return {"subjects": subjects}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching subjects: {e}")

@app.post("/complete-teacher-details")
async def complete_teacher_details(details: TeacherDetails):
    try:
        print(f"Received: {details}")
        user_ref = db.collection("users").document(details.uid)
        user_doc = user_ref.get()

        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")

        subject_ref = db.collection("Subjects").document(details.subject_id)
        subject_doc = subject_ref.get()

        if not subject_doc.exists:
            raise HTTPException(status_code=404, detail="Subject not found")


        teacher_data = {
            "first_name": details.first_name,
            "last_name": details.last_name,
            "father_name": details.father_name,
            "gov_number": details.gov_number,
            "subject_id": details.subject_id,
            "updated_at": datetime.utcnow()
        }
        db.collection("Teachers").document(details.uid).set(teacher_data, merge=True)
        user_ref.update({"role": "teacher"})
        subject_ref.update({"teacher_id": details.uid})
        return {"message": "Teacher details updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating teacher details: {e}")

@app.post("/complete-student-details")
async def complete_student_details(details: StudentDetails):
    try:
        user_ref = db.collection("users").document(details.uid)
        user_doc = user_ref.get()
        if not user_doc.exists:
            raise HTTPException(status_code=404, detail="User not found.")
        student_data = {
            "first_name": details.first_name,
            "last_name": details.last_name,
            "gov_number": details.gov_number,
            "updated_at": datetime.utcnow()
        }
        db.collection("Students").document(details.uid).set(student_data, merge=True)
        user_ref.update({"role": "student"})

        return {"message": "Student details updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating student details: {e}")

@app.get("/")
async def read_root():
    return {"message": "If u sent a request to  / , this means the back is working fine."}
