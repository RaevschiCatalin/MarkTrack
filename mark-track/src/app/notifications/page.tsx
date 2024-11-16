"use client"
import { useEffect, useState } from 'react';
import { CSSProperties } from 'react';
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';

// Definirea unui tip pentru datele ce vor fi extrase din Firestore
interface Notification {
  id: string;
  message: string;
  date: string;
}

interface Subject {
  name: string;
}

const Page: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const markSnapshot = await getDocs(collection(db, 'Mark'));
      const absencesSnapshot = await getDocs(collection(db, 'Absences'));

      const marks = await Promise.all(
        markSnapshot.docs.map(async (docSnap: QueryDocumentSnapshot) => {
          // Obține referința la documentul materiei pe baza id_Subject
          const subjectRef = docSnap.data().id_Subject;
          const subjectDocRef = doc(db, 'Subject', subjectRef);  // Crearea corectă a DocumentReference
          const subjectDoc = await getDoc(subjectDocRef);

          // Verificăm dacă documentul există și extragem numele materiei
          const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : 'Materia necunoscută';

          return {
            id: docSnap.id,
            message: `Ai o nouă notă la materia ${subjectName}: ${docSnap.data().mark}`,
            date: docSnap.data().date,
          };
        })
      );

      const absences = await Promise.all(
        absencesSnapshot.docs.map(async (docSnap: QueryDocumentSnapshot) => {
          // Obține referința la documentul materiei pe baza id_Subject
          const subjectRef = docSnap.data().id_Subject;
          const subjectDocRef = doc(db, 'Subject', subjectRef);  // Crearea corectă a DocumentReference
          const subjectDoc = await getDoc(subjectDocRef);

          // Verificăm dacă documentul există și extragem numele materiei
          const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : 'Materia necunoscută';

          return {
            id: docSnap.id,
            message: `Absența din data ${docSnap.data().date} la materia ${subjectName} a fost adăugată în catalog.`,
            date: docSnap.data().date,
          };
        })
      );

      // Combina notificările de tip "mark" și "absence" într-o singură listă
      setNotifications([...marks, ...absences]);
    };

    fetchNotifications();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Notificări</h2>
      <ul style={styles.list}>
        {notifications.map((notification) => (
          <li key={notification.id} style={styles.listItem}>
            <p style={styles.message}>{notification.message}</p>
            <span style={styles.date}>{notification.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  list: {
    listStyleType: 'none',
    padding: 0,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: '15px',
    marginBottom: '10px',
    borderRadius: '5px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  message: {
    margin: 0,
    fontSize: '16px',
  },
  date: {
    display: 'block',
    fontSize: '14px',
    color: '#888',
    marginTop: '5px',
  },
};

export default Page;
