import React from 'react';
import { 
  Users, 
  Clock, 
  MapPin, 
  Sparkles, 
  Compass, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  ShieldAlert,
  Send,
  BookMarked
} from 'lucide-react';
import { LibrarySettings } from '../types.ts';

interface HeroSectionProps {
  settings: LibrarySettings;
  onOpenJoinModal: () => void;
  onOpenDirections: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  settings,
  onOpenJoinModal,
  onOpenDirections
}) => {
  const percentage = Math.min(100, Math.round((settings.presentCount / (settings.capacity || 30)) * 100));
  const seatsAvailable = Math.max(0, (settings.capacity || 30) - settings.presentCount);

  // Format last modified timestamp
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Just now';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  const coreTags = [
    "Silence",
    "Peace",
    "Focus",
    "Self Study",
    "Calm Environment"
  ];

  return (
    <section id="hero" className="pt-5 pb-8 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3.5">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#EAE8DE] text-[#24422E] text-xs font-semibold border border-[#D5D2C3]">
          <span className="w-2 h-2 rounded-full bg-[#B88E3E]"></span>
          <span>Free Rural Self-Study Sanctuary</span>
          <span className="text-[#8B988E]">•</span>
          <span className="text-[#68521F]">Etawah, UP</span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#143020] tracking-tight leading-tight">
          MANGUPUR LIBRARY
        </h1>

        <p className="text-sm sm:text-base text-[#46574C] font-normal leading-relaxed">
          A dedicated, free study space in <span className="font-semibold text-[#1B3B2B]">Mangupur, Bharthana (Etawah)</span> under Incharge <span className="font-semibold text-[#1B3B2B]">Karan Kamal</span>, built to help rural students crack competitive examinations with disciplined silence and focus.
        </p>

        {/* Suitable Tags */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
          {coreTags.map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-1 rounded-md text-[11px] font-medium bg-[#F1EFE8] text-[#284432] border border-[#DDD9CD] select-none"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Primary Live Status Dashboard Card (Mobile-First) */}
      <div className="mt-7 bg-white rounded-2xl border border-[#DFDCСE] shadow-sm overflow-hidden">
        {/* Top Header of Card */}
        <div className={`p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b ${
          settings.libraryOpen ? 'bg-[#F2F7F3] border-[#D6E6D9]' : 'bg-[#FBF4EE] border-[#ECCDC1]'
        }`}>
          <div className="flex items-center space-x-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              settings.libraryOpen ? 'bg-[#1E4D30] text-white shadow-xs' : 'bg-[#8F3320] text-white shadow-xs'
            }`}>
              {settings.libraryOpen ? (
                <CheckCircle2 className="w-6 h-6 text-[#9AE6B4]" />
              ) : (
                <XCircle className="w-6 h-6 text-[#FED7D7]" />
              )}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#5A6D61]">
                  Current Status
                </span>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                  settings.libraryOpen ? 'bg-[#D1E7D6] text-[#144725]' : 'bg-[#F6D8CE] text-[#7A2715]'
                }`}>
                  {settings.libraryOpen ? 'OPEN NOW' : 'TEMPORARILY CLOSED'}
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-[#143020]">
                {settings.libraryOpen ? 'Library is Unlocked for Students' : 'Library is Currently Shut'}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 text-xs text-[#526458] bg-white/70 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-[#DDD9CE] self-start sm:self-auto">
            <Clock className="w-3.5 h-3.5 text-[#B88E3E]" />
            <span>Updated:</span>
            <span className="font-semibold text-[#1E3928]">{formatTime(settings.lastModified)}</span>
          </div>
        </div>

        {/* Live Metrics Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Seating Occupancy Gauge */}
          <div className="md:col-span-2 space-y-3 bg-[#FAF9F5] p-4 rounded-xl border border-[#E9E6DA]">
            <div className="flex items-center justify-between text-xs sm:text-sm">
              <span className="font-semibold text-[#253D2E] flex items-center space-x-1.5">
                <Users className="w-4 h-4 text-[#1B3B2B]" />
                <span>Active Seating Occupancy</span>
              </span>
              <span className="font-bold text-[#163823] bg-white px-2.5 py-1 rounded-md border border-[#DCD8CA] text-xs">
                {settings.presentCount} of {settings.capacity} Students Present
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#E5E2D6] h-3.5 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  percentage >= 90 ? 'bg-[#C53030]' : percentage >= 70 ? 'bg-[#D69E2E]' : 'bg-[#2E7D32]'
                }`}
                style={{ width: `${Math.min(100, Math.max(6, percentage))}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#55695D]">
              <span>
                <strong className="text-[#193F27] font-semibold">{seatsAvailable}</strong> seats currently vacant
              </span>
              <span>Total Capacity: 30 Seats (Free for all)</span>
            </div>

            {/* Custom Status Message by Admin */}
            {settings.statusMessage && (
              <div className="mt-2 text-xs text-[#2A4434] bg-white p-3 rounded-lg border-l-4 border-l-[#1E4D30] border-t border-r border-b border-[#E3DFC] flex items-start space-x-2">
                <BookMarked className="w-4 h-4 text-[#B88E3E] shrink-0 mt-0.5" />
                <p className="leading-relaxed italic">
                  "{settings.statusMessage}"
                </p>
              </div>
            )}
          </div>

          {/* Quick Key Action Card */}
          <div className="flex flex-col justify-between space-y-3 bg-[#FAF8F2] p-4 rounded-xl border border-[#E8DFCA]">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6A23]">
                  Admission & Entry
                </span>
                <span className="text-[10px] bg-[#EAE0C8] text-[#5A4515] px-1.5 py-0.5 rounded font-semibold">
                  100% Free
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#1C3625]">
                Want to join for daily study?
              </h3>
              <p className="text-xs text-[#5D6B62] mt-1 leading-normal">
                Reserve your dedicated seat & get WhatsApp orientation directly from Incharge.
              </p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={onOpenJoinModal}
                className="w-full py-2.5 px-3 rounded-lg bg-[#1B3B2B] hover:bg-[#142E21] text-[#FAF9F5] text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-all"
              >
                <span>Join Library (Admission Form)</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </button>

              <button
                onClick={onOpenDirections}
                className="w-full py-2 px-3 rounded-lg bg-white hover:bg-[#F2EFE7] text-[#2C4434] text-xs font-semibold border border-[#D0CBBA] flex items-center justify-center space-x-1.5 transition-colors"
              >
                <Compass className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span>Directions & Route Guide</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
