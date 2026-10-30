import { 
  collection, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  addDoc, 
  deleteDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp,
  getDocs,
  limit
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, ADMIN_EMAIL, auth } from '../firebase.ts';
import { 
  LibrarySettings, 
  Student, 
  Announcement, 
  AdmissionEnquiry, 
  AttendanceLog, 
  GalleryItem 
} from '../types.ts';

const SETTINGS_DOC_ID = 'general';

export const DEFAULT_SETTINGS: LibrarySettings = {
  libraryOpen: true,
  statusMessage: "Library is open for silent self-study. High-speed Wi-Fi & inverter backup are active.",
  presentCount: 12,
  capacity: 30,
  keyHolderName: "Karan Kamal (Incharge)",
  keyHolderPhone: "9870931288",
  keyHolderNote: "Library Key is currently at the reception desk / with Incharge.",
  lastModified: new Date().toISOString(),
  updatedBy: "System",
  inchargeName: "Karan Kamal",
  inchargePhone: "9870931288",
  inchargeAltPhone: "7534805520"
};

export const INITIAL_STUDENTS: Omit<Student, 'id'>[] = [
  {
    name: "Satyam Yadav",
    fatherName: "Rajendra Yadav",
    phone: "9870931288",
    villageTown: "Mangupur",
    examTarget: "UP Police Constable",
    seatNumber: 1,
    status: "active",
    isPresent: true,
    joinedAt: "2024-01-15",
    lastAttendanceTime: "Today at 07:30 AM"
  },
  {
    name: "Prashant Kumar",
    fatherName: "Mukesh Kumar",
    phone: "9456123456",
    villageTown: "Bharthana",
    examTarget: "SSC CGL",
    seatNumber: 2,
    status: "active",
    isPresent: true,
    joinedAt: "2024-02-01",
    lastAttendanceTime: "Today at 08:00 AM"
  },
  {
    name: "Rohit Shakya",
    fatherName: "Suresh Shakya",
    phone: "9837112233",
    villageTown: "Samho",
    examTarget: "UPSSSC VDO",
    seatNumber: 3,
    status: "active",
    isPresent: true,
    joinedAt: "2024-02-10",
    lastAttendanceTime: "Today at 08:15 AM"
  },
  {
    name: "Aman Tiwari",
    fatherName: "Dinesh Tiwari",
    phone: "9123456780",
    villageTown: "Mangupur",
    examTarget: "UPSC CSE",
    seatNumber: 4,
    status: "active",
    isPresent: true,
    joinedAt: "2024-01-20",
    lastAttendanceTime: "Today at 08:30 AM"
  },
  {
    name: "Abhishek Pal",
    fatherName: "Ramswaroop Pal",
    phone: "9719887766",
    villageTown: "Bakewar",
    examTarget: "Railway RRB ALP",
    seatNumber: 5,
    status: "active",
    isPresent: true,
    joinedAt: "2024-03-01",
    lastAttendanceTime: "Today at 08:45 AM"
  },
  {
    name: "Vikas Rajput",
    fatherName: "Chandra Pal Rajput",
    phone: "9568112233",
    villageTown: "Usrahar",
    examTarget: "UP Police SI",
    seatNumber: 6,
    status: "active",
    isPresent: false,
    joinedAt: "2024-02-15",
    lastAttendanceTime: "Yesterday at 05:00 PM"
  },
  {
    name: "Ankit Porwal",
    fatherName: "Ashok Porwal",
    phone: "9412334455",
    villageTown: "Bharthana Mandi",
    examTarget: "Banking IBPS PO",
    seatNumber: 7,
    status: "active",
    isPresent: true,
    joinedAt: "2024-03-05",
    lastAttendanceTime: "Today at 09:00 AM"
  },
  {
    name: "Deepak Kumar",
    fatherName: "Ramvilas",
    phone: "9634556677",
    villageTown: "Mangupur",
    examTarget: "Airforce / NDA",
    seatNumber: 8,
    status: "active",
    isPresent: true,
    joinedAt: "2024-03-10",
    lastAttendanceTime: "Today at 09:15 AM"
  }
];

export const INITIAL_ANNOUNCEMENTS: Omit<Announcement, 'id'>[] = [
  {
    title: "24x7 Self-Study Facility Open for Aspirants",
    content: "Mangupur Library provides free seating, high-speed Wi-Fi, and an absolutely peaceful environment for UP Police, SSC, UPSC, and State competitive exams. Please maintain complete silence.",
    tag: "Notice",
    isPinned: true,
    createdAt: "2025-01-10",
    author: "Karan Kamal (Incharge)"
  },
  {
    title: "Quiet Hours & Discipline Guidelines",
    content: "All students are requested to keep mobile phones on strict silent mode. Discussion or group speaking inside the reading hall is strictly prohibited to maintain deep focus.",
    tag: "Timing",
    isPinned: true,
    createdAt: "2025-02-01",
    author: "Karan Kamal"
  },
  {
    title: "Weekly Mock Test Discussion - Sunday 4:00 PM",
    content: "A combined self-analysis session for UP Police Constable and SSC aspirants will take place this Sunday outside the silent reading hall.",
    tag: "Exam Alert",
    isPinned: false,
    createdAt: "2025-02-14",
    author: "Karan Kamal"
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    imageUrl: "/l1.jpg",
    caption: "Mangupur Library Main Silent Reading Hall with Wooden Desks",
    category: "Reading Hall",
    order: 1
  },
  {
    id: "g2",
    imageUrl: "/l2.jpg",
    caption: "Dedicated Self-Study Desks with Soft Warm Reading Lighting",
    category: "Study Desks",
    order: 2
  },
  {
    id: "g3",
    imageUrl: "/l3.jpg",
    caption: "Comprehensive Reference Bookshelf & Silent Study Zone",
    category: "Bookshelves",
    order: 3
  }
];

