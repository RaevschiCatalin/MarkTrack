export interface NotificationBase {
    student_id: string;
    teacher_id: string;
    subject_id: string;
}

export interface MarkNotification extends NotificationBase {
    id: string;
    value: number;
    description: string;
    time: Date;
}

export interface AbsenceNotification extends NotificationBase {
    id: string;
    is_motivated: boolean;
    description: string;
    time: Date;
}