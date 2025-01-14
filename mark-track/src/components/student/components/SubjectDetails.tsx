"use client";
import { useEffect, useState } from "react";
import { studentService } from "@/services/studentService";
import { Mark, Absence, MarkBase, AbsenceBase } from "@/types/student";

interface SubjectDetailsProps {
    studentId: string;
    subjectId: string;
}

const SubjectDetails: React.FC<SubjectDetailsProps> = ({ studentId, subjectId }) => {
    const [marks, setMarks] = useState<Mark[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await studentService.fetchMarksAndAbsences(studentId, subjectId);
                console.log("API Response:", response);

                const validMarks = Array.isArray(response.marks.marks) ? response.marks.marks : [];
                const validAbsences = Array.isArray(response.absences.absences) ? response.absences.absences : [];

                const transformedMarks = validMarks.map((mark: MarkBase) => ({
                    ...mark,
                    id: mark.date,
                    description: mark.description || "No description provided"
                }));

                const transformedAbsences = validAbsences.map((absence: AbsenceBase) => ({
                    ...absence,
                    id: absence.date,
                }));

                setMarks(transformedMarks);
                setAbsences(transformedAbsences);
            } catch (err) {
                setError("Failed to load marks and absences");
                console.error("Error fetching data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId, subjectId]);


    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
            {loading && <p className="text-center text-gray-600">Loading data...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            {!loading && !error && (
                <>
                    <h1 className="text-2xl font-bold mb-4">Subject Details</h1>

                    <div className="mb-8">
                        <h2 className="text-xl font-semibold mb-2">Marks</h2>
                        <div className="space-y-4">
                            {marks.map((mark) => (
                                <div
                                    key={`${mark.student_id}-${mark.date}`}
                                    className="flex items-center justify-between p-4 bg-gray-100 rounded-md shadow-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {mark.value} points
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {mark.description || "No description"}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-400">{new Date(mark.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold mb-2">Absences</h2>
                        <div className="space-y-4">
                            {absences.map((absence) => (
                                <div
                                    key={`${absence.student_id}-${absence.date}`}
                                    className="flex items-center justify-between p-4 bg-red-50 rounded-md shadow-sm"
                                >
                                    <div>
                                        <p className="font-medium">
                                            {absence.description || "No description"}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {absence.is_motivated ? "Motivated" : "Unmotivated"}
                                        </p>
                                    </div>
                                    <p className="text-sm text-gray-400">{new Date(absence.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SubjectDetails;
