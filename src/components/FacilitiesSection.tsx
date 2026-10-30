import React from 'react';
import { 
  Wifi, 
  Armchair, 
  Fan, 
  SunMedium, 
  LampFloor, 
  Table2, 
  ShieldCheck, 
  BatteryCharging,
  HeartHandshake,
  Sparkles
} from 'lucide-react';

export const FacilitiesSection: React.FC = () => {
  const facilities = [
    {
      icon: <Wifi className="w-5 h-5 text-[#B88E3E]" />,
      title: "High-Speed Wi-Fi",
      desc: "Fast, unlimited internet connectivity for video lectures, test series, and PDF downloads without buffering."
    },
    {
      icon: <Armchair className="w-5 h-5 text-[#B88E3E]" />,
      title: "30 Dedicated Study Seats",
      desc: "Ergonomic wooden & cushioned chairs designed to support long hours of posture-friendly sitting."
    },
    {
      icon: <Table2 className="w-5 h-5 text-[#B88E3E]" />,
      title: "Spacious Study Desks",
      desc: "Wide desks with enough room for textbooks, registers, laptop/tablet, and stationery organization."
    },
    {
      icon: <LampFloor className="w-5 h-5 text-[#B88E3E]" />,
      title: "Soft Yellow Lighting",
      desc: "Eye-comfort warm ambient lighting calibrated to reduce glare, headache, and eye-strain during night studies."
    },
    {
      icon: <Fan className="w-5 h-5 text-[#B88E3E]" />,
      title: "Fans & Natural Air Flow",
      desc: "Multiple high-speed ceiling fans and cross-ventilated windows for an airy, fresh study environment."
    },
    {
      icon: <BatteryCharging className="w-5 h-5 text-[#B88E3E]" />,
      title: "Inverter Power Backup",
      desc: "Continuous power backup so village electricity cuts never interrupt your exam concentration."
    },
    {
      icon: <HeartHandshake className="w-5 h-5 text-[#B88E3E]" />,
      title: "100% Free For All Aspirants",
      desc: "Zero admission fee, zero monthly charges. Managed voluntarily by Karan Kamal for youth empowerment."
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-[#B88E3E]" />,
      title: "Strict Silence Discipline",
      desc: "Zero-tolerance for phone conversations, whispering, or loitering. Unbroken study focus."
    }
  ];

  return (
    <section id="facilities" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="text-center max-w-2xl mx-auto mb-8">
        <span className="text-xs font-bold uppercase tracking-widest text-[#8F6F26] bg-[#F7F2E6] px-3 py-1 rounded-full border border-[#E1D4B7]">
          Equipped For Top Ranks
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#173824] mt-2">
          Study Facilities & Comfort
        </h2>
        <p className="text-xs sm:text-sm text-[#4E5E53] mt-1.5">
          Designed specifically for rural candidates preparing for state & central competitive examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facilities.map((fac, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl border border-[#E5E2D6] p-4.5 shadow-xs hover:border-[#C5A059]/60 transition-all hover:shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-[#FAF7F0] border border-[#E9E0CE] flex items-center justify-center mb-3">
                {fac.icon}
              </div>
              <h3 className="font-bold text-sm text-[#193623] mb-1">
                {fac.title}
              </h3>
              <p className="text-xs text-[#526357] leading-relaxed">
                {fac.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
