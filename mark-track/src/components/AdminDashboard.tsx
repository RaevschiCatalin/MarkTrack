import { useState, useEffect } from 'react';
import { getRequest, postRequest } from '../context/api';
import Loader from './Loader';
import Select, { MultiValue } from 'react-select';

interface Class {
    id: string;
    name?: string;
    students?: string[];
    subjects: Array<{
        subject_id?: string;
        teacher_id: string;
    }>;
}

interface Subject {
    id: string;
    name: string;
}

interface Teacher {
    id: string;
    first_name: string;
    last_name: string;
    subject_id: string;
}

interface Student {
    id: string;
    first_name: string;
    last_name: string;
    student_id: string;
}

interface StudentOption {
    value: string;
    label: string;
}

export default function AdminDashboard() {
    const [classes, setClasses] = useState<Class[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<string>('');
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const [newSubjectName, setNewSubjectName] = useState('');
    const [selectedStudent, setSelectedStudent] = useState<string>('');
    const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
    const [newClassName, setNewClassName] = useState('');


    const studentOptions: StudentOption[] = students.map(student => ({
        value: student.student_id,
        label: `${student.first_name} ${student.last_name} (${student.student_id})`
    }));

    const handleStudentSelect = (
        selectedOptions: MultiValue<StudentOption>
    ) => {
        setSelectedStudents(selectedOptions.map(option => option.value));
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [classesRes, teachersRes, subjectsRes, studentsRes] = await Promise.all([
                getRequest('/admin/classes'),
                getRequest('/admin/teachers'),
                getRequest('/admin/subjects'),
                getRequest('/admin/students')
            ]);

            setClasses(classesRes.classes);
            setTeachers(teachersRes.teachers);
            setSubjects(subjectsRes.subjects);
            setStudents(studentsRes.students);
        } catch (err) {
            setError('Failed to fetch data');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubjectToClass = async () => {
        try {
            await postRequest(`/admin/classes/${selectedClass}/subjects`, {
                subject_id: selectedSubject,
                teacher_id: selectedTeacher
            });
            
            await fetchData(); 
            
          
            setSelectedClass('');
            setSelectedTeacher('');
            
        } catch (err) {
            setError('Failed to add subject to class');
            console.error(err);
        }
    };

    const handleCreateSubject = async () => {
        try {
            await postRequest('/admin/subjects', { subject_name: newSubjectName });
            await fetchData();
            setNewSubjectName('');
            
        } catch (err) {
            setError('Failed to create subject');
            console.error(err);
        }
    };

    const handleAddStudentToClass = async () => {
        try {
            await postRequest(`/admin/classes/${selectedClass}/students`, {
                student_id: selectedStudent
            });
            console.log(selectedClass, selectedStudent);
            await fetchData();
            setSelectedClass('');
            setSelectedStudent('');
        } catch (err) {
            setError('Failed to add student to class');
            console.error(err);
        }
    };

    const handleBulkAddStudentsToClass = async () => {
        try {
            await postRequest(`/admin/classes/${selectedClass}/students/bulk`, {
                student_ids: selectedStudents
            });
            await fetchData();
            setSelectedClass('');
            setSelectedStudents([]);
        } catch (err: any) {
            if (err.response?.data?.detail?.students) {
                setError(
                    'The following students are already assigned to other classes:\n' +
                    err.response.data.detail.students.join('\n')
                );
            } else {
                setError('Failed to add students to class');
            }
            console.error(err);
        }
    };

    const handleCreateClass = async () => {
        try {
            await postRequest('/admin/classes', {
                class_id: newClassName,
            });
            await fetchData();
            setNewClassName('');
            
        } catch (err) {
            setError('Failed to create class');
            console.error(err);
        }
    };

    if (loading) return <Loader />;
    if (error) return <div className="pt-32 text-red-500">{error}</div>;

    return (
        <div className="pt-32 px-8">
            <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Assign Subject to Class</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.name || cls.id}</option>
                        ))}
                    </select>

                   
                    <select 
                        value={selectedSubject}
                        onChange={(e) => setSelectedSubject(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>{subject.name}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedTeacher}
                        onChange={(e) => setSelectedTeacher(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                            <option key={teacher.id} value={teacher.id}>
                                {`${teacher.first_name} ${teacher.last_name}`}
                            </option>
                        ))}
                    </select>
                </div>
                <button 
                    onClick={handleAddSubjectToClass}
                    disabled={!selectedClass || !selectedSubject || !selectedTeacher}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    Assign
                </button>
            </div>
            
                        
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Subject</h2>
                <div className="flex gap-4">
                    <input
                        type="text"
                        value={newSubjectName}
                        onChange={(e) => setNewSubjectName(e.target.value)}
                        placeholder="Enter subject name"
                        className="border p-2 rounded flex-grow"
                    />
                    <button
                        onClick={handleCreateSubject}
                        disabled={!newSubjectName}
                        className="bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                    >
                        Create Subject
                    </button>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Create New Class</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <input
                        type="text"
                        value={newClassName}
                        onChange={(e) => setNewClassName(e.target.value)}
                        placeholder="Enter class name (e.g., Class 5A)"
                        className="border p-2 rounded"
                    />
                    
                </div>
                <button
                    onClick={handleCreateClass}
                    disabled={!newClassName}
                    className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    Create Class
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <h2 className="text-xl font-semibold mb-4">Assign Students to Class</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <select 
                        value={selectedClass}
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="border p-2 rounded"
                    >
                        <option value="">Select Class</option>
                        {classes.map((cls) => (
                            <option key={cls.id} value={cls.id}>{cls.name || cls.id}</option>
                        ))}
                    </select>

                    <Select
                        isMulti
                        options={studentOptions}
                        value={studentOptions.filter(option => 
                            selectedStudents.includes(option.value)
                        )}
                        onChange={handleStudentSelect}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Search and select students..."
                        isClearable={true}
                        isSearchable={true}
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        styles={{
                            control: (baseStyles) => ({
                                ...baseStyles,
                                minHeight: '42px',
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                display: 'flex',
                                alignItems: 'center',
                                padding: '8px 12px',
                            }),
                            multiValue: (baseStyles) => ({
                                ...baseStyles,
                                backgroundColor: '#EBF5FF',
                                borderRadius: '4px',
                            }),
                            multiValueLabel: (baseStyles) => ({
                                ...baseStyles,
                                color: '#2563EB',
                                padding: '2px 6px',
                            }),
                            multiValueRemove: (baseStyles) => ({
                                ...baseStyles,
                                color: '#2563EB',
                                ':hover': {
                                    backgroundColor: '#DBEAFE',
                                    color: '#1E40AF',
                                },
                            }),
                        }}
                    />
                </div>
                <button 
                    onClick={handleBulkAddStudentsToClass}
                    disabled={!selectedClass || selectedStudents.length === 0}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-300"
                >
                    Assign Students ({selectedStudents.length} selected)
                </button>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Classes Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((cls) => (
                        <div key={cls.id} className="border p-4 rounded">
                            <h3 className="font-bold">{cls.name || cls.id}</h3>
                            <div className="mt-2">
                                <h4 className="font-semibold">Students:</h4>
                                <ul className="list-disc pl-4">
                                    {cls.students?.map((studentId) => {
                                        const studentData = students.find(s => s.student_id === studentId);
                                        return (
                                            <li key={studentId}>
                                                {studentData 
                                                    ? `${studentData.first_name} ${studentData.last_name} (${studentData.student_id})`
                                                    : studentId
                                                }
                                            </li>
                                        );
                                    })}
                                </ul>
                                <h4 className="font-semibold mt-2">Subjects:</h4>
                                <ul className="list-disc pl-4">
                                    {cls.subjects?.map((subject, index) => {
                                        const subjectData = subject.subject_id ? subjects.find(s => s.id === subject.subject_id) : null;
                                        const teacherData = teachers.find(t => t.id === subject.teacher_id);
                                        return (
                                            <li key={index}>
                                                {subjectData ? subjectData.name : 'Unknown Subject'} - {teacherData ? `${teacherData.first_name} ${teacherData.last_name}` : 'Unknown Teacher'}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}