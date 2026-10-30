import React, { useState } from 'react';
import { 
  Users, 
  Key, 
  Bell, 
  Image as ImageIcon, 
  FileText, 
  CheckCircle2, 
  XCircle, 
  Power, 
  Plus, 
  Trash2, 
  Edit3, 
  Phone, 
  MessageSquare, 
  Search, 
  Calendar, 
  Clock, 
  LogOut, 
  X, 
  Check, 
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Save,
  Loader2
} from 'lucide-react';
import { 
  LibrarySettings, 
  Student, 
  Announcement, 
  AdmissionEnquiry, 
  AttendanceLog, 
  GalleryItem 
} from '../types.ts';
import { 
  updateLibrarySettings, 
  markStudentAttendance, 
  addStudent, 
  updateStudent, 
  deleteStudent,
  addAnnouncement,
  deleteAnnouncement,
  updateEnquiryStatus,
  addGalleryItem
} from '../services/libraryService.ts';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
  settings: LibrarySettings;
  students: Student[];
  announcements: Announcement[];
  enquiries: AdmissionEnquiry[];
  attendanceLogs: AttendanceLog[];
  galleryItems: GalleryItem[];
  onSignOut: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  adminEmail,
  settings,
  students,
  announcements,
  enquiries,
  attendanceLogs,
  galleryItems,
  onSignOut
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'students' | 'enquiries' | 'announcements' | 'attendance' | 'gallery'>('status');

  // Status settings local state
  const [libraryOpen, setLibraryOpen] = useState(settings.libraryOpen);
  const [statusMessage, setStatusMessage] = useState(settings.statusMessage);
  const [keyHolderName, setKeyHolderName] = useState(settings.keyHolderName);
  const [keyHolderPhone, setKeyHolderPhone] = useState(settings.keyHolderPhone);
  const [keyHolderNote, setKeyHolderNote] = useState(settings.keyHolderNote);
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState('');

  // Student management modal state
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [studentFormName, setStudentFormName] = useState('');
  const [studentFormFather, setStudentFormFather] = useState('');
  const [studentFormPhone, setStudentFormPhone] = useState('');
  const [studentFormVillage, setStudentFormVillage] = useState('');
  const [studentFormExam, setStudentFormExam] = useState('UP Police Constable');
  const [studentFormSeat, setStudentFormSeat] = useState<number | ''>('');
  const [studentSearch, setStudentSearch] = useState('');

  // Announcement form state
  const [showAnnounceModal, setShowAnnounceModal] = useState(false);
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annTag, setAnnTag] = useState<Announcement['tag']>('Notice');
  const [annPinned, setAnnPinned] = useState(false);

  // Gallery form state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newImageCaption, setNewImageCaption] = useState('');
  const [newImageCategory, setNewImageCategory] = useState('Reading Hall');

  if (!isOpen) return null;

  // Save Settings handler
  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingSettings(true);
    setSaveSuccessNotice('');
    try {
      await updateLibrarySettings({
        libraryOpen,
        statusMessage,
        keyHolderName,
        keyHolderPhone,
        keyHolderNote
      }, adminEmail);
      setSaveSuccessNotice('Settings and Key Holder info updated successfully! Synced to visitors.');
      setTimeout(() => setSaveSuccessNotice(''), 4000);
    } catch (err: any) {
      alert('Error updating settings: ' + err.message);
    } finally {
      setIsSavingSettings(false);
    }
  };

  // Toggle present/absent
  const handleToggleAttendance = async (student: Student) => {
    try {
      await markStudentAttendance(student, !student.isPresent, students, adminEmail);
    } catch (err: any) {
      alert('Attendance error: ' + err.message);
    }
  };

  // Save student (Add / Edit)
  const handleSaveStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentFormName.trim()) return;

    try {
      if (editingStudent) {
        await updateStudent(editingStudent.id, {
          name: studentFormName.trim(),
          fatherName: studentFormFather.trim(),
          phone: studentFormPhone.trim(),
          villageTown: studentFormVillage.trim(),
          examTarget: studentFormExam,
          seatNumber: studentFormSeat === '' ? null : Number(studentFormSeat)
        }, adminEmail);
      } else {
        await addStudent({
          name: studentFormName.trim(),
          fatherName: studentFormFather.trim(),
          phone: studentFormPhone.trim(),
          villageTown: studentFormVillage.trim(),
          examTarget: studentFormExam,
          seatNumber: studentFormSeat === '' ? null : Number(studentFormSeat),
          status: 'active',
          isPresent: false,
          joinedAt: new Date().toISOString().split('T')[0],
          lastAttendanceTime: 'Registered'
        }, adminEmail);
      }
      setShowStudentModal(false);
      resetStudentForm();
    } catch (err: any) {
      alert('Failed to save student: ' + err.message);
    }
  };

  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setStudentFormName(student.name);
    setStudentFormFather(student.fatherName || '');
    setStudentFormPhone(student.phone || '');
    setStudentFormVillage(student.villageTown || '');
    setStudentFormExam(student.examTarget || 'UP Police Constable');
    setStudentFormSeat(student.seatNumber || '');
    setShowStudentModal(true);
  };

  const handleDeleteStudent = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete student ${name}?`)) {
      try {
        await deleteStudent(id, adminEmail);
      } catch (err: any) {
        alert('Failed to delete student: ' + err.message);
      }
    }
  };

  const resetStudentForm = () => {
    setEditingStudent(null);
    setStudentFormName('');
    setStudentFormFather('');
    setStudentFormPhone('');
    setStudentFormVillage('');
    setStudentFormExam('UP Police Constable');
    setStudentFormSeat('');
  };

  // Save Announcement
  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) return;

    try {
      await addAnnouncement({
        title: annTitle.trim(),
        content: annContent.trim(),
        tag: annTag,
        isPinned: annPinned,
        createdAt: new Date().toISOString().split('T')[0],
        author: 'Karan Kamal (Incharge)'
      });
      setShowAnnounceModal(false);
      setAnnTitle('');
      setAnnContent('');
    } catch (err: any) {
      alert('Failed to add notice: ' + err.message);
    }
  };

  // Delete Announcement
  const handleDeleteAnnouncement = async (id: string) => {
    if (window.confirm('Delete this announcement?')) {
      try {
        await deleteAnnouncement(id);
      } catch (err: any) {
        alert('Failed to delete announcement: ' + err.message);
      }
    }
  };

  // Add Gallery photo
  const handleAddGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImageUrl.trim() || !newImageCaption.trim()) return;

    try {
      await addGalleryItem({
        imageUrl: newImageUrl.trim(),
        caption: newImageCaption.trim(),
        category: newImageCategory,
        order: galleryItems.length + 1
      });
      setShowGalleryModal(false);
      setNewImageUrl('');
      setNewImageCaption('');
    } catch (err: any) {
      alert('Failed to add gallery item: ' + err.message);
    }
  };

  const filteredStudents = students.filter(s => {
    if (!studentSearch.trim()) return true;
    const q = studentSearch.toLowerCase();
    return s.name.toLowerCase().includes(q) || 
           s.examTarget?.toLowerCase().includes(q) || 
           s.villageTown?.toLowerCase().includes(q) ||
           s.phone?.includes(q);
  });

  const presentCount = students.filter(s => s.isPresent).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-[#FAF9F5] rounded-2xl max-w-5xl w-full border border-[#DFDACB] shadow-2xl overflow-hidden my-4 flex flex-col max-h-[92vh]"
      >
        {/* Top Bar */}
        <div className="p-4 bg-[#173824] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#E5C378] text-[#173824] flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-[#173824]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-serif text-lg font-bold">Mangupur Library Admin</h3>
                <span className="px-2 py-0.5 rounded bg-white/20 text-[#E5C378] text-[10px] font-bold">
                  Authorized Incharge
                </span>
              </div>
              <p className="text-[11px] text-[#BED4C7] truncate max-w-xs sm:max-w-none">
                Logged in as: {adminEmail}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onSignOut}
              className="px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs flex items-center space-x-1.5 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#EFECE3] border-b border-[#DCD7C7] px-3 pt-2 flex items-center space-x-1 overflow-x-auto text-xs shrink-0 select-none">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'status'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <Power className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Library ON/OFF & Chabi</span>
          </button>

          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'students'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Students & Attendance ({presentCount}/{settings.capacity})</span>
          </button>

          <button
            onClick={() => setActiveTab('attendance')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'attendance'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Attendance History</span>
          </button>

          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'enquiries'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Admissions ({enquiries.filter(e => e.status === 'pending').length} new)</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'announcements'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Announcements</span>
          </button>

          <button
            onClick={() => setActiveTab('gallery')}
            className={`px-3.5 py-2 rounded-t-lg font-bold flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'gallery'
                ? 'bg-[#FAF9F5] text-[#163823] border-t-2 border-t-[#1B3B2B] shadow-xs'
                : 'text-[#5A6E61] hover:text-[#173824]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Gallery</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {saveSuccessNotice && (
            <div className="p-3 rounded-xl bg-[#E6F3E9] border border-[#A7D4B2] text-[#18532C] text-xs font-semibold flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>{saveSuccessNotice}</span>
            </div>
          )}

          {/* TAB 1: Library ON/OFF, Status Message & Chabi Kiske Paas Hai */}
          {activeTab === 'status' && (
            <form onSubmit={handleSaveSettings} className="space-y-6 text-xs max-w-2xl">
              {/* Main Toggle */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DFDACB] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-[#183623]">
                    Library Door Status (ON / OFF)
                  </h4>
                  <p className="text-[#55695D] text-xs mt-0.5">
                    Controls whether visitors see the library as OPEN or CLOSED right now.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setLibraryOpen(!libraryOpen)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center space-x-2 transition-all shadow-xs ${
                    libraryOpen
                      ? 'bg-[#1E4D30] text-white hover:bg-[#153B24]'
                      : 'bg-[#8F3320] text-white hover:bg-[#722718]'
                  }`}
                >
                  <Power className="w-4 h-4" />
                  <span>{libraryOpen ? 'OPEN (CLICK TO CLOSE)' : 'CLOSED (CLICK TO OPEN)'}</span>
                </button>
              </div>

              {/* Status Message */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#DFDACB] shadow-xs space-y-3">
                <label className="block font-bold text-sm text-[#183623]">
                  Live Status Notice to Visitors
                </label>
                <textarea
                  rows={2}
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="e.g. Library is open for silent study. Inverter power backup active."
                  className="w-full p-2.5 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                />
              </div>

              {/* Chabi Kiske Paas Hai Section */}
              <div className="bg-[#FAF7EE] p-4 sm:p-5 rounded-2xl border-2 border-[#D9CEB4] shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <Key className="w-4 h-4 text-[#B88E3E]" />
                  <h4 className="font-serif font-bold text-sm sm:text-base text-[#193824]">
                    "चाबी किसके पास है?" (Who has the key right now?)
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-[#273B2F] mb-1">
                      Key Holder Name
                    </label>
                    <input
                      type="text"
                      value={keyHolderName}
                      onChange={(e) => setKeyHolderName(e.target.value)}
                      placeholder="e.g. Karan Kamal / Satyam Yadav"
                      className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-white text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#273B2F] mb-1">
                      Key Holder Phone
                    </label>
                    <input
                      type="text"
                      value={keyHolderPhone}
                      onChange={(e) => setKeyHolderPhone(e.target.value)}
                      placeholder="e.g. 9870931288"
                      className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-white text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#273B2F] mb-1">
                    Key Location / Availability Note
                  </label>
                  <input
                    type="text"
                    value={keyHolderNote}
                    onChange={(e) => setKeyHolderNote(e.target.value)}
                    placeholder="e.g. Available at reception desk / near Primary School"
                    className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-white text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-6 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#142E21] text-white text-xs font-bold flex items-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isSavingSettings ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5C378]" />
                ) : (
                  <>
                    <Save className="w-4 h-4 text-[#E5C378]" />
                    <span>Save All Changes & Publish Live</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* TAB 2: Students & Attendance Management */}
          {activeTab === 'students' && (
            <div className="space-y-4 text-xs">
              {/* Header metrics & add student button */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-[#DFDACB]">
                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6D7D72]">Inside Hall</span>
                    <p className="text-xl font-extrabold text-[#173824]">{presentCount} of 30</p>
                  </div>
                  <div className="h-8 w-px bg-[#E4E0D2]"></div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-[#6D7D72]">Total Enrolled</span>
                    <p className="text-xl font-extrabold text-[#946E28]">{students.length}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#88978D] absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={studentSearch}
                      onChange={(e) => setStudentSearch(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                    />
                  </div>

                  <button
                    onClick={() => {
                      resetStudentForm();
                      setShowStudentModal(true);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#142E21] text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>Add Student</span>
                  </button>
                </div>
              </div>

              {/* Students Table */}
              <div className="bg-white rounded-xl border border-[#DFDACB] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] text-[#4A5D51] font-semibold border-b border-[#ECE8DC] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-3">Seat</th>
                        <th className="py-3 px-3">Student Name</th>
                        <th className="py-3 px-3">Private Mobile (Admin Only)</th>
                        <th className="py-3 px-3">Village / Town</th>
                        <th className="py-3 px-3">Target Exam</th>
                        <th className="py-3 px-3">Live Presence</th>
                        <th className="py-3 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFE6]">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-8 text-center text-[#708076]">
                            No students registered yet. Click "Add Student" above.
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((st) => (
                          <tr key={st.id} className="hover:bg-[#F9F8F2] transition-colors">
                            <td className="py-2.5 px-3 font-mono font-bold text-[#1F3E2B]">
                              {st.seatNumber ? `S-${String(st.seatNumber).padStart(2, '0')}` : '-'}
                            </td>
                            <td className="py-2.5 px-3">
                              <span className="font-bold text-[#173824] block">{st.name}</span>
                              {st.fatherName && (
                                <span className="text-[10px] text-[#78897E]">S/o {st.fatherName}</span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 font-mono text-[#253D2E]">
                              {st.phone ? (
                                <a href={`tel:${st.phone}`} className="hover:text-[#B88E3E] flex items-center space-x-1">
                                  <Phone className="w-3 h-3 text-[#A89A7A]" />
                                  <span>{st.phone}</span>
                                </a>
                              ) : '-'}
                            </td>
                            <td className="py-2.5 px-3 text-[#4A5D51]">{st.villageTown || '-'}</td>
                            <td className="py-2.5 px-3">
                              <span className="px-2 py-0.5 rounded-full bg-[#EFE8D6] text-[#71541D] text-[10px] font-semibold border border-[#DBCFA7]">
                                {st.examTarget}
                              </span>
                            </td>
                            <td className="py-2.5 px-3">
                              <button
                                onClick={() => handleToggleAttendance(st)}
                                className={`px-2.5 py-1 rounded-md text-[11px] font-bold flex items-center space-x-1 transition-all ${
                                  st.isPresent
                                    ? 'bg-[#D7EBDC] text-[#144725] hover:bg-[#C8E4CF]'
                                    : 'bg-[#ECE9DE] text-[#697A70] hover:bg-[#E0DDD1]'
                                }`}
                              >
                                {st.isPresent ? (
                                  <>
                                    <Check className="w-3 h-3 text-[#2E7D32]" />
                                    <span>Present</span>
                                  </>
                                ) : (
                                  <>
                                    <X className="w-3 h-3" />
                                    <span>Absent</span>
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-2.5 px-3 text-right">
                              <div className="flex items-center justify-end space-x-1">
                                <button
                                  onClick={() => handleOpenEditStudent(st)}
                                  className="p-1 rounded text-[#5D7063] hover:text-[#173824] hover:bg-[#E8E6DB]"
                                  title="Edit Student"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteStudent(st.id, st.name)}
                                  className="p-1 rounded text-[#7F8F84] hover:text-[#C53030] hover:bg-[#FDF2F2]"
                                  title="Delete Student"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Attendance Logs History */}
          {activeTab === 'attendance' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#DFDACB] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#183623]">Daily Attendance Audit History</h4>
                  <p className="text-xs text-[#526357]">
                    Automatic timestamp logs generated whenever students are marked present or absent.
                  </p>
                </div>
                <span className="text-xs font-bold text-[#8F6F26] bg-[#FAF7EE] px-3 py-1 rounded-full border border-[#E1D4B7]">
                  {attendanceLogs.length} Total Logs Recorded
                </span>
              </div>

              <div className="bg-white rounded-xl border border-[#DFDACB] overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-[#FAF9F5] text-[#4A5D51] font-semibold border-b border-[#ECE8DC] uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Date</th>
                        <th className="py-3 px-4">Time</th>
                        <th className="py-3 px-4">Student Name</th>
                        <th className="py-3 px-4">Target Exam</th>
                        <th className="py-3 px-4">Marked Status</th>
                        <th className="py-3 px-4">Admin</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F1EFE6]">
                      {attendanceLogs.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-[#708076]">
                            No attendance history logs recorded yet. Toggle any student above to create first record.
                          </td>
                        </tr>
                      ) : (
                        attendanceLogs.slice(0, 50).map((log, idx) => (
                          <tr key={log.id || idx} className="hover:bg-[#F9F8F2] transition-colors">
                            <td className="py-2.5 px-4 font-mono">{log.date}</td>
                            <td className="py-2.5 px-4 font-mono text-[#6A7B70]">{log.time}</td>
                            <td className="py-2.5 px-4 font-bold text-[#143020]">{log.studentName}</td>
                            <td className="py-2.5 px-4 text-[#4A5D51]">{log.examTarget}</td>
                            <td className="py-2.5 px-4">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                log.status === 'present' ? 'bg-[#E1EFE4] text-[#1B5731]' : 'bg-[#ECE9DE] text-[#697A70]'
                              }`}>
                                {log.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-[#7A8C81] text-[10px]">{log.markedBy || 'Incharge'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Admission Enquiries */}
          {activeTab === 'enquiries' && (
            <div className="space-y-4 text-xs">
              <div className="bg-white p-4 rounded-xl border border-[#DFDACB] flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-[#183623]">Prospective Admission Enquiries</h4>
                  <p className="text-xs text-[#526357]">
                    Submitted via public website "Join Library" form. Call or message applicant directly.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {enquiries.length === 0 ? (
                  <div className="bg-white rounded-xl border border-[#DFDACB] p-8 text-center text-[#708076]">
                    No new admission applications received yet.
                  </div>
                ) : (
                  enquiries.map((enq) => (
                    <div
                      key={enq.id}
                      className="bg-white rounded-xl border border-[#DFDACB] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-[#143020]">{enq.fullName}</span>
                          {enq.fatherName && (
                            <span className="text-[11px] text-[#718276]">S/o {enq.fatherName}</span>
                          )}
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            enq.status === 'admitted' ? 'bg-[#E1EFE4] text-[#1B5731]' :
                            enq.status === 'contacted' ? 'bg-[#FFF6E5] text-[#8C6013]' :
                            enq.status === 'declined' ? 'bg-[#F9ECEB] text-[#9A2D23]' :
                            'bg-[#EFE8D6] text-[#71541D]'
                          }`}>
                            {enq.status}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#4E5E53]">
                          <span>Village: <strong>{enq.villageTown}</strong></span>
                          <span>Target: <strong className="text-[#193F27]">{enq.examTarget}</strong></span>
                          <span>Shift: <strong>{enq.preferredShift}</strong></span>
                          <span>Applied: <strong>{new Date(enq.submittedAt).toLocaleDateString()}</strong></span>
                        </div>

                        {enq.notes && (
                          <p className="text-[11px] text-[#69796E] italic bg-[#FAF9F5] p-2 rounded border border-[#E9E6DA]">
                            "{enq.notes}"
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 shrink-0">
                        {/* WhatsApp button */}
                        <a
                          href={`https://wa.me/91${enq.phone.replace(/\D/g, '')}?text=${encodeURIComponent(`Namaste ${enq.fullName}, this is Karan Kamal from Mangupur Library regarding your admission enquiry.`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-[#25D366] text-white font-bold flex items-center space-x-1 hover:bg-[#1EBE5D] transition-colors"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </a>

                        {/* Call button */}
                        <a
                          href={`tel:${enq.phone}`}
                          className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] text-white font-bold flex items-center space-x-1 hover:bg-[#142E21] transition-colors"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span>Call</span>
                        </a>

                        {/* Status change dropdown */}
                        <select
                          value={enq.status}
                          onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as any)}
                          className="px-2 py-1.5 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs font-semibold text-[#1F3627]"
                        >
                          <option value="pending">Pending</option>
                          <option value="contacted">Contacted</option>
                          <option value="admitted">Admitted</option>
                          <option value="declined">Declined</option>
                        </select>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: Announcements Manager */}
          {activeTab === 'announcements' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#DFDACB]">
                <div>
                  <h4 className="font-bold text-sm text-[#183623]">Publish Library Announcements</h4>
                  <p className="text-xs text-[#526357]">Notices, timings, mock exams, or holiday alerts.</p>
                </div>

                <button
                  onClick={() => setShowAnnounceModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#142E21] text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>New Announcement</span>
                </button>
              </div>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white p-4 rounded-xl border border-[#DFDACB] shadow-xs flex items-start justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EBF3EC] text-[#1D5831] border border-[#B7D8BF]">
                          {ann.tag}
                        </span>
                        {ann.isPinned && (
                          <span className="text-[10px] text-[#916F24] font-bold">★ Pinned</span>
                        )}
                        <span className="text-[11px] text-[#78897E]">• {ann.createdAt}</span>
                      </div>
                      <h4 className="font-bold text-sm text-[#143020]">{ann.title}</h4>
                      <p className="text-xs text-[#4F6054] mt-1 whitespace-pre-line">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncement(ann.id)}
                      className="p-1.5 rounded-lg text-[#7F8F84] hover:text-[#C53030] hover:bg-[#FDF2F2] transition-colors"
                      title="Delete Announcement"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Gallery Manager */}
          {activeTab === 'gallery' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#DFDACB]">
                <div>
                  <h4 className="font-bold text-sm text-[#183623]">Photo Gallery Management</h4>
                  <p className="text-xs text-[#526357]">
                    Includes default images (/l1.jpg, /l2.jpg, /l3.jpg) and custom photos.
                  </p>
                </div>

                <button
                  onClick={() => setShowGalleryModal(true)}
                  className="px-3 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#142E21] text-white text-xs font-semibold flex items-center space-x-1 shadow-xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5 text-[#E5C378]" />
                  <span>Add Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {galleryItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-xl border border-[#DFDACB] overflow-hidden p-3 space-y-2">
                    <div className="aspect-[16/10] bg-[#ECE8DC] rounded-lg overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <p className="text-xs font-semibold text-[#183623] truncate">{item.caption}</p>
                    <p className="text-[10px] text-[#718276]">{item.category || 'Reading Hall'}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Student Modal (Add/Edit) */}
      {showStudentModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DFDACB] p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-[#173824]">
                {editingStudent ? 'Edit Student Details' : 'Add New Student Record'}
              </h4>
              <button onClick={() => setShowStudentModal(false)}>
                <X className="w-4 h-4 text-[#78897E]" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Student Full Name *</label>
                <input
                  type="text"
                  required
                  value={studentFormName}
                  onChange={(e) => setStudentFormName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Father's Name</label>
                <input
                  type="text"
                  value={studentFormFather}
                  onChange={(e) => setStudentFormFather(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Phone (Private) *</label>
                  <input
                    type="tel"
                    required
                    value={studentFormPhone}
                    onChange={(e) => setStudentFormPhone(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Assigned Seat # (1-30)</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={studentFormSeat}
                    onChange={(e) => setStudentFormSeat(e.target.value ? Number(e.target.value) : '')}
                    className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Village / Town</label>
                  <input
                    type="text"
                    value={studentFormVillage}
                    onChange={(e) => setStudentFormVillage(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Exam</label>
                  <input
                    type="text"
                    value={studentFormExam}
                    onChange={(e) => setStudentFormExam(e.target.value)}
                    className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowStudentModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-[#6A7B70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1B3B2B] text-white font-bold"
                >
                  Save Student
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {showAnnounceModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DFDACB] p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-[#173824]">Post New Announcement</h4>
              <button onClick={() => setShowAnnounceModal(false)}>
                <X className="w-4 h-4 text-[#78897E]" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Revised Evening Timings for Winter"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Tag</label>
                <select
                  value={annTag}
                  onChange={(e) => setAnnTag(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                >
                  <option value="Notice">Notice</option>
                  <option value="Timing">Timing</option>
                  <option value="Exam Alert">Exam Alert</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Details / Message *</label>
                <textarea
                  rows={3}
                  required
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="pinnedCheck"
                  checked={annPinned}
                  onChange={(e) => setAnnPinned(e.target.checked)}
                  className="rounded border-[#C5BFAD] text-[#1B3B2B]"
                />
                <label htmlFor="pinnedCheck" className="text-[#3C5143] font-medium">
                  Pin to top of notice board
                </label>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAnnounceModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-[#6A7B70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1B3B2B] text-white font-bold"
                >
                  Publish Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#DFDACB] p-5 shadow-2xl space-y-4 text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h4 className="font-bold text-sm text-[#173824]">Add Gallery Photo</h4>
              <button onClick={() => setShowGalleryModal(false)}>
                <X className="w-4 h-4 text-[#78897E]" />
              </button>
            </div>

            <form onSubmit={handleAddGallery} className="space-y-3">
              <div>
                <label className="block font-semibold mb-1">Image URL / Path *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. /l4.jpg or https://..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Photo Caption *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Afternoon study batch in reading hall"
                  value={newImageCaption}
                  onChange={(e) => setNewImageCaption(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category</label>
                <input
                  type="text"
                  placeholder="e.g. Reading Hall, Study Tables, Books"
                  value={newImageCategory}
                  onChange={(e) => setNewImageCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowGalleryModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-[#6A7B70]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#1B3B2B] text-white font-bold"
                >
                  Add to Gallery
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
