import {getRequest} from "@/context/api";

export const studentService = {
    fetchStudentMarksAndAbsences: async (studentId: string) => {
        const marksResponse = await getRequest(`/teacher/students/${studentId}/marks`);
        const absencesResponse = await getRequest(`/teacher/students/${studentId}/absences`);
        return {
            marks: marksResponse.marks, absences: absencesResponse.absences
        }
    }
}