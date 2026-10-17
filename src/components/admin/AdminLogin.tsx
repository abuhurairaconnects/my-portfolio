'use client';

import { useState, useEffect } from 'react';
import {
  Lock,
  KeyRound,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Settings,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  Key,
} from 'lucide-react';
import {
  verifyAdminPasswordAction,
  changeAdminPasswordAction,
  getAdminSecurityInfoAction,
} from '@/actions/admin';

interface AdminLoginProps {
  onAuthenticated: () => void;
}

export function AdminLogin({ onAuthenticated }: AdminLoginProps) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Security config info
  const [hasCustomPassword, setHasCustomPassword] = useState(false);
  const [allowQuickAccess, setAllowQuickAccess] = useState(true);

  // Set / Change Password Modal
  const [showChangeModal, setShowChangeModal] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [changeError, setChangeError] = useState('');
  const [changeSuccess, setChangeSuccess] = useState('');
  const [changeLoading, setChangeLoading] = useState(false);

  useEffect(() => {
    getAdminSecurityInfoAction()
      .then((info) => {
        setHasCustomPassword(info.hasCustomPassword);
        setAllowQuickAccess(info.allowQuickAccess);
      })
      .catch((err) => console.error('Failed to load security status:', err));
  }, []);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your admin passkey or password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await verifyAdminPasswordAction(pin.trim());
      if (res.success) {
        if (res.token) {
          sessionStorage.setItem('ah_admin_token', res.token);
        }
        sessionStorage.setItem('ah_admin_auth', 'true');
        onAuthenticated();
      } else {
        setError(res.message || 'Invalid Security Passkey. Please try again.');
        setLoading(false);
      }
    } catch {
      setError('Authentication server error. Please try again.');
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await verifyAdminPasswordAction('7860');
      if (res.success) {
        if (res.token) {
          sessionStorage.setItem('ah_admin_token', res.token);
        }
        sessionStorage.setItem('ah_admin_auth', 'true');
        onAuthenticated();
      } else {
        setError(res.message || 'Quick access is unavailable. Please enter passkey.');
        setLoading(false);
      }
    } catch {
      setError('Authentication server error. Please try again.');
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangeError('');
    setChangeSuccess('');

    if (!currentPass) {
      setChangeError('Please enter your current passkey.');
      return;
    }

    if (newPass.length < 4) {
      setChangeError('New password must be at least 4 characters.');
      return;
    }

    if (newPass !== confirmPass) {
      setChangeError('New password and confirmation do not match.');
      return;
    }

    setChangeLoading(true);
    try {
      const res = await changeAdminPasswordAction(currentPass, newPass);
      if (res.success) {
        setChangeSuccess(res.message);
        setHasCustomPassword(true);
        setTimeout(() => {
          sessionStorage.setItem('ah_admin_auth', 'true');
          onAuthenticated();
        }, 1200);
      } else {
        setChangeError(res.message);
      }
    } catch {
      setChangeError('Failed to change password. Please try again.');
    } finally {
      setChangeLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090D] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background Architectural Grid Lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1E223015_1px,transparent_1px),linear-gradient(to_bottom,#1E223015_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-[#11131A] border border-[#1E2230] shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400 mb-4 shadow-lg shadow-black/50">
            <Lock className="w-7 h-7" />
          </div>

          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider">
              System Control Center
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#161922] border border-[#1E2230] text-[#8E93A4]">
              {hasCustomPassword ? 'Custom Key' : 'Default Key'}
            </span>
          </div>

          <h1 className="font-display font-bold text-2xl text-[#F4F4F6] tracking-tight">
            Abu Huraira Admin
          </h1>
          <p className="text-xs text-[#8E93A4] mt-1">
            Enter administrative credentials to manage inquiries, projects, and system telemetry.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono text-center flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleVerify} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-mono text-[#8E93A4]">
                {hasCustomPassword ? 'Admin Passkey / Password' : 'Passkey or PIN (Default: 7860)'}
              </label>
              <button
                type="button"
                onClick={() => setShowChangeModal(true)}
                className="text-[11px] font-mono text-emerald-400 hover:underline flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                <span>Set / Change</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setError('');
                }}
                placeholder={hasCustomPassword ? 'Enter your custom passkey...' : 'Enter passkey (e.g. 7860)...'}
                className="w-full px-4 py-3 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-sm focus:border-emerald-500/60 focus:outline-none transition-colors placeholder:text-[#535868] pr-10"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-3.5 text-[#535868] hover:text-[#F4F4F6] transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Authorize Access'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-[#1E2230] text-center space-y-3">
          {allowQuickAccess && (
            <button
              onClick={handleQuickLogin}
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-[#F4F4F6] text-xs font-mono font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>One-Click Founder Access</span>
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[#535868]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>PBKDF2 SHA-512 Encrypted · Server-Side Verification</span>
          </div>
        </div>
      </div>

      {/* Set / Change Password Modal */}
      {showChangeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#11131A] border border-[#1E2230] shadow-2xl relative">
            <button
              onClick={() => {
                setShowChangeModal(false);
                setChangeError('');
                setChangeSuccess('');
              }}
              className="absolute top-5 right-5 p-1.5 rounded-xl bg-[#161922] text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#1E2230]">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-[#F4F4F6] font-display">
                  Set / Change Admin Password
                </h3>
                <p className="text-xs text-[#8E93A4]">
                  Update your dashboard credentials safely.
                </p>
              </div>
            </div>

            {changeError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{changeError}</span>
              </div>
            )}

            {changeSuccess && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{changeSuccess} Authorizing session...</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1">
                  Current Passkey (Default: 7860)
                </label>
                <input
                  type="password"
                  value={currentPass}
                  onChange={(e) => setCurrentPass(e.target.value)}
                  placeholder="Enter current passkey..."
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-xs focus:border-emerald-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1">
                  New Admin Password (Min. 4 chars)
                </label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password..."
                  required
                  minLength={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-xs focus:border-emerald-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPass}
                  onChange={(e) => setConfirmPass(e.target.value)}
                  placeholder="Re-type new password..."
                  required
                  minLength={4}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-xs focus:border-emerald-500/60 focus:outline-none transition-colors"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="submit"
                  disabled={changeLoading}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{changeLoading ? 'Saving...' : 'Save & Log In'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="px-4 py-3 rounded-xl bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-xs font-mono text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
