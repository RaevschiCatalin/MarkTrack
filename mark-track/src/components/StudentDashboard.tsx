"use client";

import { useState } from "react";

export default function StudentDashboard() {
    
    type SubjectData = {
        grades: { grade: number; subject: string; date: string }[];
        absences: { absenceDate: string; subject: string; status: string }[];
    };

    const data: { [key: string]: SubjectData } = {
        "Subject Name 1": {
            grades: [
                { grade: 8, subject: "Subject Name 1", date: "2024-11-01" },
                { grade: 7, subject: "Subject Name 1", date: "2024-11-15" }
            ],
            absences: [
                { absenceDate: "2024-10-15", subject: "Subject Name 1", status: "Motivated" },
                { absenceDate: "2024-10-17", subject: "Subject Name 1", status: "Not Motivated" }
            ]
        },
        "Subject Name 2": {
            grades: [
                { grade: 9, subject: "Subject Name 2", date: "2024-11-05" },
                { grade: 10, subject: "Subject Name 2", date: "2024-11-20" }
            ],
            absences: [
                { absenceDate: "2024-10-18", subject: "Subject Name 2", status: "Motivated" },
                { absenceDate: "2024-10-20", subject: "Subject Name 2", status: "Not Motivated" }
            ]
        },
        "Subject Name 3": {
            grades: [
                { grade: 6, subject: "Subject Name 3", date: "2024-11-10" },
                { grade: 8, subject: "Subject Name 3", date: "2024-11-25" }
            ],
            absences: [
                { absenceDate: "2024-10-25", subject: "Subject Name 3", status: "Motivated" },
                { absenceDate: "2024-10-30", subject: "Subject Name 3", status: "Not Motivated" }
            ]
        }
    };

    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

    const handleSubjectSelection = (subject: string) => {
        setSelectedSubject(subject);
    };

    const selectedData = selectedSubject ? data[selectedSubject] : null;

    return (
        <div className="flex flex-row pt-20 h-screen overflow-y-auto">
            <div className="sm:w-full sm:max-w-[18rem]">
                <input type="checkbox" id="sidebar-mobile-fixed" className="sidebar-state hidden" />
                <label htmlFor="sidebar-mobile-fixed" className="sidebar-overlay"></label>
                <aside className="sidebar sidebar-sticky sidebar-mobile h-full max-sm:fixed max-sm:-translate-x-full py-4 bg-gray-100 shadow-md z-50 md:z-40">
                    <section className="sidebar-title items-center p-4">
                        <h1 className="text-primary text-pretty text-xl font-bold">Welcome, user!</h1>
                    </section>
                    <section className="sidebar-content">
                        <nav className="menu rounded-md">
                            <section className="menu-section px-4">
                                <h2 className="text-lg text-green-9 font-bold">Subjects</h2>
                                <ul className="menu-items space-y-2">
                                    {Object.keys(data).map((subject) => (
                                        <li
                                            key={subject}
                                            className="menu-item"
                                        >
                                            <span>
                                                <svg className="w-5 h-5 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                                                    <path fillRule="evenodd" d="M6 2a2 2 0 0 0-2 2v15a3 3 0 0 0 3 3h12a1 1 0 1 0 0-2h-2v-2h2a1 1 0 0 0 1-1V4a2 2 0 0 0-2-2h-8v16h5v2H7a1 1 0 1 1 0-2h1V2H6Z" clipRule="evenodd"/>
                                                </svg>
                                            </span>
                                            <button onClick={() => handleSubjectSelection(subject)}>
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

            <div className="flex w-full flex-col p-4">
                <div className="w-fit">
                    <label htmlFor="sidebar-mobile-fixed" className="btn btn-solid-primary sm:hidden ripple">
                        Dashboard
                    </label>
                </div>

                <div className="my-4 grid grid-rows-2 md:grid-cols-2 gap-4">
                    {selectedData && (
                        <>
                            <div className="flex w-full overflow-x-auto">
                                <table className="table-compact table max-w-4xl">
                                    <thead>
                                        <tr>
                                            <th>Grade</th>
                                            <th>Subject</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedData.grades.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.grade}</td>
                                                <td>{item.subject}</td>
                                                <td>{item.date}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex w-full overflow-x-auto">
                                <table className="table-compact table max-w-4xl">
                                    <thead>
                                        <tr>
                                            <th>Absence Date</th>
                                            <th>Subject</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedData.absences.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.absenceDate}</td>
                                                <td>{item.subject}</td>
                                                <td>{item.status}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
