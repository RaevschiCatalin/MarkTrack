"use client"

import { use, useEffect, useState } from 'react';
import { notificationService } from '@/services/notificationService';
import { MarkNotification, AbsenceNotification } from '@/types/notification';
import { useAuth } from '@/context/AuthContext';

export default function Notifications() {

    const { uid } = useAuth();
    const [notifications, setNotifications] = useState<(MarkNotification | AbsenceNotification)[]>([]);
    const [teacherName, setTeacherName] = useState('');
    const [subjectName, setSubjectName] = useState('');

    

    useEffect(() => {   
        if (uid) {
            loadNotifications();
        }
    }, [uid]);

    const loadNotifications = async () => {
        try {
            const notifications = await notificationService.getNotifications(uid!);
            setNotifications(notifications);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTeacherName = async (teacherId: string) => {
        try {
            const teacherName = await notificationService.getTeacherName(teacherId);
            setTeacherName(teacherName);
        } catch (err) {
            console.error(err);
        }
    }

    const loadSubjectName = async (subjectId: string) => {
        try {
            const subjectName = await notificationService.getSubjectName(subjectId);
            setSubjectName(subjectName);
        } catch (err) {
            console.error(err);
        }
    }

    if (!uid) {
        return <div>Please log in to access the dashboard.</div>;
    }

    return (
        <div className="min-h-screen flex flex-col items-center pt-20">
            <h1 className="py-10 text-3xl font-bold">Notifications</h1>

            {notifications.map((notification) => (
                <div 
                    key={notification.id}  // Added key here using notification.id
                    className="md:max-w-xl max-w-sm w-full bg-gray-100 p-4 rounded-lg shadow-lg mb-5"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="font-semibold text-lg text-gray-900">
                            {isMarkNotification(notification) ? 'New grade' : 'New Absence'}
                        </h2>
                        <span className="btn btn-sm btn-circle btn-ghost">X</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        {isMarkNotification(notification) 
                            ? `You got a ${notification.value} in ${subjectName} from ${teacherName}` 
                            : `You were ${notification.is_motivated ? 'justified' : 'absent'} from ${subjectName} on ${notification.time}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                </div>
            ))}
        </div>
    );
}

// Type guard to determine if the notification is a MarkNotification
function isMarkNotification(notification: MarkNotification | AbsenceNotification): notification is MarkNotification {
    return (notification as MarkNotification).value !== undefined;
}
