"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "@/config/firebaseConfig";

// Define a type for the data to be fetched from Firestore
interface Notification {
    id: string;
    message: string;
    date: string;
}
interface Subject {
    name: string;
}

const Notifications: React.FC = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const markSnapshot = await getDocs(collection(db, "Mark"));
            const absencesSnapshot = await getDocs(collection(db, "Absences"));

            const marks = await Promise.all(
                markSnapshot.docs.map(async (docSnap: QueryDocumentSnapshot) => {
                    const subjectRef = docSnap.data().id_Subject;
                    const subjectDocRef = doc(db, "Subject", subjectRef);
                    const subjectDoc = await getDoc(subjectDocRef);

                    const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : "Subject unknown";

                    return {
                        id: docSnap.id,
                        message: `You have a new grade in the subject ${subjectName}: ${docSnap.data().mark}`,
                        date: docSnap.data().date,
                    };
                })
            );

            const absences = await Promise.all(
                absencesSnapshot.docs.map(async (docSnap: QueryDocumentSnapshot) => {
                    const subjectRef = docSnap.data().id_Subject;
                    const subjectDocRef = doc(db, "Subject", subjectRef);
                    const subjectDoc = await getDoc(subjectDocRef);

                    const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : "Subject unknown";

                    return {
                        id: docSnap.id,
                        message: `The absence from ${docSnap.data().date} in the ${subjectName} subject has been added to the catalog.`,
                        date: docSnap.data().date,
                    };
                })
            );

            setNotifications([...marks, ...absences]);
        };

        fetchNotifications();
    }, []);

    return (
        <div className="p-6 max-w-xl mx-auto pt-20 bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold text-center mb-4">Notifications</h2>
            <ul className="space-y-4">
                {notifications.map((notification) => (
                    <li key={notification.id} className="bg-white p-4 rounded-lg shadow-sm">
                        <p className="text-lg font-medium">{notification.message}</p>
                        <span className="block text-sm text-gray-500 mt-2">{notification.date}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
