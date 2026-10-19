'use client';

import { useState, useEffect } from 'react';
import {
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Lock,
  Sparkles,
  RefreshCw,
  Sliders,
  LogOut,
  Info,
} from 'lucide-react';
import {
  changeAdminPasswordAction,
  getAdminSecurityInfoAction,
  toggleQuickAccessAction,
} from '@/actions/admin';

export function AdminSecuritySettings() {
  const [hasCustomPassword, setHasCustomPassword] = useState(false);
  const [allowQuickAccess, setAllowQuickAccess] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string>('');
  const [loadingInfo, setLoadingInfo] = useState(true);

  // Form states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);
  const [togglingQuick, setTogglingQuick] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadSecurityInfo();
  }, []);

  const loadSecurityInfo = async () => {
    setLoadingInfo(true);
    try {
      const info = await getAdminSecurityInfoAction();
      setHasCustomPassword(info.hasCustomPassword);
      setAllowQuickAccess(info.allowQuickAccess);
      setUpdatedAt(info.updatedAt);
    } catch (err) {
      console.error('Failed to load security info:', err);
    } finally {
      setLoadingInfo(false);
    }
  };

  const getAdminToken = () =>
    typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!currentPassword) {
      setStatusMessage({ type: 'error', text: 'Please enter your current password or passkey.' });
      return;
    }

    if (newPassword.length < 4) {
      setStatusMessage({ type: 'error', text: 'New password must be at least 4 characters.' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatusMessage({ type: 'error', text: 'New password and confirmation do not match.' });
      return;
    }

    setSaving(true);
    try {
      const res = await changeAdminPasswordAction(currentPassword, newPassword, getAdminToken());
      if (res.success) {
        setStatusMessage({ type: 'success', text: res.message });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        await loadSecurityInfo();
      } else {
        setStatusMessage({ type: 'error', text: res.message });
      }
    } catch {
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred while saving.' });
    } finally {
      setSaving(false);
    }
  };

  const handleToggleQuick = async () => {
    setTogglingQuick(true);
    setStatusMessage(null);
    try {
      const targetState = !allowQuickAccess;
      const res = await toggleQuickAccessAction(targetState, getAdminToken());
      if (res.success) {
        setAllowQuickAccess(res.allowQuickAccess);
        setStatusMessage({
          type: 'success',
          text: res.allowQuickAccess
            ? 'One-Click Founder Access is now ENABLED.'
            : 'One-Click Founder Access is now DISABLED. Dashboard requires passkey.',
        });
      } else {
        setStatusMessage({ type: 'error', text: 'Failed to update quick access toggle.' });
      }
    } catch (err) {
      console.error('Failed to toggle quick access:', err);
      setStatusMessage({ type: 'error', text: 'An unexpected error occurred while toggling quick access.' });
    } finally {
      setTogglingQuick(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold font-display text-[#F4F4F6]">
                Security & Passkey Manager
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400 font-bold uppercase">
                {hasCustomPassword ? 'Custom Password Active' : 'Default Passkey Active'}
              </span>
            </div>
            <p className="text-xs text-[#8E93A4] mt-0.5">
              Set, update, or strengthen the administrative credentials for your portfolio control center.
            </p>
          </div>
        </div>

        <button
          onClick={loadSecurityInfo}
          disabled={loadingInfo}
          className="px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-xs font-mono text-[#8E93A4] hover:text-[#F4F4F6] flex items-center gap-1.5 transition-colors self-end sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loadingInfo ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Main Grid: Change Password Form (Left) + Policy & Status (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (7 cols): Set / Change Password Form */}
        <div className="lg:col-span-7 p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1E2230]">
            <div className="flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[#F4F4F6] font-display">
                {hasCustomPassword ? 'Change Admin Password' : 'Set Custom Admin Password'}
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#535868]">
              PBKDF2 SHA-512 Encrypted
            </span>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl text-xs font-mono flex items-start gap-2.5 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/10 border border-rose-500/20 text-rose-400'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            {/* Current Password Field */}
            <div>
              <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Current Password / Passkey
                <span className="text-[#535868] ml-1 font-sans">
                  ({hasCustomPassword ? 'Your current password' : 'Default: 7860 or abuhuraira2026'})
                </span>
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password..."
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-sm focus:border-emerald-500/60 focus:outline-none transition-colors placeholder:text-[#535868]"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-3 text-[#535868] hover:text-[#F4F4F6] transition-colors"
                >
                  {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* New Password Field */}
            <div>
              <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                New Admin Password (Minimum 4 characters)
              </label>
              <div className="relative">
                <input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new strong password..."
                  required
                  minLength={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-sm focus:border-emerald-500/60 focus:outline-none transition-colors placeholder:text-[#535868]"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-3 text-[#535868] hover:text-[#F4F4F6] transition-colors"
                >
                  {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password..."
                  required
                  minLength={4}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-[#F4F4F6] text-sm focus:border-emerald-500/60 focus:outline-none transition-colors placeholder:text-[#535868]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-3 text-[#535868] hover:text-[#F4F4F6] transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Saving New Password...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Save & Update Password</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Policy, Telemetry & Status */}
        <div className="lg:col-span-5 space-y-6">
          {/* Status & Credential Card */}
          <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-[#1E2230]">
              <Sliders className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-[#F4F4F6] font-display">
                Authentication Policy
              </h3>
            </div>

            {/* Quick Access Toggle */}
            <div className="flex items-start justify-between gap-4 p-4 rounded-2xl bg-[#08090D] border border-[#1E2230]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-semibold text-[#F4F4F6]">
                    One-Click Founder Access
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase transition-colors ${
                      allowQuickAccess
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                    }`}
                  >
                    {allowQuickAccess ? 'Active (ON)' : 'Disabled (OFF)'}
                  </span>
                </div>
                <p className="text-[11px] text-[#8E93A4] leading-relaxed">
                  {allowQuickAccess
                    ? 'Allows instant 1-click login from the login page without typing a passkey.'
                    : '1-Click login is turned off. All dashboard logins require entering your administrative passkey.'}
                </p>
              </div>

              <button
                type="button"
                onClick={handleToggleQuick}
                disabled={togglingQuick}
                aria-label="Toggle One-Click Founder Access"
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  allowQuickAccess ? 'bg-emerald-500' : 'bg-[#1E2230]'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    allowQuickAccess ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Password Health info */}
            <div className="space-y-2 text-xs font-mono text-[#8E93A4]">
              <div className="flex items-center justify-between py-1.5 border-b border-[#1E2230]/50">
                <span>Passkey Status:</span>
                <span className={hasCustomPassword ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
                  {hasCustomPassword ? 'Custom Secure Password' : 'Default Development Key'}
                </span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#1E2230]/50">
                <span>Encryption Algorithm:</span>
                <span className="text-[#F4F4F6]">PBKDF2-HMAC-SHA512</span>
              </div>
              <div className="flex items-center justify-between py-1.5 border-b border-[#1E2230]/50">
                <span>Salt Length:</span>
                <span className="text-[#F4F4F6]">32-byte Cryptographic</span>
              </div>
              {updatedAt && (
                <div className="flex items-center justify-between py-1.5">
                  <span>Last Modified:</span>
                  <span className="text-[#535868] text-[10px]">
                    {new Date(updatedAt).toLocaleDateString()} {new Date(updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Guidance Note */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-[#8E93A4] leading-relaxed">
              <strong className="text-[#F4F4F6] block mb-0.5">Password Persistence:</strong>
              Your custom password is saved securely on the server (<code className="text-emerald-400 font-mono text-[11px]">data/admin-config.json</code>) and persists across builds, server restarts, and Docker deployments.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
