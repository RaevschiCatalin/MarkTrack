from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from models.teacher import (
    TeacherRequest,
    Mark, 
    MarkCreate,
    Absence, 
    AbsenceCreate,
    StudentStats, 
    ClassStats,
    TeacherClass,
    TeacherClasses,
    StudentResponse,
    StudentsResponse
)
from database.firebase_setup import db

router = APIRouter()

@router.get("/classes")
async def get_teacher_classes(teacher_details: TeacherRequest):
    teacher_id = teacher_details.teacher_id
    try:
        teacher = db.collection("Teachers").document(teacher_id).get()
        if not teacher.exists:
            raise HTTPException(status_code=401, detail="Unauthorized")

        classes = db.collection("Classes").stream()
        teacher_classes = []
        
        for cls in classes:
            cls_data = cls.to_dict()
            if any(subj.get("teacher_id") == teacher_id for subj in cls_data.get("subjects", [])):
                teacher_classes.append({
                    "id": cls.id,
                    "name": cls_data.get("name"),
                    "subject_id": next(
                        subj.get("subject_id") 
                        for subj in cls_data.get("subjects", []) 
                        if subj.get("teacher_id") == teacher_id
                    )
                })
        
        return {"classes": teacher_classes}
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching classes: {str(e)}")

@router.get("/classes/{class_id}/students")
async def get_class_students(class_id: str, teacher_details: TeacherRequest, include_stats: bool = True):
    teacher_id = teacher_details.teacher_id
    try:
        teacher = db.collection("Teachers").document(teacher_id).get()
        if not teacher.exists:
            raise HTTPException(status_code=401, detail="Unauthorized")

        class_doc = db.collection("Classes").document(class_id).get()
        if not class_doc.exists:
            raise HTTPException(status_code=404, detail="Class not found")
            
        class_data = class_doc.to_dict()
        student_ids = class_data.get("students", [])
        
        subject_id = next(
            (subj.get("subject_id") for subj in class_data.get("subjects", [])
            if subj.get("teacher_id") == teacher_id),
            None
        )
        
        if not subject_id:
            raise HTTPException(status_code=403, detail="Teacher does not teach in this class")

        students = []
        for student_id in student_ids:
            student_docs = db.collection("Students").where(
                "student_id", "==", student_id
            ).limit(1).stream()
            student = next(student_docs, None)
            
            if student:
                student_data = student.to_dict()
                student_info = {
                    "id": student.id,
                    "student_id": student_id,
                    "first_name": student_data.get("first_name"),
                    "last_name": student_data.get("last_name")
                }
                
                if include_stats:
                    marks = db.collection("Marks").where(
                        "student_id", "==", student_id
                    ).where(
                        "subject_id", "==", subject_id
                    ).stream()
                    
                    absences = db.collection("Absences").where(
                        "student_id", "==", student_id
                    ).where(
                        "subject_id", "==", subject_id
                    ).stream()
                    
                    marks_list = [m.to_dict() | {"id": m.id} for m in marks]
                    absences_list = [a.to_dict() | {"id": a.id} for a in absences]
                    
                    student_info.update({
                        "marks": marks_list,
                        "absences": absences_list,
                        "average_mark": sum(m["value"] for m in marks_list) / len(marks_list) if marks_list else 0,
                        "total_absences": len(absences_list),
                        "motivated_absences": sum(1 for a in absences_list if a["is_motivated"])
                    })
                
                students.append(student_info)

        return {"students": students}
    except Exception as e:
        print(f"Error details: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error fetching students: {str(e)}")

