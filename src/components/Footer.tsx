import React from 'react';
import { 
  Heart, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  HelpCircle, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { ADMIN_EMAIL } from '../firebase.ts';

interface FooterProps {
  onOpenLoginModal: () => void;
  onOpenGuideModal: () => void;
  onOpenJoinModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenLoginModal,
  onOpenGuideModal,
  onOpenJoinModal
}) => {
  return (
    <footer className="bg-[#122A1C] text-[#C2D6C9] text-xs pt-10 pb-8 px-4 sm:px-6 border-t border-[#1F422D]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Col 1: About */}
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5C378] text-[#173824] flex items-center justify-center font-serif text-lg font-bold">
              M
            </div>
            <div>
              <span className="font-serif font-bold text-base text-white tracking-wide block leading-none">
                MANGUPUR LIBRARY
              </span>
              <span className="text-[11px] text-[#A2BEAE]">
                Mangupur, Bharthana, Etawah, UP
              </span>
            </div>
          </div>

          <p className="text-xs text-[#A8C0B2] leading-relaxed max-w-md">
            A free, community-driven 24x7 self-study library dedicated to rural students preparing for competitive examinations (UP Police, SSC, Railway, UPSC, Teaching). Equipped with 30 seats, high-speed Wi-Fi, and disciplined silence.
          </p>

          <div className="pt-1 flex items-center space-x-2 text-[11px] text-[#C7D9CE]">
            <MapPin className="w-3.5 h-3.5 text-[#E5C378] shrink-0" />
            <span>Mangupur, Post Bharthana, Etawah, UP - 206242</span>
          </div>
        </div>

        {/* Col 2: Incharge & Contacts */}
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-sm text-white">
            Incharge & Support
          </h4>
          <ul className="space-y-1.5 text-xs text-[#A7BFB1]">
            <li>
              Incharge: <strong className="text-white">Karan Kamal</strong>
            </li>
            <li>
              Phone: <a href="tel:9870931288" className="hover:text-[#E5C378]">9870931288</a>, <a href="tel:7534805520" className="hover:text-[#E5C378]">7534805520</a>
            </li>
            <li>
              WhatsApp: <a href="https://wa.me/919870931288" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5C378]">9870931288</a>
            </li>
            <li>
              Instagram: <a href="https://instagram.com/madman_6162" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5C378]">@madman_6162</a>, <a href="https://instagram.com/unbound_karan" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5C378]">@unbound_karan</a>
            </li>
            <li>
              Admin Email: <span className="font-mono text-[11px] text-white">{ADMIN_EMAIL}</span>
            </li>
          </ul>
        </div>

        {/* Col 3: Quick Links & Administration */}
        <div className="space-y-2">
          <h4 className="font-serif font-bold text-sm text-white">
            Library Services
          </h4>
          <ul className="space-y-1.5 text-xs text-[#A7BFB1]">
            <li>
              <button onClick={onOpenJoinModal} className="hover:text-[#E5C378] text-left">
                • Free Admission Application
              </button>
            </li>
            <li>
              <a href="https://maps.app.goo.gl/CSsLMCseLBrxoKgL9" target="_blank" rel="noopener noreferrer" className="hover:text-[#E5C378] flex items-center space-x-1">
                <span>• Google Maps Location Pin</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </li>
            <li>
              <button onClick={onOpenLoginModal} className="hover:text-[#E5C378] text-left flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#E5C378]" />
                <span>• Incharge Admin Login</span>
              </button>
            </li>
            <li>
              <button onClick={onOpenGuideModal} className="hover:text-[#E5C378] text-left flex items-center space-x-1">
                <HelpCircle className="w-3 h-3 text-[#E5C378]" />
                <span>• Firebase Setup & Deployment Docs</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#7E9689]">
        <p>
          © {new Date().getFullYear()} MANGUPUR LIBRARY, Bharthana (Etawah). Built for Rural Youth Empowerment.
        </p>
        <p className="flex items-center space-x-1">
          <span>Discipline • Silence • Success</span>
        </p>
      </div>
    </footer>
  );
};
