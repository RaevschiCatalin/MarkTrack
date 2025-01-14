import {getRequest} from "@/context/api";

export const studentService = {
    fetchStudentMarksAndAbsences: async (studentId: string) => {
        const gradesResponse = await getRequest(`/teacher/students/${studentId}/marks`);
        const absencesResponse = await getRequest(`/teacher/students/${studentId}/absences`);
        return {
            grades: gradesResponse.marks, absences: absencesResponse.absences
        }
    }
}