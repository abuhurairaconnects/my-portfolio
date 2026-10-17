import type { Metadata } from 'next';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactForm } from '@/components/contact/ContactForm';
import { portfolioData } from '@/data/portfolio';
import { Mail, Github, MessageSquare, Linkedin, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact | Abu Huraira',
  description: 'Reach out to Abu Huraira for general inquiries, collaborations, and software consultations.',
};

export default function ContactPage() {
  const { person, faqs } = portfolioData;

  return (
    <main className="min-h-screen bg-transparent text-[#F4F4F6] relative selection:bg-emerald-500/20 selection:text-emerald-300">
      <Navbar />

      <div className="pt-36 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="max-w-3xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 mb-4">
            <span>Direct Communication & Inquiries</span>
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl text-[#F4F4F6] tracking-tight mb-4">
            Contact & General Inquiries
          </h1>

          <p className="text-base sm:text-lg text-[#8E93A4] leading-relaxed">
            Have an engineering inquiry, collaboration idea, or consultation request? Connect directly via the form below or through direct social channels.
          </p>
        </div>

        {/* 2-Column Contact Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
          {/* Left Column (5 cols): Direct Channels & Availability info */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230]">
              <h3 className="font-display font-bold text-lg text-[#F4F4F6] mb-4">
                Direct Channels
              </h3>

              <div className="space-y-3">
                <a
                  href={`mailto:${person.social.email}`}
                  className="p-3.5 rounded-2xl bg-[#08090D] border border-[#1E2230] hover:border-emerald-500/40 flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-[#535868]">Email</span>
                    <span className="text-xs font-medium text-[#F4F4F6] truncate group-hover:text-emerald-400 transition-colors">
                      {person.social.email}
                    </span>
                  </div>
                </a>

                <a
                  href={person.social.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#08090D] border border-[#1E2230] hover:border-emerald-500/40 flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-[#535868]">WhatsApp (Direct)</span>
                    <span className="text-xs font-medium text-[#F4F4F6] truncate group-hover:text-emerald-400 transition-colors">
                      +880 1869-171818
                    </span>
                  </div>
                </a>

                <a
                  href={person.social.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#08090D] border border-[#1E2230] hover:border-blue-500/40 flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                    <Linkedin className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-[#535868]">LinkedIn</span>
                    <span className="text-xs font-medium text-[#F4F4F6] truncate group-hover:text-emerald-400 transition-colors">
                      linkedin.com/in/abuhuraira
                    </span>
                  </div>
                </a>

                <a
                  href={person.social.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3.5 rounded-2xl bg-[#08090D] border border-[#1E2230] hover:border-[#2E354B] flex items-center gap-3 group transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#161922] flex items-center justify-center text-[#F4F4F6] shrink-0">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] font-mono text-[#535868]">GitHub</span>
                    <span className="text-xs font-medium text-[#F4F4F6] truncate group-hover:text-emerald-400 transition-colors">
                      github.com/abuhurairaconnects
                    </span>
                  </div>
                </a>
              </div>
            </div>

            {/* Response Time & Location Box */}
            <div className="p-6 rounded-3xl bg-[#11131A] border border-[#1E2230] space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#F4F4F6] block">
                    Fast Turnaround
                  </span>
                  <span className="text-[11px] text-[#8E93A4]">
                    Typically replies within 2–4 hours during business days.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-[#1E2230]">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-xs font-semibold text-[#F4F4F6] block">
                    Location & Remote Flexibility
                  </span>
                  <span className="text-[11px] text-[#8E93A4]">
                    Dhaka, Bangladesh · Available for global remote contracts.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (7 cols): The Contact Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>

        {/* FAQs */}
        <div className="pt-12 border-t border-[#1E2230]">
          <h2 className="font-display font-bold text-2xl text-[#F4F4F6] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230]">
                <h3 className="font-display font-semibold text-sm text-[#F4F4F6] mb-2">
                  {faq.question}
                </h3>
                <p className="text-xs text-[#8E93A4] leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