/**
 * Bootstrap database with initial settings and sample records if empty.
 */
export async function initializeDatabaseIfEmpty() {
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const settingsSnap = await getDoc(settingsRef);

    if (!settingsSnap.exists()) {
      await setDoc(settingsRef, DEFAULT_SETTINGS);
      console.log('Seeded initial library settings');
    }

    // Seed students if collection is empty
    const studentsSnap = await getDocs(query(collection(db, 'students'), limit(1)));
    if (studentsSnap.empty) {
      for (const st of INITIAL_STUDENTS) {
        await addDoc(collection(db, 'students'), st);
      }
      console.log('Seeded initial student roster');
    }

    // Seed announcements if empty
    const announcementsSnap = await getDocs(query(collection(db, 'announcements'), limit(1)));
    if (announcementsSnap.empty) {
      for (const an of INITIAL_ANNOUNCEMENTS) {
        await addDoc(collection(db, 'announcements'), an);
      }
      console.log('Seeded initial announcements');
    }
  } catch (error) {
    // If permission denied because visitor is not admin, ignore graceful read fallback
    console.warn('Initial bootstrap check:', error);
  }
}

/**
 * Real-time listener for Library Settings
 */
export function subscribeLibrarySettings(onUpdate: (settings: LibrarySettings) => void) {
  const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
  return onSnapshot(settingsRef, (docSnap) => {
    if (docSnap.exists()) {
      onUpdate(docSnap.data() as LibrarySettings);
    } else {
      onUpdate(DEFAULT_SETTINGS);
    }
  }, (error) => {
    console.error('Settings listener error:', error);
    onUpdate(DEFAULT_SETTINGS);
  });
}

/**
 * Real-time listener for Students
 */
export function subscribeStudents(onUpdate: (students: Student[]) => void) {
  const studentsRef = collection(db, 'students');
  return onSnapshot(studentsRef, (querySnap) => {
    const students: Student[] = [];
    querySnap.forEach((d) => {
      students.push({
        id: d.id,
        ...(d.data() as Omit<Student, 'id'>)
      });
    });
    // Sort by seat number or name
    students.sort((a, b) => (a.seatNumber || 99) - (b.seatNumber || 99));
    onUpdate(students);
  }, (error) => {
    console.error('Students listener error:', error);
    onUpdate(INITIAL_STUDENTS.map((s, idx) => ({ id: `init-${idx}`, ...s })));
  });
}

/**
 * Real-time listener for Announcements
 */
export function subscribeAnnouncements(onUpdate: (announcements: Announcement[]) => void) {
  const announcementsRef = collection(db, 'announcements');
  return onSnapshot(announcementsRef, (querySnap) => {
    const announcements: Announcement[] = [];
    querySnap.forEach((d) => {
      announcements.push({
        id: d.id,
        ...(d.data() as Omit<Announcement, 'id'>)
      });
    });
    // Sort pinned first, then by date descending
    announcements.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.createdAt.localeCompare(a.createdAt);
    });
    onUpdate(announcements);
  }, (error) => {
    console.error('Announcements listener error:', error);
    onUpdate(INITIAL_ANNOUNCEMENTS.map((a, idx) => ({ id: `init-${idx}`, ...a })));
  });
}

/**
 * Real-time listener for Enquiries (Admin only)
 */
export function subscribeEnquiries(onUpdate: (enquiries: AdmissionEnquiry[]) => void) {
  const enquiriesRef = collection(db, 'enquiries');
  return onSnapshot(enquiriesRef, (querySnap) => {
    const list: AdmissionEnquiry[] = [];
    querySnap.forEach((d) => {
      list.push({
        id: d.id,
        ...(d.data() as Omit<AdmissionEnquiry, 'id'>)
      });
    });
    list.sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
    onUpdate(list);
  }, (error) => {
    console.error('Enquiries listener error:', error);
    onUpdate([]);
  });
}

/**
 * Real-time listener for Attendance Logs
 */
export function subscribeAttendanceLogs(onUpdate: (logs: AttendanceLog[]) => void) {
  const logsRef = collection(db, 'attendance');
  return onSnapshot(logsRef, (querySnap) => {
    const list: AttendanceLog[] = [];
    querySnap.forEach((d) => {
      list.push({
        id: d.id,
        ...(d.data() as Omit<AttendanceLog, 'id'>)
      });
    });
    list.sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));
    onUpdate(list);
  }, (error) => {
    console.error('Attendance logs listener error:', error);
    onUpdate([]);
  });
}

