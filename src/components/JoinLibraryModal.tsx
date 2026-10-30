import React, { useState } from 'react';
import { X, Send, User, Phone, MapPin, GraduationCap, Clock, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { submitAdmissionEnquiry } from '../services/libraryService.ts';

interface JoinLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const JoinLibraryModal: React.FC<JoinLibraryModalProps> = ({ isOpen, onClose }) => {
  const [fullName, setFullName] = useState('');
  const [fatherName, setFatherName] = useState('');
  const [phone, setPhone] = useState('');
  const [villageTown, setVillageTown] = useState('');
  const [examTarget, setExamTarget] = useState('UP Police Constable');
  const [preferredShift, setPreferredShift] = useState('Morning (06:00 AM - 12:00 PM)');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || !phone.trim() || !villageTown.trim()) {
      setErrorMessage('Please fill in your Full Name, Phone number, and Village/Town.');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Save enquiry to Firestore
      await submitAdmissionEnquiry({
        fullName: fullName.trim(),
        fatherName: fatherName.trim(),
        phone: phone.trim(),
        villageTown: villageTown.trim(),
        examTarget,
        preferredShift,
        notes: notes.trim()
      });

      // 2. Format prefilled WhatsApp message to +91 9870931288
      const message = `Namaste Karan Kamal ji,
I would like to apply for admission / self-study seat at MANGUPUR LIBRARY.

*Applicant Details:*
• Name: ${fullName.trim()}
• Father's Name: ${fatherName.trim() || 'N/A'}
• Village/Town: ${villageTown.trim()}
• Phone: ${phone.trim()}
• Target Exam: ${examTarget}
• Preferred Shift: ${preferredShift}
${notes.trim() ? `• Notes: ${notes.trim()}\n` : ''}
Please confirm seat availability. Thank you!`;

      const whatsappUrl = `https://wa.me/919870931288?text=${encodeURIComponent(message)}`;

      setIsSubmitted(true);

      // Open WhatsApp in a clean timeout
      setTimeout(() => {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }, 700);

    } catch (err: any) {
      console.error('Admission submit error:', err);
      setErrorMessage(err.message || 'Failed to submit enquiry. Please contact via WhatsApp directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFullName('');
    setFatherName('');
    setPhone('');
    setVillageTown('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-lg w-full border border-[#DFDACB] shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173824] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5C378] text-[#173824] flex items-center justify-center font-bold text-sm">
              M
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Join Mangupur Library</h3>
              <p className="text-[11px] text-[#BED4C7]">100% Free Admission • 30 Seats Capacity</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        {isSubmitted ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#E3EFE5] text-[#1B5731] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-serif text-xl font-bold text-[#143020]">
              Application Submitted Successfully!
            </h4>
            <p className="text-xs text-[#4F6054] max-w-sm mx-auto leading-relaxed">
              Your admission request has been recorded in the library registry and WhatsApp enquiry has been generated for Incharge <strong>Karan Kamal</strong> (+91 9870931288).
            </p>

            <div className="pt-3">
              <button
                onClick={handleReset}
                className="w-full py-2.5 rounded-xl bg-[#1B3B2B] text-white text-xs font-bold hover:bg-[#142F21] transition-colors"
              >
                Done / Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 text-xs">
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] text-xs">
                {errorMessage}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Student Full Name <span className="text-[#C53030]">*</span>
                </label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-[#88978D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Father's Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shri Rajesh Sharma"
                  value={fatherName}
                  onChange={(e) => setFatherName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Mobile / WhatsApp Number <span className="text-[#C53030]">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-[#88978D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9870931288"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Village / Town <span className="text-[#C53030]">*</span>
                </label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-[#88978D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mangupur / Bharthana"
                    value={villageTown}
                    onChange={(e) => setVillageTown(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Target Competitive Exam <span className="text-[#C53030]">*</span>
                </label>
                <select
                  value={examTarget}
                  onChange={(e) => setExamTarget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                >
                  <option value="UP Police Constable">UP Police Constable</option>
                  <option value="UP Police Sub-Inspector (SI)">UP Police Sub-Inspector (SI)</option>
                  <option value="UPSSSC (PET / VDO / Lekhpal)">UPSSSC (PET / VDO / Lekhpal)</option>
                  <option value="SSC (CGL / CHSL / GD / MTS)">SSC (CGL / CHSL / GD / MTS)</option>
                  <option value="Railway (RRB NTPC / Group D / ALP)">Railway (RRB NTPC / Group D / ALP)</option>
                  <option value="UPSC Civil Services">UPSC Civil Services</option>
                  <option value="Teaching (TET / Super TET)">Teaching (TET / Super TET)</option>
                  <option value="NEET / JEE / Boards">NEET / JEE / Academic Boards</option>
                  <option value="Banking (IBPS / SBI)">Banking (IBPS / SBI)</option>
                  <option value="Other Self-Study">Other Self-Study</option>
                </select>
              </div>

              <div>
                <label className="block text-[#273B2F] font-semibold mb-1">
                  Preferred Shift / Timing
                </label>
                <select
                  value={preferredShift}
                  onChange={(e) => setPreferredShift(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
                >
                  <option value="Morning (06:00 AM - 12:00 PM)">Morning (06:00 AM - 12:00 PM)</option>
                  <option value="Afternoon (12:00 PM - 05:00 PM)">Afternoon (12:00 PM - 05:00 PM)</option>
                  <option value="Evening (05:00 PM - 10:00 PM)">Evening (05:00 PM - 10:00 PM)</option>
                  <option value="Full Day Self-Study (Flexible)">Full Day Self-Study (Flexible)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[#273B2F] font-semibold mb-1">
                Any specific requirement or note (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Mention any study timing preference or questions..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30]"
              ></textarea>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#142E21] text-[#FAF9F5] text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#E5C378]" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>Submit & Open WhatsApp to Incharge (+91 9870931288)</span>
                  </>
                )}
              </button>
            </div>

            <p className="text-[10px] text-[#718276] text-center leading-tight">
              By submitting, your details will be recorded and a prefilled message will open in WhatsApp for quick confirmation.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
