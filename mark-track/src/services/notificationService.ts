import {putRequest, postRequest, deleteRequest, getRequestWithParams} from '../context/api';

import { MarkNotification, AbsenceNotification } from '../types/notification';

export const notificationService = {
    getNotifications: async (studentId: string) => {
        const response = await getRequestWithParams('/notifications', { student_id: studentId });
        return response.notifications as (MarkNotification | AbsenceNotification)[];
    }
};