/**
 * Real-time listener for Gallery items
 */
export function subscribeGallery(onUpdate: (items: GalleryItem[]) => void) {
  const galleryRef = collection(db, 'gallery');
  return onSnapshot(galleryRef, (querySnap) => {
    const items: GalleryItem[] = [];
    querySnap.forEach((d) => {
      items.push({
        id: d.id,
        ...(d.data() as Omit<GalleryItem, 'id'>)
      });
    });
    if (items.length > 0) {
      items.sort((a, b) => (a.order || 0) - (b.order || 0));
      onUpdate(items);
    } else {
      onUpdate(INITIAL_GALLERY);
    }
  }, (error) => {
    console.error('Gallery listener error:', error);
    onUpdate(INITIAL_GALLERY);
  });
}

/**
 * Submit Admission Enquiry from visitor
 */
export async function submitAdmissionEnquiry(enquiry: Omit<AdmissionEnquiry, 'id' | 'status' | 'submittedAt'>) {
  const path = 'enquiries';
  try {
    const docData = {
      ...enquiry,
      status: 'pending' as const,
      submittedAt: new Date().toISOString()
    };
    const res = await addDoc(collection(db, path), docData);
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update Library Operational Status & Message (Admin)
 */
export async function updateLibrarySettings(updates: Partial<LibrarySettings>, adminEmail: string) {
  const path = `settings/${SETTINGS_DOC_ID}`;
  try {
    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    const dataToSave = {
      ...updates,
      lastModified: new Date().toISOString(),
      updatedBy: adminEmail
    };
    await updateDoc(settingsRef, dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Mark student present or absent (Admin)
 * Also recalculates total present students and logs attendance record!
 */
export async function markStudentAttendance(
  student: Student, 
  newIsPresent: boolean, 
  currentStudents: Student[], 
  adminEmail: string
) {
  const studentPath = `students/${student.id}`;
  try {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    // 1. Update Student record
    const studentRef = doc(db, 'students', student.id);
    await updateDoc(studentRef, {
      isPresent: newIsPresent,
      lastAttendanceTime: `${dateStr} at ${timeStr}`
    });

    // 2. Add Attendance Log entry
    await addDoc(collection(db, 'attendance'), {
      studentId: student.id,
      studentName: student.name,
      examTarget: student.examTarget || 'General',
      date: dateStr,
      time: timeStr,
      status: newIsPresent ? 'present' : 'absent',
      markedBy: adminEmail
    });

    // 3. Recalculate present students count and update settings
    const updatedCount = currentStudents.reduce((acc, s) => {
      if (s.id === student.id) {
        return acc + (newIsPresent ? 1 : 0);
      }
      return acc + (s.isPresent ? 1 : 0);
    }, 0);

    const settingsRef = doc(db, 'settings', SETTINGS_DOC_ID);
    await updateDoc(settingsRef, {
      presentCount: Math.min(30, Math.max(0, updatedCount)),
      lastModified: now.toISOString(),
      updatedBy: adminEmail
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, studentPath);
  }
}

/**
 * Add a new student record (Admin)
 */
export async function addStudent(studentData: Omit<Student, 'id'>, adminEmail: string) {
  const path = 'students';
  try {
    const res = await addDoc(collection(db, path), studentData);
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update an existing student record (Admin)
 */
export async function updateStudent(id: string, studentData: Partial<Student>, adminEmail: string) {
  const path = `students/${id}`;
  try {
    const studentRef = doc(db, 'students', id);
    await updateDoc(studentRef, studentData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete a student record (Admin)
 */
export async function deleteStudent(id: string, adminEmail: string) {
  const path = `students/${id}`;
  try {
    const studentRef = doc(db, 'students', id);
    await deleteDoc(studentRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Add Announcement (Admin)
 */
export async function addAnnouncement(data: Omit<Announcement, 'id'>) {
  const path = 'announcements';
  try {
    const res = await addDoc(collection(db, path), data);
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

/**
 * Update Announcement (Admin)
 */
export async function updateAnnouncement(id: string, data: Partial<Announcement>) {
  const path = `announcements/${id}`;
  try {
    const ref = doc(db, 'announcements', id);
    await updateDoc(ref, data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Delete Announcement (Admin)
 */
export async function deleteAnnouncement(id: string) {
  const path = `announcements/${id}`;
  try {
    const ref = doc(db, 'announcements', id);
    await deleteDoc(ref);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

/**
 * Update Admission Enquiry Status (Admin)
 */
export async function updateEnquiryStatus(id: string, status: AdmissionEnquiry['status']) {
  const path = `enquiries/${id}`;
  try {
    const ref = doc(db, 'enquiries', id);
    await updateDoc(ref, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

/**
 * Add Gallery item (Admin)
 */
export async function addGalleryItem(item: Omit<GalleryItem, 'id'>) {
  const path = 'gallery';
  try {
    const res = await addDoc(collection(db, path), item);
    return res.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
