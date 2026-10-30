import React from 'react';
import { Key, Phone, MapPin, Clock, UserCheck } from 'lucide-react';
import { LibrarySettings } from '../types.ts';

interface KeyHolderCardProps {
  settings: LibrarySettings;
}

export const KeyHolderCard: React.FC<KeyHolderCardProps> = ({ settings }) => {
  const formatTime = (isoString?: string) => {
    if (!isoString) return 'Today';
    try {
      const d = new Date(isoString);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    } catch {
      return isoString;
    }
  };

  return (
    <section id="status" className="px-4 sm:px-6 max-w-6xl mx-auto py-2">
      <div className="bg-gradient-to-br from-[#FCFBF7] to-[#F5F2E9] rounded-2xl border-2 border-[#D9CEB4] p-4 sm:p-6 shadow-xs relative overflow-hidden">
        {/* Decorative corner key icon watermark */}
        <Key className="absolute -right-3 -bottom-3 w-28 h-28 text-[#C5A059]/10 pointer-events-none rotate-12" />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-[#EFE8D6] text-[#785918] text-xs font-bold border border-[#DBCFA7]">
              <Key className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>चाबी किसके पास है? (Key Tracker)</span>
            </div>

            <h3 className="font-serif text-xl sm:text-2xl font-extrabold text-[#193824]">
              {settings.keyHolderName || "Karan Kamal (Incharge)"}
            </h3>

            <p className="text-xs sm:text-sm text-[#4E5E53] flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#8A713C] shrink-0" />
              <span>{settings.keyHolderNote || "Key available with library incharge at Mangupur."}</span>
            </p>

            <div className="flex items-center space-x-2 text-[11px] text-[#718276] pt-1">
              <Clock className="w-3 h-3 text-[#A89A7A]" />
              <span>Status Verified: {formatTime(settings.lastModified)}</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            {settings.keyHolderPhone && (
              <a
                href={`tel:${settings.keyHolderPhone}`}
                className="px-4 py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#142F22] text-[#FAF9F5] text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>Call Key Holder: {settings.keyHolderPhone}</span>
              </a>
            )}

            <a
              href={`https://wa.me/91${settings.keyHolderPhone?.replace(/\D/g, '') || '9870931288'}?text=${encodeURIComponent('Namaste, I am at Mangupur Library to study. Are keys available to open the hall?')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#F3EFE4] text-[#344B3C] text-xs font-semibold border border-[#D2C8AF] flex items-center justify-center space-x-1.5 transition-colors"
            >
              <span>WhatsApp Message</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
