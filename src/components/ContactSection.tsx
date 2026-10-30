import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Send, 
  Instagram, 
  ExternalLink, 
  ShieldCheck, 
  MessageSquare,
  Clock,
  HeartHandshake
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-8 px-4 sm:px-6 max-w-6xl mx-auto">
      <div className="bg-[#173824] rounded-2xl text-[#FAF9F5] p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#E5C378]/5 pointer-events-none"></div>

        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E5C378] bg-[#E5C378]/15 px-3 py-1 rounded-full border border-[#E5C378]/30">
            Get In Touch
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#FAF9F5] mt-2.5">
            Contact & Administration
          </h2>
          <p className="text-xs sm:text-sm text-[#C8D7CE] mt-1.5 leading-relaxed">
            Have questions about seat availability, key handover, admission, or study rules? Reach out directly to Library Incharge Karan Kamal.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {/* Phone Numbers */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 space-y-2">
            <div className="flex items-center space-x-2 text-[#E5C378]">
              <Phone className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Call Directly</span>
            </div>
            <div className="space-y-1">
              <a
                href="tel:9870931288"
                className="block text-sm font-bold text-white hover:text-[#E5C378] transition-colors"
              >
                +91 9870931288 (Primary)
              </a>
              <a
                href="tel:7534805520"
                className="block text-sm font-medium text-[#D8E6DD] hover:text-[#E5C378] transition-colors"
              >
                +91 7534805520 (Alt)
              </a>
            </div>
            <p className="text-[11px] text-[#A6BFB0]">Incharge: Karan Kamal</p>
          </div>

          {/* WhatsApp & Telegram */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 space-y-2">
            <div className="flex items-center space-x-2 text-[#E5C378]">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Messaging</span>
            </div>
            <div className="space-y-1.5">
              <a
                href="https://wa.me/919870931288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-semibold text-white bg-white/10 px-2.5 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>WhatsApp: 9870931288</span>
                <ExternalLink className="w-3 h-3 text-[#E5C378]" />
              </a>
              <a
                href="https://t.me/+919870931288"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between text-xs font-semibold text-white bg-white/10 px-2.5 py-1.5 rounded-lg hover:bg-white/20 transition-colors"
              >
                <span>Telegram: 9870931288</span>
                <Send className="w-3 h-3 text-[#E5C378]" />
              </a>
            </div>
          </div>

          {/* Social & Admin Email */}
          <div className="bg-white/10 backdrop-blur-xs rounded-xl p-4 border border-white/15 space-y-2">
            <div className="flex items-center space-x-2 text-[#E5C378]">
              <Instagram className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Social & Email</span>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center space-x-2">
                <span className="text-[#A7C2B2]">Instagram:</span>
                <a
                  href="https://instagram.com/madman_6162"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#E5C378] font-medium"
                >
                  @madman_6162
                </a>
                <span>,</span>
                <a
                  href="https://instagram.com/unbound_karan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-[#E5C378] font-medium"
                >
                  @unbound_karan
                </a>
              </div>
              <div className="flex items-center space-x-1.5 pt-1">
                <Mail className="w-3.5 h-3.5 text-[#E5C378]" />
                <a
                  href="mailto:kamalkaran939@gmail.com"
                  className="text-[#E7EFEA] hover:text-[#E5C378] text-[11px] truncate"
                >
                  kamalkaran939@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom micro location strip */}
        <div className="mt-6 pt-4 border-t border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-[#BED2C6]">
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Mangupur, Bharthana, Etawah, Uttar Pradesh - 206242</span>
          </div>
          <a
            href="https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#E5C378] hover:underline flex items-center space-x-1"
          >
            <span>View on Google Maps</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </section>
  );
};
