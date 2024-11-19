"use client";

import { useState } from "react";
import { Pie, Doughnut } from "react-chartjs-2";
import { motion } from "framer-motion";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    CategoryScale,
    LinearScale,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale);

export default function StudentDashboard() {
    type SubjectData = {
        grades: { grade: number; subject: string; date: string }[];
        absences: { absenceDate: string; subject: string; status: string }[];
    };

    const data: { [key: string]: SubjectData } = {
        "Subject Name 1": {
            grades: [
                { grade: 8, subject: "Subject Name 1", date: "2024-11-01" },
                { grade: 7, subject: "Subject Name 1", date: "2024-11-15" },
            ],
            absences: [
                { absenceDate: "2024-10-15", subject: "Subject Name 1", status: "Motivated" },
                { absenceDate: "2024-10-17", subject: "Subject Name 1", status: "Not Motivated" },
            ],
        },
        "Subject Name 2": {
            grades: [
                { grade: 9, subject: "Subject Name 2", date: "2024-11-05" },
                { grade: 10, subject: "Subject Name 2", date: "2024-11-20" },
            ],
            absences: [
                { absenceDate: "2024-10-18", subject: "Subject Name 2", status: "Motivated" },
                { absenceDate: "2024-10-20", subject: "Subject Name 2", status: "Not Motivated" },
            ],
        },
    };

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const handleSubjectSelection = (subject: string) => {
        setSelectedSubject(subject);
    };

    const selectedData = selectedSubject ? data[selectedSubject] : null;

    const gradesChart = selectedData && {
        labels: selectedData.grades.map((item) => item.date),
        datasets: [
            {
                label: "Grades",
                data: selectedData.grades.map((item) => item.grade),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
        ],
    };

    const absencesChart = selectedData && {
        labels: ["Motivated", "Not Motivated"],
        datasets: [
            {
                label: "Absences",
                data: [
                    selectedData.absences.filter((a) => a.status === "Motivated").length,
                    selectedData.absences.filter((a) => a.status === "Not Motivated").length,
                ],
                backgroundColor: ["#4CAF50", "#F44336"],
            },
        ],
    };

    return (
        <div className="flex flex-row pt-20 h-screen overflow-y-auto">
            {/* Sidebar */}
            <div className="sm:w-full sm:max-w-[18rem]">
                <aside className="sidebar h-full bg-gray-100 shadow-md z-50 py-4">
                    <section className="sidebar-title items-center p-4">
                        <h1 className="text-primary text-xl font-bold">Welcome, user!</h1>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <h2 className="text-lg font-bold">Subjects</h2>
                                <ul className="menu-items space-y-2">
                                    {Object.keys(data).map((subject) => (
                                        <li key={subject} className="menu-item">
                                            <button
                                                onClick={() => handleSubjectSelection(subject)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                {subject}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        </nav>
                    </section>
                </aside>
            </div>

            {/* Content */}
            <div className="flex flex-col w-full p-4">
                {selectedData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Grades Section */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-center font-bold text-lg mb-2">Grades</h3>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className="p-4 shadow-lg rounded-md bg-white"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ width: "100%", maxWidth: "400px" }}
                                >
                                    <Pie data={gradesChart} />
                                </motion.div>
                                <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-2 py-1">Grade</th>
                                        <th className="border border-gray-300 px-2 py-1">Subject</th>
                                        <th className="border border-gray-300 px-2 py-1">Date</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedData.grades.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-2 py-1">{item.grade}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.subject}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.date}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Absences Section */}
                        <div className="flex flex-col items-center">
                            <h3 className="text-center font-bold text-lg mb-2">Absences</h3>
                            <div className="flex flex-col items-center">
                                <motion.div
                                    className="p-4 shadow-lg rounded-md bg-white"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.5 }}
                                    style={{ width: "100%", maxWidth: "400px" }}
                                >
                                    <Doughnut data={absencesChart} />
                                </motion.div>
                                <table className="table-auto w-full border-collapse border border-gray-300 mt-4">
                                    <thead>
                                    <tr>
                                        <th className="border border-gray-300 px-2 py-1">Date</th>
                                        <th className="border border-gray-300 px-2 py-1">Subject</th>
                                        <th className="border border-gray-300 px-2 py-1">Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {selectedData.absences.map((item, index) => (
                                        <tr key={index}>
                                            <td className="border border-gray-300 px-2 py-1">{item.absenceDate}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.subject}</td>
                                            <td className="border border-gray-300 px-2 py-1">{item.status}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
