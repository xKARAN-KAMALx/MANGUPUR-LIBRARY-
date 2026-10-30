import React, { useState } from 'react';
import { Users, Search, CheckCircle2, Clock, BookOpen, ShieldCheck } from 'lucide-react';
import { Student } from '../types.ts';

interface LiveStudentTableProps {
  students: Student[];
  presentCount: number;
  capacity: number;
}

export const LiveStudentTable: React.FC<LiveStudentTableProps> = ({
  students,
  presentCount,
  capacity
}) => {
  const [filter, setFilter] = useState<'present' | 'all'>('present');
  const [searchQuery, setSearchQuery] = useState('');
  const [examCategory, setExamCategory] = useState('all');

  // Filter students
  const filtered = students.filter((s) => {
    if (filter === 'present' && !s.isPresent) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchExam = s.examTarget?.toLowerCase().includes(q);
      const matchVillage = s.villageTown?.toLowerCase().includes(q);
      if (!matchName && !matchExam && !matchVillage) return false;
    }

    if (examCategory !== 'all') {
      if (!s.examTarget?.toLowerCase().includes(examCategory.toLowerCase())) return false;
    }

    return true;
  });

  const currentlyPresentStudents = students.filter(s => s.isPresent);

  return (
    <section id="students" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl border border-[#DFDCCF] shadow-xs overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-[#EAE7DC] bg-[#FAF9F5] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#E5ECE7] text-[#1E4D30] text-xs font-bold mb-1.5 border border-[#C5D8C9]">
              <Users className="w-3.5 h-3.5" />
              <span>Live Attendance & Member Directory</span>
            </div>
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#143020]">
              Students & Study Roll
            </h2>
            <p className="text-xs text-[#526357] mt-0.5">
              Live transparency of active students present in the reading hall. (Student phone numbers kept private for safety).
            </p>
          </div>

          {/* Quick Counter */}
          <div className="flex items-center space-x-3 bg-white px-3.5 py-2 rounded-xl border border-[#D8D4C5] self-start md:self-auto text-xs">
            <div>
              <span className="text-[#6C7B71] block text-[10px] uppercase font-bold tracking-wider">Inside Hall</span>
              <span className="font-extrabold text-[#173824] text-base">
                {currentlyPresentStudents.length} / {capacity || 30}
              </span>
            </div>
            <div className="h-7 w-px bg-[#E2DFD3]"></div>
            <div>
              <span className="text-[#6C7B71] block text-[10px] uppercase font-bold tracking-wider">Seats Free</span>
              <span className="font-extrabold text-[#946E28] text-base">
                {Math.max(0, (capacity || 30) - currentlyPresentStudents.length)}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="p-4 bg-[#FDFCF9] border-b border-[#ECE9DC] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          {/* Tab Filter */}
          <div className="flex items-center p-1 bg-[#ECE9DE] rounded-lg self-start">
            <button
              onClick={() => setFilter('present')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filter === 'present'
                  ? 'bg-white text-[#173824] shadow-xs'
                  : 'text-[#506356] hover:text-[#173824]'
              }`}
            >
              Currently Present ({currentlyPresentStudents.length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
                filter === 'all'
                  ? 'bg-white text-[#173824] shadow-xs'
                  : 'text-[#506356] hover:text-[#173824]'
              }`}
            >
              All Members ({students.length})
            </button>
          </div>

          {/* Search Bar & Exam Dropdown */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-52">
              <Search className="w-3.5 h-3.5 text-[#88978D] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search student or village..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#D5D0C0] bg-white text-xs text-[#203628] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
              />
            </div>

            <select
              value={examCategory}
              onChange={(e) => setExamCategory(e.target.value)}
              className="py-1.5 px-2.5 rounded-lg border border-[#D5D0C0] bg-white text-xs text-[#203628] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
            >
              <option value="all">All Exams</option>
              <option value="Police">UP Police</option>
              <option value="SSC">SSC</option>
              <option value="UPSC">UPSC</option>
              <option value="Railway">Railway</option>
              <option value="Banking">Banking</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] text-[#4A5D51] font-semibold border-b border-[#ECE8DC] uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Seat #</th>
                <th className="py-3 px-4">Student Name</th>
                <th className="py-3 px-4">Village / Town</th>
                <th className="py-3 px-4">Target Examination</th>
                <th className="py-3 px-4">Hall Status</th>
                <th className="py-3 px-4 hidden sm:table-cell">Last Attendance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F1EFE6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#708076]">
                    No students match the selected filter.
                  </td>
                </tr>
              ) : (
                filtered.map((student, idx) => (
                  <tr 
                    key={student.id || idx} 
                    className="hover:bg-[#F9F8F2] transition-colors"
                  >
                    <td className="py-3 px-4 font-mono font-bold text-[#1F3E2B]">
                      {student.seatNumber ? `S-${String(student.seatNumber).padStart(2, '0')}` : 'General'}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-[#143020] text-sm sm:text-xs">
                        {student.name}
                      </div>
                      {student.fatherName && (
                        <div className="text-[10px] text-[#78897E]">
                          S/o {student.fatherName}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#3C5143]">
                      {student.villageTown || 'Mangupur'}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-full bg-[#EFE8D6] text-[#71541D] font-semibold text-[10px] border border-[#DBCFA7]">
                        {student.examTarget || 'General Prep'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {student.isPresent ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E1EFE4] text-[#1B5731]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2E7D32] animate-pulse"></span>
                          <span>Inside Hall</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[#ECE9DE] text-[#697A70]">
                          <span>Away</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-[#6A7B70] hidden sm:table-cell text-[11px]">
                      {student.lastAttendanceTime || 'Earlier today'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer Note */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#ECE8DC] text-[11px] text-[#6D7E73] flex items-center justify-between">
          <span className="flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#2E7D32]" />
            <span>Student mobile numbers strictly masked & protected under privacy policy.</span>
          </span>
          <span className="text-xs font-semibold text-[#1B3B2B]">
            Mangupur Self-Study Group
          </span>
        </div>
      </div>
    </section>
  );
};
