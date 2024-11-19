"use client";

import { useState } from "react";
import {useAuth} from "@/context/AuthContext";
import StudentDashboard from "@/components/StudentDashboard";


export default function Dashboard() {
    const { userRole } = useAuth();//aici este variabila care determina rolul, poate fi sau student sau teacher
    const [selectedClass, setSelectedClass] = useState<string | null>(null);
    const [modalData, setModalData] = useState<{ firstName: string; lastName: string; index: number } | null>(null);
    const [formData, setFormData] = useState<{ grade: string; gradeDate: string; absences: string; absencesDate: string }>({
        grade: "",
        gradeDate: "",
        absences: "",
        absencesDate: "",
    });

    const namesList = [
        { firstName: "John", lastName: "Doe" },
        { firstName: "Jane", lastName: "Smith" },
        { firstName: "Michael", lastName: "Johnson" },
        { firstName: "Emily", lastName: "Davis" },
    ];

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted", formData);
        setModalData(null); // Închide modalul după salvare
    };

    if(userRole === "teacher"){

    return (
        <div className="flex flex-row pt-20 h-screen overflow-y-auto">
            {/* Sidebar */}
            <div className="sm:w-full sm:max-w-[18rem]">
                <input type="checkbox" id="sidebar-mobile-fixed" className="sidebar-state hidden" />
                <label htmlFor="sidebar-mobile-fixed" className="sidebar-overlay"></label>
                <aside className="sidebar sidebar-sticky sidebar-mobile h-full max-sm:fixed max-sm:-translate-x-full py-4 bg-gray-100 shadow-md">
                    <section className="sidebar-title items-center p-4">
                        <h1 className="text-warning text-pretty text-xl font-bold">Dashboard</h1>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <ul className="menu-items space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setSelectedClass("Class 1")}
                                            className={`menu-item ripple text-base rounded-lg px-4 py-2 ${selectedClass === "Class 1" ? "bg-blue-600" : "bg-blue-500"} text-white hover:bg-blue-600 transition-colors w-full text-left`}
                                        >
                                            Class Name 1
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setSelectedClass("Class 2")}
                                            className={`menu-item ripple text-base rounded-lg px-4 py-2 ${selectedClass === "Class 2" ? "bg-green-600" : "bg-green-500"} text-white hover:bg-green-600 transition-colors w-full text-left`}
                                        >
                                            Class Name 2
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setSelectedClass("Class 3")}
                                            className={`menu-item ripple text-base rounded-lg px-4 py-2 ${selectedClass === "Class 3" ? "bg-red-600" : "bg-red-500"} text-white hover:bg-red-600 transition-colors w-full text-left`}
                                        >
                                            Class Name 3
                                        </button>
                                    </li>
                                </ul>
                            </section>
                        </nav>
                    </section>
                </aside>
            </div>

            <div className="flex w-full flex-col p-4">
                {/* Buton pentru mobil */}
                <div className="w-fit">
                    <label htmlFor="sidebar-mobile-fixed" className="btn btn-solid-primary sm:hidden ripple">
                        Dashboard
                    </label>
                </div>

                {selectedClass && (
                    <div className="my-4">
                        <h2 className="text-2xl font-bold mb-4">{selectedClass}</h2>
                        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-lg table-compact table">
                            <thead className="bg-gray-100 border-b border-gray-300">
                                <tr>
                                    <th className="px-4 py-2 text-left">No. crt</th>
                                    <th className="px-4 py-2 text-left">First Name</th>
                                    <th className="px-4 py-2 text-left">Last Name</th>
                                    <th className="px-4 py-2 text-left">Grades</th>
                                    <th className="px-4 py-2 text-left">Absences</th>
                                    <th className="px-4 py-2 text-center">Add</th>
                                </tr>
                            </thead>
                            <tbody>
                                {namesList.map((person, index) => (
                                    <tr key={index} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">{index + 1}</td>
                                        <td className="px-4 py-2">{person.lastName}</td>
                                        <td className="px-4 py-2">{person.firstName}</td>
                                        <td className="px-4 py-2">-</td>
                                        <td className="px-4 py-2">-</td>
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => {
                                                    setModalData({ ...person, index });
                                                    setFormData({ grade: "", gradeDate: "", absences: "", absencesDate: "" });
                                                }}
                                                className="btn btn-primary btn-rounded text-white"
                                            >
                                                +
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {modalData && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                        <h2 className="text-xl font-bold mb-4">
                        Modify for {modalData.firstName} {modalData.lastName}
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Grade</label>
                                <input
                                    type="text"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md bg-white text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                                    placeholder="Enter Grade"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Grade date</label>
                                <input
                                    type="date"
                                    name="gradeDate"
                                    value={formData.gradeDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md bg-white text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Absences</label>
                                <input
                                    type="number"
                                    name="absences"
                                    value={formData.absences}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md bg-white text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                                    placeholder="Enter the number of Absences"
                                />
                                <label className="block text-sm font-medium text-gray-700 mt-2">Absence Date</label>
                                <input
                                    type="date"
                                    name="absencesDate"
                                    value={formData.absencesDate}
                                    onChange={handleInputChange}
                                    className="mt-1 block w-full rounded-md bg-white text-black border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-300"
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setModalData(null)}
                                    className="btn btn-solid-secondary ripple bg-gray-300 hover:bg-gray-400"
                                >
                                    Închide
                                </button>
                                <button type="submit" className="btn btn-solid-primary ripple bg-blue-500 hover:bg-blue-600 text-white">
                                    Salvează
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
    }

    if(userRole === "student"){
        return <StudentDashboard />;
    }
}
