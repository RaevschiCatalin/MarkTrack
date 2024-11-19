"use client";

import { useState } from "react";

interface Student {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    phone: string;
    grades: { grade: string; date: string }[];
    absences: { date: string; motivated: boolean }[];
}

export default function TeacherDashboard() {
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [newGrade, setNewGrade] = useState<{ grade: string; date: string }>({ grade: "", date: "" });
    const [newAbsence, setNewAbsence] = useState<{ date: string; motivated: boolean }>({ date: "", motivated: false });
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
    const [isAbsenceModalOpen, setIsAbsenceModalOpen] = useState(false);
    const [editGrade, setEditGrade] = useState<{ grade: string; date: string } | null>(null);
    const [editAbsence, setEditAbsence] = useState<{ date: string; motivated: boolean } | null>(null);

    const studentsList: Student[] = [
        {
            firstName: "John",
            lastName: "Doe",
            email: "john.doe@example.com",
            address: "123 Main St",
            phone: "123-456-7890",
            grades: [],
            absences: [],
        },
        {
            firstName: "Jane",
            lastName: "Smith",
            email: "jane.smith@example.com",
            address: "456 Elm St",
            phone: "234-567-8901",
            grades: [],
            absences: [],
        },
        {
            firstName: "Michael",
            lastName: "Johnson",
            email: "michael.johnson@example.com",
            address: "789 Pine St",
            phone: "345-678-9012",
            grades: [],
            absences: [],
        },
        {
            firstName: "Emily",
            lastName: "Davis",
            email: "emily.davis@example.com",
            address: "321 Oak St",
            phone: "456-789-0123",
            grades: [],
            absences: [],
        },
    ];
    const handleAddGrade = () => {
        if (selectedStudent && newGrade.grade && newGrade.date) {
            const updatedStudent = {
                ...selectedStudent,
                grades: [...selectedStudent.grades, newGrade],
            };
            setSelectedStudent(updatedStudent);
            setNewGrade({ grade: "", date: "" });
            setIsGradeModalOpen(false);
        }
    };

    const handleAddAbsence = () => {
        if (selectedStudent && newAbsence.date) {
            const updatedStudent = {
                ...selectedStudent,
                absences: [...selectedStudent.absences, newAbsence],
            };
            setSelectedStudent(updatedStudent);
            setNewAbsence({ date: "", motivated: false });
            setIsAbsenceModalOpen(false);
        }
    };

    const handleEditGrade = () => {
        if (selectedStudent && editGrade) {
            const updatedGrades = selectedStudent.grades.map((grade) =>
                grade.date === editGrade.date ? editGrade : grade
            );
            const updatedStudent = { ...selectedStudent, grades: updatedGrades };
            setSelectedStudent(updatedStudent);
            setEditGrade(null);
        }
    };

    const handleDeleteGrade = (date: string) => {
        if (selectedStudent) {
            const updatedGrades = selectedStudent.grades.filter((grade) => grade.date !== date);
            const updatedStudent = { ...selectedStudent, grades: updatedGrades };
            setSelectedStudent(updatedStudent);
        }
    };


    const handleEditAbsence = () => {
        if (selectedStudent && editAbsence) {
            const updatedAbsences = selectedStudent.absences.map((absence) =>
                absence.date === editAbsence.date ? editAbsence : absence
            );
            const updatedStudent = { ...selectedStudent, absences: updatedAbsences };
            setSelectedStudent(updatedStudent);
            setEditAbsence(null);
        }
    };

    const handleDeleteAbsence = (date: string) => {
        if (selectedStudent) {
            const updatedAbsences = selectedStudent.absences.filter((absence) => absence.date !== date);
            const updatedStudent = { ...selectedStudent, absences: updatedAbsences };
            setSelectedStudent(updatedStudent);
        }
    };


    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0 transition-transform fixed top-0 left-0 z-40 h-screen sm:h-screen sm:w-[18rem] bg-gray-800`}
            >
                {isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 sm:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    ></div>
                )}
                <aside className="sidebar sidebar-sticky sidebar-mobile h-full py-4 shadow-md bg-gray-800 pt-20">
                    <section className="sidebar-title items-center p-4">
                        <h1 className="text-white text-xl font-bold">Dashboard</h1>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <ul className="menu-items space-y-2">
                                    {["Class 5A", "Class 5B", "Class 5C"].map((cls) => (
                                        <li key={cls}>
                                            <button
                                                onClick={() => {
                                                    setSelectedClass(cls);
                                                    setSelectedStudent(null);
                                                }}
                                                className={`menu-item ripple text-base rounded-lg px-4 py-2 ${selectedClass === cls ? "bg-blue-800" : "bg-blue-500"
                                                    } text-white hover:bg-blue-600 transition-colors w-full text-left`}
                                            >
                                                {cls}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </nav>
                    </section>
                </aside>
            </div>


            {isGradeModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50 " > {/* Adăugăm z-50 */}
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Add Grade</h3>
                        <input
                            type="text"
                            placeholder="Grade"
                            value={newGrade.grade}
                            onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <input
                            type="date"
                            value={newGrade.date}
                            onChange={(e) => setNewGrade({ ...newGrade, date: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setIsGradeModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={handleAddGrade} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {isAbsenceModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"> {/* Adăugăm z-50 */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Add Absence</h3>
                        <input
                            type="date"
                            value={newAbsence.date}
                            onChange={(e) => setNewAbsence({ ...newAbsence, date: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <label className="inline-flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={newAbsence.motivated}
                                onChange={(e) => setNewAbsence({ ...newAbsence, motivated: e.target.checked })}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Motivated</span>
                        </label>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setIsAbsenceModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={handleAddAbsence} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isGradeModalOpen && editGrade && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"> {/* Adăugăm z-50 */}
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h3 className="text-lg font-bold mb-4">Edit Grade</h3>
                        <input
                            type="text"
                            placeholder="Grade"
                            value={editGrade.grade}
                            onChange={(e) => setEditGrade({ ...editGrade, grade: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <input
                            type="date"
                            value={editGrade.date}
                            onChange={(e) => setEditGrade({ ...editGrade, date: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setIsGradeModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={handleEditGrade} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isAbsenceModalOpen && editAbsence && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50"> {/* Adăugăm z-50 */}
                    <div className="bg-white p-6 rounded-lg shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Edit Absence</h3>
                        <input
                            type="date"
                            value={editAbsence.date}
                            onChange={(e) => setEditAbsence({ ...editAbsence, date: e.target.value })}
                            className="border p-2 w-full mb-4"
                        />
                        <label className="inline-flex items-center mb-4">
                            <input
                                type="checkbox"
                                checked={editAbsence.motivated}
                                onChange={(e) => setEditAbsence({ ...editAbsence, motivated: e.target.checked })}
                                className="form-checkbox"
                            />
                            <span className="ml-2">Motivated</span>
                        </label>
                        <div className="flex justify-end space-x-4">
                            <button onClick={() => setIsAbsenceModalOpen(false)} className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300">
                                Cancel
                            </button>
                            <button onClick={handleEditAbsence} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                className="fixed bottom-4 left-4 z-50 sm:hidden bg-blue-500 text-white p-2 rounded-md shadow-md"
                onClick={() => { setIsSidebarOpen(!isSidebarOpen); }}
            >
                Dashboard
            </button>
            <div className="flex w-full flex-col sm:pl-72 p-4 pt-20" > {/* Adăugăm padding pentru a face loc sidebar-ului */}
                {selectedClass && !selectedStudent && (
                    <div className="my-4">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">{selectedClass}</h2>
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-gray-300 table-compact table">
                                <thead>
                                    <tr>
                                        <th className="px-4 py-2 text-left">#</th>
                                        <th className="px-4 py-2 text-left">First Name</th>
                                        <th className="px-4 py-2 text-left">Last Name</th>
                                        <th className="px-4 py-2 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {studentsList.map((student, index) => (
                                        <tr
                                            key={index}
                                            onClick={() => setSelectedStudent(student)}
                                            className="cursor-pointer hover:bg-gray-100"
                                        >
                                            <td className="px-4 py-2">{index + 1}</td>
                                            <td className="px-4 py-2">{student.firstName}</td>
                                            <td className="px-4 py-2">{student.lastName}</td>
                                            <td className="px-4 py-2 text-center">
                                                <button
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    View Details
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {selectedStudent && (
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold text-blue-800 mb-4">
                            {selectedStudent.firstName} {selectedStudent.lastName}
                        </h2>

                        <h3 className="text-xl font-semibold mb-2">Grades:</h3>
                        <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-md mb-4">
                            <thead className="bg-blue-100 text-blue-800">
                                <tr>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Grade</th>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Date</th>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {selectedStudent.grades.length > 0 ? (
                                    selectedStudent.grades.map((grade, index) => (
                                        <tr key={index} className="hover:bg-blue-50">
                                            <td className="px-6 py-3 border border-gray-300">{grade.grade}</td>
                                            <td className="px-6 py-3 border border-gray-300">{grade.date}</td>
                                            <td className="px-6 py-3 border border-gray-300 text-center">
                                                <button
                                                    onClick={() => {
                                                        setEditGrade(grade);
                                                        setIsGradeModalOpen(true);
                                                    }}
                                                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteGrade(grade.date)}
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>


                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 border border-gray-300 text-center text-gray-500">
                                            No grades available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <h3 className="text-xl font-semibold mb-2">Absences:</h3>
                        <table className="min-w-full table-auto border border-gray-300 rounded-lg shadow-md mb-4">
                            <thead className="bg-yellow-100 text-yellow-800">
                                <tr>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Date</th>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Motivated</th>
                                    <th className="px-6 py-3 border border-gray-300 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {selectedStudent.absences.length > 0 ? (
                                    selectedStudent.absences.map((absence, index) => (
                                        <tr key={index} className="hover:bg-yellow-50">
                                            <td className="px-6 py-3 border border-gray-300">{absence.date}</td>
                                            <td className="px-6 py-3 border border-gray-300">
                                                {absence.motivated ? "Motivated" : "Unmotivated"}
                                            </td>
                                            <td className="px-6 py-3 border border-gray-300 text-center">
                                                <button
                                                    onClick={() => {
                                                        setEditAbsence(absence);
                                                        setIsAbsenceModalOpen(true);
                                                    }}
                                                    className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                                                    onClick={() => handleDeleteAbsence(absence.date)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-3 border border-gray-300 text-center text-gray-500">
                                            No absences available.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>

                        <div className="mt-4">
                            <button
                                onClick={() => setIsGradeModalOpen(true)}
                                className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600"
                            >
                                Add Grade
                            </button>
                            <button
                                onClick={() => setIsAbsenceModalOpen(true)}
                                className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 ml-4"
                            >
                                Add Absence
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
