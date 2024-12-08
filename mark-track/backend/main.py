import os
import re
from datetime import datetime, timedelta
from fastapi import FastAPI, HTTPException, Header
from firebase_admin import initialize_app, auth
from starlette.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import jwt

from models.user import AssignRoleRequest, RegisterUserRequest, UserRequest
from models.student import StudentDetails
from models.teacher import TeacherDetails
from models.login_data import LoginData
from firebase_setup import db,get_user_by_email

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

TEACHER_CODE = "TEACHER123"
STUDENT_CODE_PREFIX = "LTMV"
ADMIN_CODE = "ADMIN123"

load_dotenv(dotenv_path='./credentials/.env')
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 3600

def create_jwt_token(email: str):
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode = {"sub": email, "exp": expire}
    token = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    print(token)
    return token


@app.post("/login")
async def login(data: LoginData):
    try:
        if not isinstance(data.token, str):
            raise ValueError("The token must be a string.")
        decoded_token = auth.verify_id_token(data.token,clock_skew_seconds=60)
        email = decoded_token.get("email")

        if not email:
            raise HTTPException(status_code=400, detail="Email not found in token.")

        user = get_user_by_email(email)

        if not user:
            raise HTTPException(status_code=404, detail="User not found.")

        role = user.get("role")
        uid = auth.get_user_by_email(email).uid
        jwt_token = create_jwt_token(email)
        return {
            "access_token": jwt_token,
            "token_type": "bearer",
            "role": role,
            "uid": uid
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid Firebase token.")


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

            db.collection("Teachers").document(role_data.uid).set(
                {**user_doc.to_dict(), "role": "teacher"}, merge=True
            )
            user_ref.update({"role": "teacher"})
            return {"message": "Teacher account created!"}

        elif role_data.code.startswith(STUDENT_CODE_PREFIX):

            if not re.match(rf"^{STUDENT_CODE_PREFIX}\d{{4,5}}$", role_data.code):
                raise HTTPException(status_code=400, detail="Invalid student code format.")

            student_id = role_data.code
            existing_students = db.collection("Students").where("student_id", "==", student_id).stream()
            for _ in existing_students:
                raise HTTPException(status_code=400, detail="Student ID already exists.")


            db.collection("Students").document(role_data.uid).set(
                {**user_doc.to_dict(), "role": "student", "student_id": student_id}, merge=True
            )
            user_ref.update({"role": "student"})
            return {"message": "Student account created!"}
        elif role_data.code == ADMIN_CODE:
            db.collection("Admins").document(role_data.uid).set(
                {**user_doc.to_dict(), "role": "admin"}, merge=True
            )
            user_ref.update({"role": "admin"})
            return {"message": "Admin account created!"}
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
            "father_name": details.father_name,
            "gov_number": details.gov_number,
            "updated_at": datetime.utcnow()
        }
        db.collection("Students").document(details.uid).set(student_data, merge=True)
        user_ref.update({"role": "student"})

        return {"message": "Student details updated successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating student details: {e}")

@app.post("/get-student-profile")
async def get_student_profile(request: UserRequest):
    try:
        uid = request.uid

        if not uid:
            raise HTTPException(status_code=400, detail="UID not provided in the request body.")

        student_ref = db.collection("Students").document(uid)
        student_doc = student_ref.get()

        if not student_doc.exists:
            raise HTTPException(status_code=404, detail="Student profile not found.")

        student_data = student_doc.to_dict()

        return student_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching student profile: {e}")

@app.post("/get-teacher-profile")
async def get_teacher_profile(request: UserRequest):
    try:
        uid = request.uid

        if not uid:
            raise HTTPException(status_code=400, detail="UID not provided in the request body.")

        teacher_ref = db.collection("Teachers").document(uid)
        teacher_doc = teacher_ref.get()

        if not teacher_doc.exists:
            raise HTTPException(status_code=404, detail="Teacher profile not found.")

        teacher_data = teacher_doc.to_dict()


        subject_id = teacher_data.get("subject_id")
        if not subject_id:
            raise HTTPException(status_code=400, detail="Subject ID not found for teacher.")

        subject_ref = db.collection("Subjects").document(subject_id)
        subject_doc = subject_ref.get()

        if not subject_doc.exists:
            raise HTTPException(status_code=404, detail="Subject not found.")

        subject_data = subject_doc.to_dict()
        teacher_data["subject_name"] = subject_data.get("name", "Unknown Subject")

        return teacher_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching teacher profile: {e}")

@app.get("/")
async def read_root():
    return {"message": "If u sent a request to  / , this means the back is working fine."}
