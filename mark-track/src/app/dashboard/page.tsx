"use client";

import { useState } from "react";
import {useAuth} from "@/context/AuthContext";
import StudentDashboard from "@/components/StudentDashboard";
import TeacherDashboard from "@/components/TeacherDashboard";

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
        return <TeacherDashboard />;
    }

    if(userRole === "student"){
        return <StudentDashboard />;
    }
}
