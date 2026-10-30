import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  ShieldCheck, 
  Loader2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  CheckCircle2
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  signOut,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth, googleProvider, ADMIN_EMAIL } from '../firebase.ts';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const [email, setEmail] = useState('kamalkaran939@gmail.com');
  const [password, setPassword] = useState('karan206242');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const trimmedEmail = email.trim().toLowerCase();
      if (trimmedEmail !== ADMIN_EMAIL.toLowerCase()) {
        throw new Error(`Unauthorized Account: Only ${ADMIN_EMAIL} is designated as library administrator.`);
      }

      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, trimmedEmail, password);
      } catch (signInErr: any) {
        // If user doesn't exist yet in newly provisioned Firebase auth, attempt auto-initialization for the authorized admin
        if (signInErr.code === 'auth/user-not-found' || signInErr.code === 'auth/invalid-credential') {
          try {
            userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
          } catch (createErr: any) {
            throw signInErr;
          }
        } else {
          throw signInErr;
        }
      }

      if (userCredential.user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        throw new Error(`Access Denied: Only ${ADMIN_EMAIL} can access the admin dashboard.`);
      }

      onLoginSuccess();
      onClose();
    } catch (err: any) {
      console.error('Login error:', err);
      let msg = err.message || 'Login failed. Please verify credentials.';
      if (err.code === 'auth/invalid-credential') {
        msg = 'Invalid email or password. Please verify your credentials.';
      } else if (err.code === 'auth/operation-not-allowed') {
        msg = 'Email/Password provider is being initialized in Firebase Console. You can also sign in with Google using kamalkaran939@gmail.com.';
      }
      setErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      if (user.email?.toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
        await signOut(auth);
        throw new Error(
          `Unauthorized: ${user.email} is not authorized. Only designated admin (${ADMIN_EMAIL}) can access this dashboard.`
        );
      }

      onLoginSuccess();
      onClose();
    } catch (err: any) {
      console.error('Google Sign-In error:', err);
      setErrorMessage(err.message || 'Google Sign-In failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-150">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl max-w-md w-full border border-[#DFDACB] shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#173824] text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#E5C378] text-[#173824] flex items-center justify-center font-bold text-sm">
              <ShieldCheck className="w-5 h-5 text-[#173824]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold">Admin Authentication</h3>
              <p className="text-[11px] text-[#BED4C7]">Authorized Incharge Access Only</p>
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
        <div className="p-4 sm:p-6 space-y-4 text-xs">
          {errorMessage && (
            <div className="p-3 rounded-lg bg-[#FDF2F2] border border-[#F8B4B4] text-[#9B1C1C] flex items-start space-x-2">
              <AlertCircle className="w-4 h-4 text-[#C53030] shrink-0 mt-0.5" />
              <p className="leading-normal">{errorMessage}</p>
            </div>
          )}

          {/* Notice about authorized email */}
          <div className="p-3 rounded-lg bg-[#FAF7EE] border border-[#E8DEC7] text-[#5C491C] space-y-1">
            <span className="font-bold text-[11px] uppercase tracking-wider block">
              Designated Administrator:
            </span>
            <p className="text-xs font-mono font-semibold text-[#1B3B2B]">
              kamalkaran939@gmail.com
            </p>
            <p className="text-[11px] text-[#715F33]">
              Only explicitly authorized administrator accounts may access the admin dashboard and modify data.
            </p>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-[#273B2F] font-semibold mb-1">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-[#88978D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#273B2F] font-semibold mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-[#88978D] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-10 py-2 rounded-lg border border-[#D5D0C0] bg-[#FAF9F5] text-xs text-[#1D3224] focus:outline-none focus:ring-1 focus:ring-[#1E4D30] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7F9085] hover:text-[#273B2F]"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-xl bg-[#1B3B2B] hover:bg-[#142E21] text-[#FAF9F5] text-xs font-bold flex items-center justify-center space-x-2 shadow-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#E5C378]" />
              ) : (
                <span>Login with Email & Password</span>
              )}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-[#E2DFC]"></div>
            <span className="flex-shrink mx-3 text-[10px] text-[#86958B] uppercase font-bold tracking-wider">or sign in with</span>
            <div className="flex-grow border-t border-[#E2DFC]"></div>
          </div>

          {/* Google Sign-in Button */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 px-3 rounded-xl bg-white hover:bg-[#FAF9F5] text-[#243A2C] text-xs font-semibold border border-[#D5D0C0] flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 shadow-xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.27-2.09 3.665-5.17 3.665-9.12z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.27 21.43 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.17 0 9.99 0 12s.45 3.83 1.25 5.42l4.03-3.13z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.27 2.57 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z"
              />
            </svg>
            <span>Google Sign-In (kamalkaran939@gmail.com)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
