import React from 'react';
import { Bell, Pin, Calendar, Tag, AlertCircle } from 'lucide-react';
import { Announcement } from '../types.ts';

interface AnnouncementsSectionProps {
  announcements: Announcement[];
}

export const AnnouncementsSection: React.FC<AnnouncementsSectionProps> = ({ announcements }) => {
  const getTagColor = (tag: string) => {
    switch (tag) {
      case 'Exam Alert':
        return 'bg-[#F9ECEB] text-[#9A2D23] border-[#F0BCB8]';
      case 'Timing':
        return 'bg-[#FFF6E5] text-[#8C6013] border-[#F2D79E]';
      case 'Holiday':
        return 'bg-[#F1EDF9] text-[#553285] border-[#D6C7EC]';
      case 'Notice':
      default:
        return 'bg-[#EBF3EC] text-[#1D5831] border-[#B7D8BF]';
    }
  };

  return (
    <section id="announcements" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[#8F6F26] bg-[#F7F2E6] px-3 py-1 rounded-full border border-[#E1D4B7]">
            Notice Board & Updates
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#173824] mt-2">
            Library Announcements
          </h2>
        </div>
        <span className="text-xs text-[#6B7C71]">
          Live updates directly from Incharge Karan Kamal
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {announcements.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border border-[#E2DFC] p-8 text-center text-[#7A8C81]">
            <Bell className="w-8 h-8 mx-auto text-[#B5C2B9] mb-2" />
            <p className="text-sm font-medium">No announcements published at this time.</p>
          </div>
        ) : (
          announcements.map((ann) => (
            <div
              key={ann.id}
              className={`bg-white rounded-xl border p-4.5 shadow-xs flex flex-col justify-between transition-all hover:shadow-sm ${
                ann.isPinned ? 'border-[#D9C496] bg-gradient-to-b from-[#FFFDF9] to-white ring-1 ring-[#D9C496]/50' : 'border-[#E4E0D4]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getTagColor(ann.tag)}`}>
                    {ann.tag}
                  </span>

                  <div className="flex items-center space-x-1.5 text-[11px] text-[#718276]">
                    {ann.isPinned && (
                      <span className="inline-flex items-center space-x-0.5 text-[#916F24] font-semibold text-[10px]">
                        <Pin className="w-3 h-3 rotate-45" />
                        <span>Pinned</span>
                      </span>
                    )}
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3 text-[#A89D84]" />
                      <span>{ann.createdAt}</span>
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-[#163622] mb-1.5 leading-snug">
                  {ann.title}
                </h3>

                <p className="text-xs text-[#4F6054] leading-relaxed whitespace-pre-line">
                  {ann.content}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#F0ECE1] flex items-center justify-between text-[11px] text-[#6E8074]">
                <span>Issued by: <strong className="text-[#193F27]">{ann.author || 'Incharge'}</strong></span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
