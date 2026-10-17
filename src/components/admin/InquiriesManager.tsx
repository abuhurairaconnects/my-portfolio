'use client';

import { useState } from 'react';
import { Inquiry } from '@/lib/inquiriesStore';
import {
  updateInquiryStatusAction,
  deleteInquiryAction,
  submitTestInquiryAction,
} from '@/actions/admin';
import {
  Mail,
  Trash2,
  CheckCircle2,
  Clock,
  Search,
  PlusCircle,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Inbox,
} from 'lucide-react';

interface InquiriesManagerProps {
  inquiries: Inquiry[];
  onRefresh: () => void;
}

export function InquiriesManager({ inquiries, onRefresh }: InquiriesManagerProps) {
  const [filter, setFilter] = useState<'all' | 'new' | 'replied' | 'archived'>('all');
  const [search, setSearch] = useState('');
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filtered = inquiries.filter((inq) => {
    if (filter !== 'all' && inq.status !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        inq.name.toLowerCase().includes(q) ||
        inq.email.toLowerCase().includes(q) ||
        inq.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const getAdminToken = () =>
    typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;

  const handleStatusChange = async (id: string, status: 'new' | 'replied' | 'archived') => {
    setLoadingId(id);
    await updateInquiryStatusAction(id, status, getAdminToken());
    onRefresh();
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this inquiry?')) return;
    setLoadingId(id);
    await deleteInquiryAction(id, getAdminToken());
    onRefresh();
    setLoadingId(null);
  };

  const handleCreateTestLead = async () => {
    setLoadingId('test-create');
    await submitTestInquiryAction(getAdminToken());
    onRefresh();
    setLoadingId(null);
  };

  const formatTime = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#11131A] border border-[#1E2230] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {(['all', 'new', 'replied', 'archived'] as const).map((tab) => {
            const count =
              tab === 'all'
                ? inquiries.length
                : inquiries.filter((i) => i.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider transition-all ${
                  filter === tab
                    ? 'bg-emerald-500 text-[#08090D] font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-[#161922] text-[#8E93A4] hover:text-[#F4F4F6] border border-[#1E2230]'
                }`}
              >
                {tab} ({count})
              </button>
            );
          })}
        </div>

        {/* Search & Test Lead Button */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search leads..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-[#08090D] border border-[#1E2230] text-xs text-[#F4F4F6] placeholder:text-[#535868] focus:border-emerald-500/50 focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#535868] absolute left-3 top-2.5 pointer-events-none" />
          </div>

          <button
            onClick={handleCreateTestLead}
            disabled={loadingId === 'test-create'}
            className="px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1C202C] border border-[#1E2230] text-emerald-400 text-xs font-mono flex items-center gap-1.5 shrink-0 transition-colors"
            title="Create a sample incoming inquiry to test the pipeline"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Simulate Lead</span>
          </button>
        </div>
      </div>

      {/* Inquiries List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#11131A] border border-[#1E2230]">
          <Inbox className="w-12 h-12 text-[#535868] mx-auto mb-3" />
          <h3 className="font-display font-bold text-lg text-[#F4F4F6]">
            No Inquiries Found
          </h3>
          <p className="text-xs text-[#8E93A4] mt-1 max-w-sm mx-auto">
            {search
              ? `No messages match your search term "${search}".`
              : 'When visitors submit the contact form on your portfolio, their messages will arrive here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((inq) => {
            const isNew = inq.status === 'new';
            const isReplied = inq.status === 'replied';

            return (
              <div
                key={inq.id}
                className={`p-5 sm:p-6 rounded-2xl bg-[#11131A] border transition-all ${
                  isNew
                    ? 'border-emerald-500/40 shadow-lg shadow-emerald-500/5'
                    : 'border-[#1E2230]'
                }`}
              >
                {/* Header: Sender & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#161922] border border-[#1E2230] flex items-center justify-center font-display font-bold text-xs text-emerald-400">
                      {inq.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm sm:text-base text-[#F4F4F6]">
                          {inq.name}
                        </span>
                        {isNew && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-mono text-emerald-400 font-semibold animate-pulse">
                            NEW LEAD
                          </span>
                        )}
                        {isReplied && (
                          <span className="px-2 py-0.5 rounded-full bg-[#161922] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]">
                            REPLIED
                          </span>
                        )}
                      </div>
                      <a
                        href={`mailto:${inq.email}?subject=Re:%20Inquiry%20regarding%20Software%20%26%20AI%20Automation`}
                        className="text-xs font-mono text-[#8E93A4] hover:text-emerald-400 transition-colors"
                      >
                        {inq.email}
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-xs font-mono text-[#535868]">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{formatTime(inq.timestamp)}</span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230] text-xs sm:text-sm text-[#F4F4F6] leading-relaxed mb-4">
                  {inq.message}
                </div>

                {/* Inquiry Metadata Badges */}
                <div className="mb-4 flex flex-wrap items-center gap-2">
                  {inq.inquiryType === 'hire' && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-mono font-bold text-emerald-400">
                      ★ DIRECT HIRE INQUIRY
                    </span>
                  )}
                  {inq.serviceType && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] border border-[#1E2230] text-[11px] font-mono text-[#F4F4F6]">
                      <span>Service:</span>
                      <span className="text-cyan-400">{inq.serviceType}</span>
                    </span>
                  )}
                  {inq.budget && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] border border-[#1E2230] text-[11px] font-mono text-emerald-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Budget: {inq.budget}</span>
                    </span>
                  )}
                  {inq.timeline && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#161922] border border-[#1E2230] text-[11px] font-mono text-amber-400">
                      <Clock className="w-3 h-3" />
                      <span>Timeline: {inq.timeline}</span>
                    </span>
                  )}
                </div>

                {/* Actions Footer */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1E2230]">
                  {/* Status Toggle Buttons */}
                  <div className="flex items-center gap-2">
                    {isNew ? (
                      <button
                        onClick={() => handleStatusChange(inq.id, 'replied')}
                        disabled={loadingId === inq.id}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Replied</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStatusChange(inq.id, 'new')}
                        disabled={loadingId === inq.id}
                        className="px-3 py-1.5 rounded-lg bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-[#8E93A4] text-xs font-mono flex items-center gap-1.5 transition-colors"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>Mark New</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleStatusChange(
                          inq.id,
                          inq.status === 'archived' ? 'new' : 'archived'
                        )
                      }
                      disabled={loadingId === inq.id}
                      className="px-3 py-1.5 rounded-lg bg-[#161922] hover:bg-[#1B202D] border border-[#1E2230] text-[#8E93A4] text-xs font-mono transition-colors"
                    >
                      {inq.status === 'archived' ? 'Unarchive' : 'Archive'}
                    </button>
                  </div>

                  {/* Direct Contact Links & Delete */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`mailto:${inq.email}?subject=Re:%20Inquiry%20regarding%20Software%20%26%20AI%20Automation`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs flex items-center gap-1.5 transition-all"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Reply via Email</span>
                    </a>

                    <button
                      onClick={() => handleDelete(inq.id)}
                      disabled={loadingId === inq.id}
                      className="p-1.5 rounded-lg bg-[#161922] hover:bg-rose-500/20 text-[#535868] hover:text-rose-400 border border-[#1E2230] hover:border-rose-500/30 transition-colors"
                      title="Delete inquiry"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
