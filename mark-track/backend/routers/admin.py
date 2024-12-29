from datetime import datetime
from fastapi import APIRouter, HTTPException
from database.firebase_setup import db
from models.class_model import CreateClassRequest
from models.student import AddStudentToClass
from models.subject import Subject
from models.class_model import AssignTeacherToClass

router = APIRouter()

# Fetch all teachers
@router.get("/teachers")
async def get_all_teachers():
    try:
        teachers_ref = db.collection("Teachers")
        teachers_docs = teachers_ref.stream()
        teachers = [{"id": doc.id, **doc.to_dict()} for doc in teachers_docs]
        return {"teachers": teachers}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching teachers: {e}")

# Fetch all classes
@router.get("/classes")
async def get_all_classes():
    try:
        classes_ref = db.collection("Classes")
        classes_docs = classes_ref.stream()
        classes = [{"id": doc.id, **doc.to_dict()} for doc in classes_docs]
        return {"classes": classes}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching classes: {e}")


# Create a new class
@router.post("/classes")
async def create_class(class_request: CreateClassRequest):
    try:
        class_ref = db.collection("Classes").document(class_request.class_id)
        if class_ref.get().exists:
            raise HTTPException(status_code=400, detail="Class already exists.")

        class_ref.set({
            "created_at": datetime.utcnow(),
            "students": [],
            "subjects": []
        })
        return {"message": "Class created successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating class: {e}")

# Add student to a class
@router.post("/classes/{class_id}/students")
async def add_student_to_class(class_id: str, student_details: AddStudentToClass):
    student_id = student_details.student_id
    try:
        class_ref = db.collection("Classes").document(class_id)
        class_doc = class_ref.get()

        if not class_doc.exists:
            raise HTTPException(status_code=404, detail="Class not found.")

        student_ref = db.collection("Students").where("student_id", "==", student_id).stream()
        student_doc = next(student_ref, None)

        if not student_doc:
            raise HTTPException(status_code=404, detail="Student not found.")

        class_data = class_doc.to_dict()
        if student_id in class_data.get("students", []):
            raise HTTPException(status_code=400, detail="Student already in class.")

        class_ref.update({"students": class_data.get("students", []) + [student_id]})
        student_ref.update({"class_id": class_id})
        return {"message": "Student added to class."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error adding student to class: {e}")


# Add subject to a class
@router.post("/classes/{class_id}/subjects")
async def add_subject_to_class(class_id: str, subject_details: Subject):
    subject_id = subject_details.subject_id
    teacher_id = subject_details.teacher_id
    try:
       
        class_ref = db.collection("Classes").document(class_id)
        class_doc = class_ref.get()

        if not class_doc.exists:
            raise HTTPException(status_code=404, detail="Class not found.")

        class_data = class_doc.to_dict()
        

       
        subject_ref = db.collection("Subjects").document(subject_id)
        subject_doc = subject_ref.get()
        if not subject_doc.exists:
            raise HTTPException(status_code=404, detail="Subject not found.")

        teacher_ref = db.collection("Teachers").document(teacher_id)
        teacher_doc = teacher_ref.get()
        if not teacher_doc.exists:
            raise HTTPException(status_code=404, detail="Teacher not found.")

        teacher_data = teacher_doc.to_dict()
        print(f"Teacher data: {teacher_data}")

        teacher_subject = teacher_data.get("subject_id")
        if not teacher_subject:
            raise HTTPException(status_code=400, detail="Teacher has no subject assigned")
            
        if subject_id != teacher_subject:
            raise HTTPException(status_code=400, detail="Teacher is not assigned to this subject.")

        
        if "subjects" not in class_data:
            class_data["subjects"] = []

       
        if any(subj.get("subject_id") == subject_id for subj in class_data["subjects"]):
            raise HTTPException(status_code=400, detail="Subject already added to class.")

        
        class_data["subjects"].append({
            "subject_id": subject_id,
            "teacher_id": teacher_id
        })
        class_ref.update({"subjects": class_data["subjects"]})

       
        if "classes_teaching" not in teacher_data:
            teacher_data["classes_teaching"] = []

       
        if class_id not in teacher_data["classes_teaching"]:
            teacher_data["classes_teaching"].append(class_id)
            teacher_ref.update({"classes_teaching": teacher_data["classes_teaching"]})

        return {"message": "Subject added to class and teacher assigned."}
    except Exception as e:
        print(f"Error details: {str(e)}") 
        raise HTTPException(status_code=500, detail=f"Error adding subject to class: {str(e)}")

# Assign teacher to a class
@router.post("/classes/{class_id}/teachers")
async def assign_teacher_to_class(class_id: str, teacher_details: AssignTeacherToClass):
    teacher_id = teacher_details.teacher_id
    try:
        class_ref = db.collection("Classes").document(class_id)
        class_ref.update({"teacher_id": teacher_id})
        return {"message": "Teacher assigned to class."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error assigning teacher to class: {str(e)}")
