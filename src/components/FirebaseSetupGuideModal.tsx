import React from 'react';
import { X, CheckCircle2, ShieldAlert, Database, Server, Key, ExternalLink, Globe } from 'lucide-react';
import { ADMIN_EMAIL } from '../firebase.ts';

interface FirebaseSetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FirebaseSetupGuideModal: React.FC<FirebaseSetupGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-2xl w-full border border-[#DFDACB] shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173824] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5C378] text-[#173824] flex items-center justify-center font-bold text-sm">
              <Database className="w-4 h-4 text-[#173824]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Technical Architecture & Setup Guide</h3>
              <p className="text-[11px] text-[#BED4C7]">Firebase, Auth, Firestore Rules & Deployment Documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs text-[#293E31]">
          {/* Section 1: Provisioned Firebase Status */}
          <div className="bg-[#F2F7F3] p-4 rounded-xl border border-[#CCE2D2] space-y-2">
            <div className="flex items-center space-x-2 text-[#164D29] font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
              <span>Firebase Provisioning Status: ACTIVE</span>
            </div>
            <p className="text-[#3C5745] leading-relaxed">
              Firebase Firestore has been provisioned. Live synchronization is active via real-time listeners (<code className="font-mono bg-white px-1.5 py-0.5 rounded border border-[#C5DDCB]">onSnapshot</code>) for library settings, student rosters, announcements, and admissions.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
              <div>Project ID: <strong className="font-mono">consummate-mesh-701dl</strong></div>
              <div>Database: <strong className="font-mono">ai-studio-57098942-254f-4651-8b1d-7faaa337210d</strong></div>
            </div>
          </div>

          {/* Section 2: Administrator Account Configuration */}
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-[#143020] flex items-center space-x-1.5">
              <Key className="w-4 h-4 text-[#B88E3E]" />
              <span>1. Administrator Account Configuration</span>
            </h4>
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E6E2D4] space-y-2">
              <p>
                Authorized Incharge: <strong>Karan Kamal</strong>
              </p>
              <div className="p-2.5 bg-white rounded-lg border border-[#DCD7C7] font-mono text-xs space-y-1">
                <div>Email: <span className="font-bold text-[#193F27]">{ADMIN_EMAIL}</span></div>
                <div>Default Password: <span className="font-bold text-[#193F27]">karan206242</span></div>
              </div>
              <p className="text-[11px] text-[#55695C] leading-normal">
                <strong>Authorization Guard:</strong> Only the explicitly authorized administrator account (<code className="font-mono bg-white px-1">{ADMIN_EMAIL}</code>) can access the admin dashboard. Signing in with any other Google account or email will be rejected at the auth boundary.
              </p>
            </div>
          </div>

          {/* Section 3: Google Sign-In & Email/Password Providers */}
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-[#143020] flex items-center space-x-1.5">
              <ShieldAlert className="w-4 h-4 text-[#B88E3E]" />
              <span>2. Manual Setup Checklist in Firebase Console</span>
            </h4>
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E6E2D4] space-y-2">
              <p className="text-[#3E5244]">
                To ensure both login methods function seamlessly in production:
              </p>
              <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-[#465A4D]">
                <li>
                  Open <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="text-[#193F27] font-bold underline inline-flex items-center space-x-0.5"><span>Firebase Console</span><ExternalLink className="w-2.5 h-2.5 inline" /></a> and navigate to project <strong>consummate-mesh-701dl</strong>.
                </li>
                <li>
                  Go to <strong>Build &gt; Authentication &gt; Sign-in method</strong> tab.
                </li>
                <li>
                  Verify that <strong>Google</strong> is enabled (configured with OAuth Client ID).
                </li>
                <li>
                  Ensure <strong>Email/Password</strong> provider is toggled to <strong>Enabled</strong>.
                </li>
                <li>
                  Under <strong>Authorized domains</strong>, ensure your deployment domains are added (e.g. Cloud Run, Firebase Hosting, or custom domain).
                </li>
              </ol>
            </div>
          </div>

          {/* Section 4: Security Rules */}
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-[#143020] flex items-center space-x-1.5">
              <Server className="w-4 h-4 text-[#B88E3E]" />
              <span>3. Firestore Security Rules Deployment</span>
            </h4>
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E6E2D4] space-y-2">
              <p>
                The security rules defined in <code className="font-mono bg-white px-1">firestore.rules</code> have been deployed to Cloud Firestore.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-[11px] text-[#4F6355]">
                <li>
                  <strong>Public Reads:</strong> Allowed for <code className="font-mono">settings/general</code>, <code className="font-mono">students</code>, <code className="font-mono">announcements</code>, and <code className="font-mono">gallery</code> so visitors can view live availability.
                </li>
                <li>
                  <strong>Public Creates:</strong> Allowed only on <code className="font-mono">enquiries</code> with schema validation (length, type, pending status).
                </li>
                <li>
                  <strong>Admin-Only Writes:</strong> Writing to settings, students, attendance logs, announcements, and managing enquiries is strictly locked to <code className="font-mono">{ADMIN_EMAIL}</code>.
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5: Free Hosting Deployment */}
          <div className="space-y-2">
            <h4 className="font-serif text-sm font-bold text-[#143020] flex items-center space-x-1.5">
              <Globe className="w-4 h-4 text-[#B88E3E]" />
              <span>4. Free Production Hosting Deployment</span>
            </h4>
            <div className="bg-[#FAF9F5] p-3.5 rounded-xl border border-[#E6E2D4] space-y-2 text-[11px]">
              <p>
                The project is fully prepared for free hosting via <strong>Firebase Hosting</strong> or <strong>Google Cloud Run</strong>:
              </p>
              <div className="bg-white p-3 rounded-lg border border-[#D5D0C0] font-mono text-[10px] space-y-1">
                <div className="text-[#6D8074]"># Build frontend application</div>
                <div className="font-bold text-[#163823]">npm run build</div>
                <div className="text-[#6D8074] pt-1"># Deploy static assets to Firebase Hosting (free tier)</div>
                <div className="font-bold text-[#163823]">firebase deploy --only hosting</div>
                <div className="text-[#6D8074] pt-1"># Or run fullstack server</div>
                <div className="font-bold text-[#163823]">npm run start</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#FAF9F5] border-t border-[#DFDACB] flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1B3B2B] text-white text-xs font-bold hover:bg-[#142E21] transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
