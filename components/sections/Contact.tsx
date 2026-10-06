"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Mail,
  Copy,
  Check,
  Calendar,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle2,
  MapPin,
  Clock,
  Linkedin,
  Github,
  Sparkles,
} from "lucide-react";
import { portfolio } from "@/data/portfolio";
import { PortfolioData, contactFormSchema, ContactFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { MotionReveal } from "@/components/ui/MotionReveal";

interface ContactProps {
  data?: PortfolioData;
}

export function Contact({ data = portfolio }: ContactProps): React.ReactElement {
  const [copied, setCopied] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [loadTimestamp, setLoadTimestamp] = React.useState<number>(0);

  React.useEffect(() => {
    setLoadTimestamp(Date.now());
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
      website_hp: "",
    },
  });

  const handleCopyEmail = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(data.person.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const onSubmit = async (data: ContactFormData): Promise<void> => {
    setSubmitStatus("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          formLoadTimestamp: loadTimestamp,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Unable to send message. Please contact directly via email."
        );
      }

      setSubmitStatus("success");
      reset();
    } catch (err: unknown) {
      setSubmitStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to send message. Please reach out directly."
      );
    }
  };

  return (
    <section id="contact" aria-labelledby="contact-heading" className="py-24 border-t border-border overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Framora-Style High Impact Top CTA Banner: Converging from Scale */}
        <MotionReveal direction="scale">
          <div className="rounded-3xl border border-border bg-gradient-to-b from-surface to-surface/60 p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-border/80 bg-bg/60 text-xs font-mono text-accent">
              <Sparkles className="w-3.5 h-3.5" />
              <span>START A CONVERSATION</span>
            </div>

            <div className="space-y-3 max-w-2xl mx-auto">
              <h2 id="contact-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-text leading-tight">
                Have a challenging project or system requirement in mind?
              </h2>
              <p className="text-sm sm:text-base text-text-muted leading-relaxed">
                Whether you need Web Development, AI Automation, or modern Software Engineering—reach out directly.
              </p>
            </div>
          </div>
        </MotionReveal>

        {/* Contact Grid: Direct Info Left + Interactive Form Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Info from Left */}
          <MotionReveal direction="left" delay={0.15} className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-7 sm:p-8 space-y-6 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                {"// Direct Transmission"}
              </h3>

              {/* Email with 1-click Copy */}
              <div className="space-y-2">
                <span className="text-xs text-text-muted font-medium block">
                  Encrypted Email
                </span>
                <div className="flex items-center gap-2">
                  <a
                    href={`mailto:${data.person.email}`}
                    className="text-base sm:text-lg font-semibold text-text hover:text-accent transition-colors break-all"
                  >
                    {data.person.email}
                  </a>
                  <button
                    type="button"
                    onClick={handleCopyEmail}
                    className="p-2.5 rounded-xl border border-border bg-bg/80 text-text-muted hover:text-accent hover:border-accent transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    aria-label="Copy email address to clipboard"
                    title="Copy email address"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-success" aria-hidden="true" />
                    ) : (
                      <Copy className="w-4 h-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {copied && (
                  <p className="text-xs text-success font-mono animate-fade-in" role="status">
                    Email copied to clipboard
                  </p>
                )}
              </div>

              {/* Location & Timezone */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/80 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <MapPin className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    <span>Location</span>
                  </div>
                  <div className="font-semibold text-text">{data.person.location}</div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Clock className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
                    <span>Timezone</span>
                  </div>
                  <div className="font-semibold text-text">{data.person.timezone}</div>
                </div>
              </div>

              {/* Social Channels */}
              <div className="pt-4 border-t border-border/80 space-y-3">
                <span className="text-xs text-text-muted font-medium block">
                  Direct Networks
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href={data.person.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-bg/60 hover:border-accent hover:text-accent text-xs font-medium transition-colors min-h-[44px]"
                  >
                    <Linkedin className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span>LinkedIn</span>
                  </a>
                  <a
                    href={data.person.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-border bg-bg/60 hover:border-accent hover:text-accent text-xs font-medium transition-colors min-h-[44px]"
                  >
                    <Github className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span>GitHub</span>
                  </a>
                </div>
              </div>
            </div>
          </MotionReveal>

          {/* Right Column: Contact Form from Right */}
          <MotionReveal direction="right" delay={0.2} className="lg:col-span-7">
            <div className="rounded-2xl border border-border bg-surface p-7 sm:p-9 space-y-6 shadow-sm">
              <h3 className="text-xs font-mono uppercase tracking-wider text-accent font-semibold">
                {"// Send Message"}
              </h3>

              {submitStatus === "success" ? (
                <div
                  className="p-8 rounded-2xl border border-success/30 bg-success/10 space-y-4 text-center"
                  role="status"
                  aria-live="polite"
                >
                  <CheckCircle2 className="w-12 h-12 text-success mx-auto" aria-hidden="true" />
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-text">Transmission Delivered</h4>
                    <p className="text-xs sm:text-sm text-text-muted leading-relaxed max-w-md mx-auto">
                      Thank you. Your message has been safely received. I will review your requirements and follow up within 24 hours.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitStatus("idle")}
                  >
                    Send Another Inquiry
                  </Button>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="space-y-4"
                  noValidate
                  aria-label="Contact Message Form"
                >
                  {/* Honeypot Field */}
                  <div className="hidden" aria-hidden="true">
                    <label htmlFor="website_hp">Do not fill this field</label>
                    <input
                      id="website_hp"
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      {...register("website_hp")}
                    />
                  </div>

                  {/* Name Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-name"
                      className="text-xs font-mono font-medium text-text flex justify-between"
                    >
                      <span>Full Name *</span>
                      {errors.name && (
                        <span className="text-accent text-[11px] font-sans">
                          {errors.name.message}
                        </span>
                      )}
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      autoComplete="name"
                      placeholder="e.g. Alex Mercer"
                      className={`w-full px-4 py-3 rounded-xl border bg-bg text-text text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        errors.name ? "border-accent" : "border-border"
                      }`}
                      {...register("name")}
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-email"
                      className="text-xs font-mono font-medium text-text flex justify-between"
                    >
                      <span>Work Email *</span>
                      {errors.email && (
                        <span className="text-accent text-[11px] font-sans">
                          {errors.email.message}
                        </span>
                      )}
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      autoComplete="email"
                      placeholder="alex@company.com"
                      className={`w-full px-4 py-3 rounded-xl border bg-bg text-text text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                        errors.email ? "border-accent" : "border-border"
                      }`}
                      {...register("email")}
                    />
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1.5">
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-mono font-medium text-text flex justify-between"
                    >
                      <span>Project Requirements / Message *</span>
                      {errors.message && (
                        <span className="text-accent text-[11px] font-sans">
                          {errors.message.message}
                        </span>
                      )}
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      placeholder="Describe your project, Web Development or AI Automation scope..."
                      className={`w-full px-4 py-3 rounded-xl border bg-bg text-text text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent resize-y ${
                        errors.message ? "border-accent" : "border-border"
                      }`}
                      {...register("message")}
                    />
                  </div>

                  {/* Error Notification */}
                  {submitStatus === "error" && (
                    <div
                      className="p-3.5 rounded-xl border border-accent/40 bg-accent/10 flex items-start gap-2 text-xs text-text"
                      role="alert"
                    >
                      <AlertCircle className="w-4 h-4 text-accent shrink-0 mt-0.5" aria-hidden="true" />
                      <div className="space-y-1">
                        <span className="font-semibold block">Submission Error:</span>
                        <p className="text-text-muted">{errorMessage}</p>
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitStatus === "loading"}
                      className="w-full min-h-[50px] rounded-xl bg-accent text-accent-fg hover:opacity-95 font-semibold text-sm flex items-center justify-center gap-2 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                    >
                      {submitStatus === "loading" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                          <span>Dispatching Message...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" aria-hidden="true" />
                          <span>Dispatch Message</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
