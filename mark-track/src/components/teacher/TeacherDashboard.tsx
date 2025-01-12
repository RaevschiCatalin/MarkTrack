"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { teacherService } from "@/services/teacherService";
import { TeacherClass, StudentResponse } from "@/types/teacher";
import ClassSidebar from "./components/ClassSidebar";
import StudentList from "./components/StudentList";
import StudentDetails from "./components/StudentDetails";
import GradeModal from "./modals/GradeModal";
import AbsenceModal from "./modals/AbsenceModal";

export default function TeacherDashboard() {
    const { uid } = useAuth();
    const [classes, setClasses] = useState<TeacherClass[]>([]);
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<StudentResponse | null>(null);
    const [students, setStudents] = useState<StudentResponse[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (uid) {
            loadClasses();
            console.log(uid);
        }
    }, [uid]);

    useEffect(() => {
        if (selectedClass && uid) {
            loadStudents();
        }
    }, [selectedClass, uid]);

    const loadClasses = async () => {
        try {
            const classesData = await teacherService.getClasses(uid!);
            setClasses(classesData);
            setError(null);
        } catch (err) {
            setError("Failed to load classes");
            console.error(err);
        }
    };

    const loadStudents = async () => {
        if (!selectedClass) return;
        
        try {
            setLoading(true);
            const studentsData = await teacherService.getClassStudents(selectedClass, uid!);
            setStudents(studentsData);
            setError(null);
        } catch (err) {
            setError("Failed to load students");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleClassSelect = (classId: string) => {
        setSelectedClass(classId);
        setSelectedStudent(null);
    };

    const handleStudentSelect = (student: StudentResponse) => {
        setSelectedStudent(student);
    };

    const handleDataUpdate = () => {
        loadStudents();
    };
        if (!uid) {
        return <div>Please log in to access the dashboard.</div>;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <ClassSidebar 
                classes={classes}
                selectedClass={selectedClass}
                onClassSelect={handleClassSelect}
                isOpen={isSidebarOpen}
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
            />

            <div className="flex w-full flex-col sm:pl-72 p-4 pt-20">
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {selectedClass && !selectedStudent && (
                    <StudentList 
                        students={students}
                        loading={loading}
                        onStudentSelect={handleStudentSelect}
                        className={classes.find(c => c.id === selectedClass)?.name || ''}
                    />
                )}

                {selectedStudent && (
                    <StudentDetails 
                        student={selectedStudent}
                        classData={classes.find(c => c.id === selectedClass)!}
                        onUpdate={handleDataUpdate}
                        onOpenGradeModal={() => setIsGradeModalOpen(true)}
                        onOpenAbsenceModal={() => setIsAbsenceModalOpen(true)}
                    />
                )}
            </div>

            {isGradeModalOpen && selectedStudent && (
                <GradeModal 
                    student={selectedStudent}
                    classData={classes.find(c => c.id === selectedClass)!}
                    teacherId={uid}
                    onClose={() => setIsGradeModalOpen(false)}
                    onSuccess={handleDataUpdate}
                />
            )}

            {isAbsenceModalOpen && selectedStudent && (
                <AbsenceModal 
                    student={selectedStudent}
                    classData={classes.find(c => c.id === selectedClass)!}
                    teacherId={uid}
                    onClose={() => setIsAbsenceModalOpen(false)}
                    onSuccess={handleDataUpdate}
                />
            )}
        </div>
    );
}
