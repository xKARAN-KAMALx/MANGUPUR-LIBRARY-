import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  Phone, 
  Menu, 
  X, 
  UserCheck, 
  Key, 
  MapPin, 
  Sparkles,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { LibrarySettings } from '../types.ts';
import { User } from 'firebase/auth';

interface NavbarProps {
  settings: LibrarySettings;
  adminUser: User | null;
  isAdmin: boolean;
  onOpenJoinModal: () => void;
  onOpenLoginModal: () => void;
  onOpenAdminDashboard: () => void;
  onSignOut: () => void;
  onOpenGuideModal: () => void;
  activeSection: string;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  settings,
  adminUser,
  isAdmin,
  onOpenJoinModal,
  onOpenLoginModal,
  onOpenAdminDashboard,
  onSignOut,
  onOpenGuideModal,
  activeSection,
  onNavigate
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'status', label: 'Status & Chabi' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'students', label: 'Present Students' },
    { id: 'announcements', label: 'Notices' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'directions', label: 'Location & Route' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleLinkClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-b border-[#E7E5DD] transition-all">
      {/* Top micro bar for quick emergency & status */}
      <div className="bg-[#173824] text-[#EFECE6] text-xs py-1.5 px-3 sm:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="inline-block w-2 h-2 rounded-full bg-[#E5C378]"></span>
          <span className="font-medium text-[#FAF9F5] tracking-wide truncate">
            Mangupur, Bharthana, Etawah • Free 24x7 Self-Study
          </span>
        </div>
        <div className="flex items-center space-x-3 shrink-0 text-[11px]">
          <a 
            href="tel:9870931288" 
            className="flex items-center space-x-1 hover:text-[#E5C378] transition-colors"
          >
            <Phone className="w-3 h-3 text-[#E5C378]" />
            <span className="hidden sm:inline">Incharge:</span>
            <span>9870931288</span>
          </a>
          <button
            onClick={onOpenGuideModal}
            className="flex items-center space-x-1 text-[#D4AF37] hover:underline"
            title="Setup & Architecture Docs"
          >
            <HelpCircle className="w-3 h-3" />
            <span className="hidden md:inline">Docs</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => handleLinkClick('hero')} 
          className="flex items-center space-x-2.5 cursor-pointer select-none group"
        >
          <div className="w-9 h-9 rounded-lg bg-[#1B3B2B] text-[#E5C378] flex items-center justify-center font-serif text-lg font-bold shadow-xs border border-[#C5A059]/40 group-hover:scale-105 transition-transform">
            M
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-bold text-base sm:text-lg text-[#193523] tracking-tight leading-none">
                MANGUPUR LIBRARY
              </span>
              {/* Dynamic Live Status Dot */}
              <span 
                className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold tracking-wide ${
                  settings.libraryOpen 
                    ? 'bg-[#E3EFE5] text-[#19522F] border border-[#BBD9C1]' 
                    : 'bg-[#F9EAE1] text-[#8C341F] border border-[#ECC0AC]'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-1 ${settings.libraryOpen ? 'bg-[#2E7D32] animate-pulse' : 'bg-[#C62828]'}`}></span>
                {settings.libraryOpen ? 'OPEN' : 'CLOSED'}
              </span>
            </div>
            <p className="text-[11px] text-[#55695D] font-normal tracking-wide">
              Bharthana, Etawah • 30 Seats Free
            </p>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeSection === link.id
                  ? 'bg-[#EAECE4] text-[#173824] font-semibold'
                  : 'text-[#44564B] hover:text-[#173824] hover:bg-[#F2F1EC]'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center space-x-2">
          {/* Join Library CTA */}
          <button
            onClick={onOpenJoinModal}
            className="px-3.5 py-1.5 rounded-lg bg-[#1B3B2B] hover:bg-[#142E21] text-[#FAF9F5] text-xs font-semibold shadow-xs flex items-center space-x-1.5 border border-[#C5A059]/50 transition-all hover:shadow"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>Join Library</span>
          </button>

          {/* Admin Login or Dashboard Button */}
          {isAdmin ? (
            <div className="flex items-center space-x-1">
              <button
                onClick={onOpenAdminDashboard}
                className="px-2.5 py-1.5 rounded-lg bg-[#EFE8D6] text-[#694E1A] hover:bg-[#E7DDC4] text-xs font-bold flex items-center space-x-1 border border-[#D4AF37]/60 transition-colors"
                title="Open Admin Dashboard"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#8F681F]" />
                <span className="hidden sm:inline">Admin Panel</span>
              </button>
              <button
                onClick={onSignOut}
                className="p-1.5 rounded-lg text-[#697A70] hover:text-[#B3261E] hover:bg-[#F3E8E8] transition-colors"
                title="Sign Out Admin"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenLoginModal}
              className="p-1.5 rounded-lg text-[#44564B] hover:text-[#173824] hover:bg-[#EAECE4] transition-colors"
              title="Admin Login (Incharge)"
              aria-label="Admin Login"
            >
              <ShieldCheck className="w-4 h-4 text-[#7A6B4A]" />
            </button>
          )}

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-1.5 rounded-lg text-[#324538] hover:bg-[#EAECE4] transition-colors"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#FAF9F5] border-b border-[#E2DFC] px-4 pt-2 pb-5 shadow-lg space-y-1 animate-in slide-in-from-top-2 duration-150">
          <div className="py-2 px-3 mb-2 rounded-lg bg-[#F0EDE4] flex items-center justify-between text-xs text-[#3C4E42]">
            <span>Present Occupancy:</span>
            <span className="font-bold text-[#173824] bg-white px-2 py-0.5 rounded border border-[#D5D2C7]">
              {settings.presentCount} / {settings.capacity} Students
            </span>
          </div>

          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleLinkClick(link.id)}
              className="w-full text-left px-3 py-2.5 rounded-lg text-sm text-[#273B2E] font-medium hover:bg-[#ECE9DF] active:bg-[#E4E0D4] flex items-center justify-between transition-colors"
            >
              <span>{link.label}</span>
              <span className="text-xs text-[#7A8C80]">→</span>
            </button>
          ))}

          <div className="pt-3 border-t border-[#E5E2D6] flex flex-col space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenJoinModal();
              }}
              className="w-full py-2.5 rounded-lg bg-[#1B3B2B] text-white text-sm font-semibold text-center flex items-center justify-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-[#E5C378]" />
              <span>Free Admission Form (Join Now)</span>
            </button>

            <a
              href="https://maps.app.goo.gl/CSsLMCseLBrxoKgL9"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2 rounded-lg bg-white border border-[#D0CCBE] text-[#34483B] text-xs font-medium text-center flex items-center justify-center space-x-1.5"
            >
              <MapPin className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Open Google Maps Pin</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
