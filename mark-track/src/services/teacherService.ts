import {getRequest, postRequest, deleteRequest, getRequestWithParams} from '../context/api';
import { Mark, Absence, StudentResponse, TeacherClass } from '../types/teacher';

export const teacherService = {
    getClasses: async (teacherId: string) => {
        const response = await getRequestWithParams('/teacher/classes', { teacher_id: teacherId });
        return response.classes as TeacherClass[];
    },

    getClassStudents: async (classId: string, teacherId: string, includeStats: boolean = true) => {
        const response = await getRequestWithParams(`/teacher/classes/${classId}/students`, {
            teacher_id: teacherId,
            includeStats: includeStats
        });
        return response.students as StudentResponse[];
    },

    addMark: async (teacherId: string, data: { student_id: string; value: number; subject_id: string; date: string }) => {
        const response = await postRequest('/teacher/marks', {
            ...data,
            teacher_id: teacherId
        });
        return response as Mark;
    },

    updateMark: async (teacherId: string, markId: string, value: number) => {
        const response = await postRequest(`/teacher/marks/${markId}`, {
            teacher_id: teacherId,
            value
        });
        return response as Mark;
    },

    deleteMark: async (teacherId: string, markId: string) => {
        return await postRequest(`/teacher/marks/${markId}/delete`, {
            teacher_id: teacherId
        });
    },

    addAbsence: async (teacherId: string, data: { student_id: string; subject_id: string; date: string; is_motivated: boolean }) => {
        const response = await postRequest('/teacher/absences', {
            ...data,
            teacher_id: teacherId
        });
        return response as Absence;
    },

    updateAbsence: async (teacherId: string, absenceId: string, data: { is_motivated: boolean }) => {
        const response = await postRequest(`/teacher/absences/${absenceId}`, {
            teacher_id: teacherId,
            ...data
        });
        return response as Absence;
    },

    deleteAbsence: async (teacherId: string, absenceId: string) => {
        return await postRequest(`/teacher/absences/${absenceId}/delete`, {
            teacher_id: teacherId
        });
    }
}; 