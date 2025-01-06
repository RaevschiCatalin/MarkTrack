import { useState } from "react";
import { StudentResponse, TeacherClass } from "@/types/teacher";
import { teacherService } from "@/services/teacherService";

interface Props {
    student: StudentResponse;
    classData: TeacherClass;
    teacherId: string;
    onClose: () => void;
    onSuccess: () => void;
}

export default function AbsenceModal({ student, classData, teacherId, onClose, onSuccess }: Props) {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [isMotivated, setIsMotivated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!date) {
            setError("Please select a date");
            return;
        }

        try {
            setLoading(true);
            await teacherService.addAbsence(teacherId, {
                student_id: student.student_id,
                subject_id: classData.subject_id,
                date: date,
                is_motivated: isMotivated
            });
            onSuccess();
            onClose();
        } catch (err) {
            setError("Failed to add absence");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-4">
                    Add Absence for {student.first_name} {student.last_name}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="motivated"
                            checked={isMotivated}
                            onChange={(e) => setIsMotivated(e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor="motivated" className="ml-2 block text-sm text-gray-900">
                            Motivated Absence
                        </label>
                    </div>

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
                        >
                            {loading ? "Adding..." : "Add Absence"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}