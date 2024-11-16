"use client"
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc, QueryDocumentSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import '../../app/styles/notifications.css';


// Definirea unui tip pentru datele ce vor fi extrase din Firestore
interface Notification {
  id: string;
  message: string;
  date: string;
}
3
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
          const subjectRef = docSnap.data().id_Subject;
          const subjectDocRef = doc(db, 'Subject', subjectRef);
          const subjectDoc = await getDoc(subjectDocRef);

          const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : 'Subject unknown';

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
          const subjectDocRef = doc(db, 'Subject', subjectRef);
          const subjectDoc = await getDoc(subjectDocRef);

          const subjectName = subjectDoc.exists() ? (subjectDoc.data() as Subject).name : 'Subject unknown';

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
    <div className="container">
      <h2 className="title">Notificări</h2>
      <ul className="list">
        {notifications.map((notification) => (
          <li key={notification.id} className="listItem">
            <p className="message">{notification.message}</p>
            <span className="date">{notification.date}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
