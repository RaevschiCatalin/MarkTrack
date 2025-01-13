import { StudentResponse, TeacherClass, Mark, Absence } from "@/types/teacher";
import { FaGraduationCap, FaCalendarAlt, FaEdit, FaTrash } from "react-icons/fa";
import { teacherService } from "@/services/teacherService";
import { useEffect, useState } from "react";
import { getRequest } from "@/context/api";

interface Props {
    student: StudentResponse;
    classData: TeacherClass;
    onUpdate: () => void;
    onOpenGradeModal: () => void;
    onOpenAbsenceModal: () => void;
}

export default function StudentDetails({
                                           student,
                                           classData,
                                           onUpdate,
                                           onOpenGradeModal,
                                           onOpenAbsenceModal
                                       }: Props) {
    const [loading, setLoading] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [grades, setGrades] = useState<Mark[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);

    const fetchStudentMarksAndAbsences = async () => {
        try {
            const gradesResponse = await getRequest(`/teacher/students/${student.id}/marks`);
            const absencesResponse = await getRequest(`/teacher/students/${student.id}/absences`);
            setGrades(gradesResponse.marks);
            setAbsences(absencesResponse.absences);
        } catch (err) {
            setError('Failed to fetch student marks and absences');
            console.error(err);
        }
    };

    const handleDeleteMark = async (markId: string) => {
        if (!confirm('Are you sure you want to delete this grade?')) return;

        try {
            setLoading(`mark-${markId}`);
            await teacherService.deleteMark(classData.subject_id, markId);
            onUpdate();
        } catch (err) {
            setError('Failed to delete grade');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const handleDeleteAbsence = async (absenceId: string) => {
        if (!confirm('Are you sure you want to delete this absence?')) return;

        try {
            setLoading(`absence-${absenceId}`);
            await teacherService.deleteAbsence(classData.subject_id, absenceId);
            onUpdate();
        } catch (err) {
            setError('Failed to delete absence');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    const handleToggleMotivated = async (absence: Absence) => {
        try {
            setLoading(`absence-${absence.id}`);
            await teacherService.updateAbsence(
                classData.subject_id,
                absence.id,
                { is_motivated: !absence.is_motivated }
            );
            onUpdate();
        } catch (err) {
            setError('Failed to update absence');
            console.error(err);
        } finally {
            setLoading(null);
        }
    };

    useEffect(() => {
        fetchStudentMarksAndAbsences();
    }, []);

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold">
                    {student.first_name} {student.last_name}
                </h2>
                <p className="text-gray-500">ID: {student.student_id}</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
                {/* Grades Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FaGraduationCap className="mr-2" /> Grades
                        </h3>
                        <button
                            onClick={onOpenGradeModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Grade
                        </button>
                    </div>
                    <div className="space-y-2">
                        {grades.map((mark) => (
                            <div
                                key={mark.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <div>
                                    <span className="font-semibold">Grade: {mark.value}</span>
                                    <span className="text-sm text-gray-500 ml-2">
                                       Commentary:  {mark.description}
                                    </span>
                                </div>
                                <button
                                    onClick={() => handleDeleteMark(mark.id)}
                                    disabled={loading === `mark-${mark.id}`}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Absences Section */}
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold flex items-center">
                            <FaCalendarAlt className="mr-2" /> Absences
                        </h3>
                        <button
                            onClick={onOpenAbsenceModal}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                            Add Absence
                        </button>
                    </div>
                    <div className="space-y-2">
                        {absences.map((absence) => (
                            <div
                                key={absence.id}
                                className="flex justify-between items-center p-3 bg-gray-50 rounded"
                            >
                                <div>
                                    <span className={`font-semibold ${
                                        absence.is_motivated ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {absence.is_motivated ? 'Motivated' : 'Unmotivated'}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2">
                                       Commentary: {absence.description}
                                    </span>
                                    <span className="text-sm text-gray-500 ml-2 font-bold">
                                        {new Date(absence.date).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div className="flex space-x-2">
                                    <button
                                        onClick={() => handleToggleMotivated(absence)}
                                        disabled={loading === `absence-${absence.id}`}
                                        className="text-blue-500 hover:text-blue-700"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDeleteAbsence(absence.id)}
                                        disabled={loading === `absence-${absence.id}`}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}