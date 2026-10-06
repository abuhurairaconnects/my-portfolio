"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Lock,
  LogOut,
  Save,
  Plus,
  Trash2,
  Upload,
  CheckCircle,
  AlertCircle,
  Globe,
  Briefcase,
  User,
  Layers,
  Sparkles,
  ExternalLink,
  KeyRound,
  ShieldCheck,
  Mail,
  Send,
  RefreshCw,
  Clock,
  Settings,
  Check,
} from "lucide-react";
import { PortfolioData } from "@/lib/validations";

interface MessageItem {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function AdminPage(): React.ReactElement {
  // Always start unauthenticated so every visit requires entering the password
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(false);
  const [passwordInput, setPasswordInput] = React.useState("");
  const [authError, setAuthError] = React.useState("");

  const [activeTab, setActiveTab] = React.useState<
    "personal" | "about" | "projects" | "inbox" | "email" | "security"
  >("personal");
  const [data, setData] = React.useState<PortfolioData | null>(null);

  // Messages State
  const [messages, setMessages] = React.useState<MessageItem[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = React.useState(false);

  // Email Config State
  const [emailConfig, setEmailConfig] = React.useState({
    provider: "resend",
    toEmail: "abuhurairaconnects@gmail.com",
    resendApiKey: "",
    hasResendKey: false,
    resendKeyMasked: "",
    smtpUser: "",
    smtpPass: "",
    smtpHost: "smtp.gmail.com",
    smtpPort: 465,
    hasSmtp: false,
  });
  const [isSavingEmail, setIsSavingEmail] = React.useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = React.useState<{
    type: "idle" | "success" | "error";
    msg: string;
  }>({ type: "idle", msg: "" });
  const [isTestingEmail, setIsTestingEmail] = React.useState(false);
  const [testEmailResult, setTestEmailResult] = React.useState<{
    type: "idle" | "success" | "error";
    msg: string;
  }>({ type: "idle", msg: "" });
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveStatus, setSaveStatus] = React.useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = React.useState("");

  // Uploading state
  const [isUploading, setIsUploading] = React.useState(false);

  // Password Change state
  const [currentPassword, setCurrentPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [pwdStatus, setPwdStatus] = React.useState<{ type: "idle" | "loading" | "success" | "error"; msg: string }>({
    type: "idle",
    msg: "",
  });

  // New Project Form State
  const [newProject, setNewProject] = React.useState({
    title: "",
    slug: "",
    summary: "",
    problem: "",
    solution: "",
    tech: "Next.js, TypeScript, Tailwind CSS",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    imageAlt: "Project preview",
    live: "https://example.com",
    repo: "https://github.com",
    featured: false,
  });

  async function loadData(): Promise<void> {
    try {
      const res = await fetch("/api/admin/portfolio");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (err) {
      console.error("Failed to load portfolio data", err);
    }
  }

  async function loadMessages(): Promise<void> {
    setIsLoadingMessages(true);
    try {
      const res = await fetch("/api/admin/messages");
      if (res.ok) {
        const json = await res.json();
        setMessages(json);
      }
    } catch (err) {
      console.error("Failed to load messages", err);
    } finally {
      setIsLoadingMessages(false);
    }
  }

  async function loadEmailConfig(): Promise<void> {
    try {
      const res = await fetch("/api/admin/email-settings");
      if (res.ok) {
        const json = await res.json();
        setEmailConfig((prev) => ({
          ...prev,
          ...json,
          resendApiKey: "",
          smtpPass: "",
        }));
      }
    } catch (err) {
      console.error("Failed to load email config", err);
    }
  }

  const handleDeleteMessage = async (id: string): Promise<void> => {
    if (!confirm("Are you sure you want to delete this message?")) return;
    try {
      const res = await fetch(`/api/admin/messages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete message", err);
    }
  };

  const handleToggleRead = async (id: string, currentRead: boolean): Promise<void> => {
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, read: !currentRead }),
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: !currentRead } : m))
        );
      }
    } catch (err) {
      console.error("Failed to toggle read state", err);
    }
  };

  const handleSaveEmailSettings = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsSavingEmail(true);
    setEmailStatusMsg({ type: "idle", msg: "" });
    try {
      const res = await fetch("/api/admin/email-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(emailConfig),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setEmailStatusMsg({ type: "success", msg: "Email configuration saved successfully!" });
        loadEmailConfig();
        setTimeout(() => setEmailStatusMsg({ type: "idle", msg: "" }), 4000);
      } else {
        setEmailStatusMsg({ type: "error", msg: json.error || "Failed to save email settings." });
      }
    } catch {
      setEmailStatusMsg({ type: "error", msg: "Failed to save email settings." });
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleTestEmail = async (): Promise<void> => {
    setIsTestingEmail(true);
    setTestEmailResult({ type: "idle", msg: "" });
    try {
      const res = await fetch("/api/admin/email-test", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailConfig.toEmail }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setTestEmailResult({
          type: "success",
          msg: `Test email dispatched to ${emailConfig.toEmail}! Please check your inbox or spam folder.`,
        });
      } else {
        setTestEmailResult({
          type: "error",
          msg: json.error || "Test email delivery failed. Verify your key/password.",
        });
      }
    } catch {
      setTestEmailResult({
        type: "error",
        msg: "Failed to dispatch test email.",
      });
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setAuthError("");

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passwordInput }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setIsAuthenticated(true);
        loadData();
        loadMessages();
        loadEmailConfig();
      } else {
        setAuthError(json.error || "Incorrect password. Access denied.");
      }
    } catch {
      setAuthError("Failed to authenticate.");
    }
  };

  const handleLogout = async (): Promise<void> => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    setIsAuthenticated(false);
    setPasswordInput("");
    setData(null);
  };

  const handleSaveData = async (): Promise<void> => {
    if (!data) return;
    setIsSaving(true);
    setSaveStatus("idle");

    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setSaveStatus("success");
        setStatusMessage("All updates saved successfully and live on the website!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage(json.error || "Failed to save portfolio data.");
      }
    } catch {
      setSaveStatus("error");
      setStatusMessage("An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = e.target.files?.[0];
    if (!file || !data) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        const updatedData: PortfolioData = {
          ...data,
          person: {
            ...data.person,
            photo: json.url,
          },
        };
        setData(updatedData);

        // Auto-save immediately to data/portfolio.json so user doesn't have to manually save
        const saveRes = await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });

        if (saveRes.ok) {
          setSaveStatus("success");
          setStatusMessage("Photo uploaded and updated live on the website!");
        } else {
          setSaveStatus("success");
          setStatusMessage("Photo uploaded! Remember to click 'Save All Changes'.");
        }
        setTimeout(() => setSaveStatus("idle"), 5000);
      }
    } catch (err) {
      console.error("Upload error", err);
      setSaveStatus("error");
      setStatusMessage("Failed to upload photo. Please check format and try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!currentPassword) {
      setPwdStatus({ type: "error", msg: "Please enter your current master password." });
      return;
    }
    if (newPassword.length < 4) {
      setPwdStatus({ type: "error", msg: "New password must be at least 4 characters long." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdStatus({ type: "error", msg: "New passwords do not match. Please re-type carefully." });
      return;
    }

    setPwdStatus({ type: "loading", msg: "Updating master password..." });
    try {
      const res = await fetch("/api/admin/auth", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        setPwdStatus({
          type: "success",
          msg: "Master password changed successfully! Remember it for your next login.",
        });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPwdStatus({
          type: "error",
          msg: json.error || "Failed to update password. Current password may be incorrect.",
        });
      }
    } catch {
      setPwdStatus({ type: "error", msg: "An unexpected error occurred." });
    }
  };

  const handleAddProject = async (): Promise<void> => {
    if (!data || !newProject.title || !newProject.slug) return;

    const techArray = newProject.tech
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const created = {
      slug: newProject.slug.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
      title: newProject.title,
      summary: newProject.summary,
      featured: newProject.featured,
      problem: newProject.problem || "Initial architectural bottleneck.",
      solution: newProject.solution || "Engineered scalable implementation.",
      tech: techArray.length ? techArray : ["TypeScript", "Next.js"],
      links: {
        live: newProject.live,
        repo: newProject.repo,
      },
      image: newProject.image,
      imageAlt: newProject.imageAlt,
    };

    const updatedData: PortfolioData = {
      ...data,
      projects: [created, ...data.projects],
    };

    setData(updatedData);

    // Reset new project form
    setNewProject({
      title: "",
      slug: "",
      summary: "",
      problem: "",
      solution: "",
      tech: "Next.js, TypeScript, Tailwind CSS",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
      imageAlt: "Project preview",
      live: "",
      repo: "",
      featured: false,
    });

    // Auto-save immediately to disk & live website
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSaveStatus("success");
        setStatusMessage("Project added & published live to the website!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage(json.error || "Failed to auto-save project.");
      }
    } catch {
      setSaveStatus("error");
      setStatusMessage("Failed to auto-save project.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProject = async (slug: string): Promise<void> => {
    if (!data) return;
    const updatedProjects = data.projects.filter((p) => p.slug !== slug);
    const updatedData: PortfolioData = {
      ...data,
      projects: updatedProjects,
    };
    setData(updatedData);

    // Auto-save immediately to disk & live website
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setSaveStatus("success");
        setStatusMessage("Project deleted and removed live from website!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage(json.error || "Failed to delete project on server.");
      }
    } catch {
      setSaveStatus("error");
      setStatusMessage("Failed to delete project on server.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewProjectImageUpload = async (file: File): Promise<void> => {
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        setNewProject((prev) => ({
          ...prev,
          image: json.url,
        }));
        setSaveStatus("success");
        setStatusMessage("Project image uploaded successfully!");
        setTimeout(() => setSaveStatus("idle"), 4000);
      } else {
        setSaveStatus("error");
        setStatusMessage(json.error || "Failed to upload image.");
      }
    } catch {
      setSaveStatus("error");
      setStatusMessage("Failed to upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleProjectImageUpload = async (projIdx: number, file: File): Promise<void> => {
    if (!data || !file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (res.ok && json.url) {
        const updatedProjects = [...data.projects];
        updatedProjects[projIdx] = {
          ...updatedProjects[projIdx],
          image: json.url,
        };
        const updatedData: PortfolioData = {
          ...data,
          projects: updatedProjects,
        };
        setData(updatedData);

        // Auto-save immediately to disk & live website
        const saveRes = await fetch("/api/admin/portfolio", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedData),
        });
        const saveJson = await saveRes.json();
        if (saveRes.ok && saveJson.success) {
          setSaveStatus("success");
          setStatusMessage("Project image updated and published live!");
          setTimeout(() => setSaveStatus("idle"), 4000);
        }
      } else {
        setSaveStatus("error");
        setStatusMessage(json.error || "Failed to upload project image.");
      }
    } catch {
      setSaveStatus("error");
      setStatusMessage("Failed to upload project image.");
    } finally {
      setIsUploading(false);
    }
  };

  // 1. Password Prompt Screen (Shown Every Time Admin is Accessed)
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-border bg-surface p-8 sm:p-10 space-y-6 shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-accent text-accent-fg flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight text-text">
              Abu Huraira Admin Gate
            </h1>
            <p className="text-xs text-text-muted">
              Enter your master password to unlock the portfolio editor.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="admin-pass" className="text-xs font-mono text-text">
                Master Password:
              </label>
              <input
                id="admin-pass"
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl border border-accent/40 bg-accent/10 text-xs text-accent flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-accent text-accent-fg font-semibold text-sm hover:opacity-95 transition-opacity shadow-md"
            >
              Unlock Dashboard
            </button>
          </form>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-text-muted hover:text-accent transition-colors"
            >
              ← Back to Homepage
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Loading portfolio data if authenticated
  if (!data) {
    return (
      <div className="min-h-screen bg-bg text-text flex items-center justify-center font-mono">
        Fetching live portfolio records...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg text-text pb-24">
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 bg-surface/90 backdrop-blur-md border-b border-border py-4 px-6 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-accent text-accent-fg font-mono font-bold flex items-center justify-center text-xs">
              AH
            </span>
            <div>
              <h1 className="text-sm font-bold text-text">Portfolio Control Center</h1>
              <p className="text-[11px] text-text-muted font-mono">
                Editing: {data.person.name} ({data.person.role})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-bg text-xs font-mono text-text hover:text-accent transition-colors"
            >
              <span>View Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={handleSaveData}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-accent text-accent-fg font-semibold text-xs hover:opacity-95 transition-opacity shadow disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? "Saving..." : "Save All Changes"}</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg border border-border text-text-muted hover:text-accent transition-colors"
              title="Logout and Lock"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Save Notification Banner */}
      {saveStatus === "success" && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="p-3.5 rounded-xl border border-success/30 bg-success/10 text-success text-xs font-mono flex items-center gap-2">
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {saveStatus === "error" && (
        <div className="max-w-6xl mx-auto px-6 mt-4">
          <div className="p-3.5 rounded-xl border border-accent/40 bg-accent/10 text-accent text-xs font-mono flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{statusMessage}</span>
          </div>
        </div>
      )}

      {/* Main Admin Content */}
      <main className="max-w-6xl mx-auto px-6 mt-8 space-y-8">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-border pb-3">
          <button
            onClick={() => setActiveTab("personal")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "personal"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Personal & Photo</span>
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "about"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>About & Philosophy</span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "projects"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Projects Manager ({data.projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("inbox")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "inbox"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Messages Inbox</span>
            {messages.filter((m) => !m.read).length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white font-bold text-[10px]">
                {messages.filter((m) => !m.read).length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("email")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "email"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>Email Delivery</span>
            {emailConfig.hasResendKey || emailConfig.hasSmtp ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400" title="Connected" />
            ) : (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Needs Setup" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors flex items-center gap-2 ${
              activeTab === "security"
                ? "bg-accent text-accent-fg font-semibold shadow"
                : "text-text-muted hover:text-text hover:bg-surface"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Change Password</span>
          </button>
        </div>

        {/* TAB 1: PERSONAL INFO & PHOTO */}
        {activeTab === "personal" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left 8 Cols: Form Inputs */}
            <div className="lg:col-span-8 rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-bold text-text">Profile Information</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Full Name</label>
                  <input
                    type="text"
                    value={data.person.name}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: { ...data.person, name: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Role / Title</label>
                  <input
                    type="text"
                    value={data.person.role}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: { ...data.person, role: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Location</label>
                  <input
                    type="text"
                    value={data.person.location}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: { ...data.person, location: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Email</label>
                  <input
                    type="email"
                    value={data.person.email}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: { ...data.person, email: e.target.value },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">GitHub URL</label>
                  <input
                    type="url"
                    value={data.person.social.github}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: {
                          ...data.person,
                          social: { ...data.person.social, github: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">LinkedIn URL</label>
                  <input
                    type="url"
                    value={data.person.social.linkedin}
                    onChange={(e) =>
                      setData({
                        ...data,
                        person: {
                          ...data.person,
                          social: { ...data.person.social, linkedin: e.target.value },
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>
              </div>

              <div className="space-y-1 pt-2">
                <label className="text-xs font-mono text-text-muted">Hero Tagline / Bio</label>
                <textarea
                  rows={3}
                  value={data.person.tagline}
                  onChange={(e) =>
                    setData({
                      ...data,
                      person: { ...data.person, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                />
              </div>
            </div>

            {/* Right 4 Cols: Photo Preview & Upload */}
            <div className="lg:col-span-4 rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-bold text-text">Profile Picture</h2>

              <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden border border-border bg-bg">
                {data.person.photo ? (
                  <Image
                    src={data.person.photo}
                    alt="Abu Huraira Preview"
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-text-muted font-mono">
                    No photo specified
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-mono text-text-muted">Current Photo Path / URL</label>
                <input
                  type="text"
                  value={data.person.photo || ""}
                  onChange={(e) =>
                    setData({
                      ...data,
                      person: { ...data.person, photo: e.target.value },
                    })
                  }
                  placeholder="/profile.jpg or https://..."
                  className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text font-mono"
                />
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <span className="text-xs font-mono text-text-muted block">
                  Upload & Set Live Immediately:
                </span>
                <label className="w-full py-2.5 px-4 rounded-xl border border-dashed border-border bg-bg/50 hover:border-accent text-xs font-mono flex items-center justify-center gap-2 cursor-pointer transition-colors">
                  <Upload className="w-4 h-4 text-accent" />
                  <span>{isUploading ? "Uploading & Saving..." : "Upload New Image from PC"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isUploading}
                  />
                </label>
                <p className="text-[11px] text-text-muted leading-tight">
                  Uploaded image is automatically saved and appears instantly on your homepage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ABOUT & PHILOSOPHY */}
        {activeTab === "about" && (
          <div className="space-y-6">
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-text">About Section Main Bio & Paragraphs</h2>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">First Paragraph (Main Introduction)</label>
                  <textarea
                    rows={4}
                    value={data.about.paragraphs[0]}
                    onChange={(e) =>
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          paragraphs: [e.target.value, data.about.paragraphs[1]],
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Second Paragraph (AI Automation & Systems)</label>
                  <textarea
                    rows={4}
                    value={data.about.paragraphs[1]}
                    onChange={(e) =>
                      setData({
                        ...data,
                        about: {
                          ...data.about,
                          paragraphs: [data.about.paragraphs[0], e.target.value],
                        },
                      })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Focus Cards Editor */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6">
              <h2 className="text-base font-bold text-text">Core Disciplines & Focus Cards</h2>
              <p className="text-xs text-text-muted">
                Customize the 4 primary discipline cards displayed in the About bento grid.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {data.about.focus.map((focusItem, fIdx) => (
                  <div
                    key={fIdx}
                    className="p-4 rounded-xl border border-border/80 bg-bg space-y-3"
                  >
                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-text-muted">
                        Pillar {fIdx + 1} Title
                      </label>
                      <input
                        type="text"
                        value={focusItem.title}
                        onChange={(e) => {
                          const updatedFocus = [...data.about.focus];
                          updatedFocus[fIdx] = {
                            ...updatedFocus[fIdx],
                            title: e.target.value,
                          };
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              focus: updatedFocus,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-sm font-semibold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-mono text-text-muted">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={focusItem.text}
                        onChange={(e) => {
                          const updatedFocus = [...data.about.focus];
                          updatedFocus[fIdx] = {
                            ...updatedFocus[fIdx],
                            text: e.target.value,
                          };
                          setData({
                            ...data,
                            about: {
                              ...data.about,
                              focus: updatedFocus,
                            },
                          });
                        }}
                        className="w-full px-3 py-2 rounded-lg border border-border bg-surface text-text text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROJECTS MANAGER */}
        {activeTab === "projects" && (
          <div className="space-y-8">
            {/* Create New Project Form */}
            <div className="rounded-2xl border border-accent/30 bg-accent/5 p-6 sm:p-8 space-y-5">
              <div className="flex items-center gap-2 text-accent font-bold text-base">
                <Plus className="w-5 h-5" />
                <span>Add a New Project</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Project Title *</label>
                  <input
                    type="text"
                    placeholder="e.g. AI Workflow Platform"
                    value={newProject.title}
                    onChange={(e) => {
                      const title = e.target.value;
                      setNewProject({
                        ...newProject,
                        title,
                        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-sm text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Slug (URL identifier) *</label>
                  <input
                    type="text"
                    placeholder="ai-workflow-platform"
                    value={newProject.slug}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      if (val.startsWith("http://") || val.startsWith("https://")) {
                        // User accidentally pasted full URL in slug - auto move to live demo!
                        setNewProject((prev) => ({
                          ...prev,
                          live: val,
                          slug: prev.title
                            ? prev.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
                            : "new-project",
                        }));
                        return;
                      }
                      setNewProject({ ...newProject, slug: val.toLowerCase().replace(/[^a-z0-9-]/g, "-") });
                    }}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-sm text-text font-mono"
                  />
                  <p className="text-[10px] text-text-muted">Short page name (e.g. my-app).</p>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-mono text-text-muted">Summary (1-2 sentences) *</label>
                  <input
                    type="text"
                    placeholder="Short description of what the project does..."
                    value={newProject.summary}
                    onChange={(e) =>
                      setNewProject({ ...newProject, summary: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-sm text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">The Problem Solved</label>
                  <textarea
                    rows={2}
                    placeholder="What bottleneck did this address?"
                    value={newProject.problem}
                    onChange={(e) =>
                      setNewProject({ ...newProject, problem: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">The Solution Engineered</label>
                  <textarea
                    rows={2}
                    placeholder="How did you solve it?"
                    value={newProject.solution}
                    onChange={(e) =>
                      setNewProject({ ...newProject, solution: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Technologies (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Next.js, TypeScript, Tailwind CSS, Python"
                    value={newProject.tech}
                    onChange={(e) =>
                      setNewProject({ ...newProject, tech: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text"
                  />
                </div>

                {/* Direct Image / Logo Uploader with Preview & Device Upload */}
                <div className="space-y-2 sm:col-span-2 p-4 rounded-xl border border-border/80 bg-surface/50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="text-xs font-mono font-semibold text-text">
                        Project Image or Logo *
                      </label>
                      <p className="text-[11px] text-text-muted">
                        Upload directly from your device, or paste any image/logo URL.
                      </p>
                    </div>

                    <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-accent text-accent-fg text-xs font-semibold cursor-pointer hover:opacity-95 shadow transition-opacity shrink-0">
                      <Upload className="w-4 h-4" />
                      <span>{isUploading ? "Uploading..." : "Upload from Computer"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) handleNewProjectImageUpload(f);
                        }}
                        className="hidden"
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="flex items-center gap-4 pt-1">
                    {newProject.image ? (
                      <div className="relative w-24 h-16 rounded-xl overflow-hidden border border-border bg-bg shrink-0 shadow-sm">
                        <Image
                          src={newProject.image}
                          alt="Project visual preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-16 rounded-xl border border-dashed border-border bg-bg flex items-center justify-center text-[10px] font-mono text-text-muted shrink-0">
                        No Image
                      </div>
                    )}

                    <div className="flex-1 space-y-1">
                      <input
                        type="text"
                        placeholder="Image URL (e.g. /my-logo.png or https://...)"
                        value={newProject.image}
                        onChange={(e) =>
                          setNewProject({ ...newProject, image: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text font-mono"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setNewProject({ ...newProject, image: "/madrasa-logo.png" })}
                          className="text-[10px] font-mono text-accent hover:underline"
                        >
                          Use Madrasa Logo
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">Live Demo URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={newProject.live}
                    onChange={(e) =>
                      setNewProject({ ...newProject, live: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-mono text-text-muted">GitHub Repo URL</label>
                  <input
                    type="url"
                    placeholder="https://github.com/..."
                    value={newProject.repo}
                    onChange={(e) =>
                      setNewProject({ ...newProject, repo: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-border bg-bg text-xs text-text"
                  />
                </div>

                <div className="flex items-center gap-2 pt-4 sm:col-span-2">
                  <input
                    type="checkbox"
                    id="feat-proj"
                    checked={newProject.featured}
                    onChange={(e) =>
                      setNewProject({ ...newProject, featured: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-accent"
                  />
                  <label htmlFor="feat-proj" className="text-xs font-mono text-text">
                    Mark as Flagship Featured Project
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddProject}
                className="px-5 py-2.5 rounded-xl bg-accent text-accent-fg font-semibold text-xs hover:opacity-95 shadow"
              >
                + Add Project to Portfolio
              </button>
            </div>

            {/* Existing Projects List */}
            <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-5">
              <h2 className="text-base font-bold text-text">Existing Projects ({data.projects.length})</h2>

              <div className="space-y-4">
                {data.projects.map((proj, projIdx) => (
                  <div
                    key={proj.slug}
                    className="p-5 rounded-xl border border-border bg-bg space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-20 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-surface">
                          <Image
                            src={proj.image}
                            alt={proj.imageAlt}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-text">{proj.title}</span>
                            {proj.featured && (
                              <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent text-[10px] font-mono font-semibold">
                                Featured
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-text-muted line-clamp-1">{proj.summary}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-surface text-xs font-mono text-text cursor-pointer hover:border-accent hover:text-accent transition-colors shadow-sm">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{isUploading ? "Uploading..." : "Upload Image"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const f = e.target.files?.[0];
                              if (f) handleProjectImageUpload(projIdx, f);
                            }}
                            className="hidden"
                            disabled={isUploading}
                          />
                        </label>

                        <button
                          type="button"
                          onClick={() => handleDeleteProject(proj.slug)}
                          className="p-2 rounded-lg border border-border text-text-muted hover:text-accent hover:border-accent transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Image URL & Quick Actions */}
                    <div className="pt-2 border-t border-border/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1 space-y-1">
                        <label className="text-[11px] font-mono text-text-muted">
                          Image / Logo URL
                        </label>
                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => {
                            const updatedProjects = [...data.projects];
                            updatedProjects[projIdx] = {
                              ...updatedProjects[projIdx],
                              image: e.target.value,
                            };
                            setData({ ...data, projects: updatedProjects });
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-surface text-text text-xs font-mono"
                        />
                      </div>

                      <div className="flex items-end gap-2 pt-3 sm:pt-0">
                        <button
                          type="button"
                          onClick={async () => {
                            const updatedProjects = [...data.projects];
                            updatedProjects[projIdx] = {
                              ...updatedProjects[projIdx],
                              image: "/madrasa-logo.png",
                            };
                            const updatedData = { ...data, projects: updatedProjects };
                            setData(updatedData);
                            await fetch("/api/admin/portfolio", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify(updatedData),
                            });
                            setSaveStatus("success");
                            setStatusMessage("Madrasa Logo applied successfully!");
                            setTimeout(() => setSaveStatus("idle"), 4000);
                          }}
                          className="px-3 py-2 rounded-lg border border-accent/40 bg-accent/10 text-accent text-xs font-mono hover:bg-accent hover:text-accent-fg transition-colors whitespace-nowrap"
                        >
                          Set Madrasa Logo
                        </button>

                        <button
                          type="button"
                          onClick={handleSaveData}
                          className="px-3.5 py-2 rounded-lg bg-accent text-accent-fg text-xs font-semibold hover:opacity-95 transition-opacity whitespace-nowrap"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: CHANGE PASSWORD / SECURITY */}
        {/* TAB 4: INBOX / MESSAGES */}
        {activeTab === "inbox" && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl border border-border bg-surface">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-text">
                    Inquiry Messages ({messages.length})
                  </h2>
                  {messages.filter((m) => !m.read).length > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-accent text-accent-fg font-mono font-bold text-xs">
                      {messages.filter((m) => !m.read).length} New
                    </span>
                  )}
                </div>
                <p className="text-xs text-text-muted">
                  Every message sent through the website contact form is permanently saved here.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={loadMessages}
                  disabled={isLoadingMessages}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-bg text-xs font-mono text-text hover:border-accent hover:text-accent transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingMessages ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3 bg-surface/30">
                <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center mx-auto text-text-muted">
                  <Mail className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-semibold text-text">No messages received yet</h3>
                <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                  When a client or recruiter sends a message through the website, it will immediately appear here and also forward to your email.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`rounded-2xl border p-6 space-y-4 transition-all shadow-sm ${
                      !msg.read
                        ? "border-accent/40 bg-surface shadow-accent/5 ring-1 ring-accent/20"
                        : "border-border bg-surface/60"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text text-base">{msg.name}</span>
                          {!msg.read && (
                            <span className="px-2 py-0.5 rounded-md bg-accent text-accent-fg text-[10px] font-mono font-bold uppercase tracking-wide">
                              Unread
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-text-muted">
                          <a
                            href={`mailto:${msg.email}`}
                            className="font-mono text-accent hover:underline flex items-center gap-1"
                          >
                            <Mail className="w-3 h-3" />
                            <span>{msg.email}</span>
                          </a>
                          <span>•</span>
                          <span className="font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>{new Date(msg.createdAt).toLocaleString()}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`mailto:${msg.email}?subject=Re: Inquiry on Portfolio - ${data.person.name}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent text-accent-fg font-semibold text-xs hover:opacity-95 transition-opacity shadow-sm"
                        >
                          <Send className="w-3 h-3" />
                          <span>Reply via Email</span>
                        </a>

                        <button
                          onClick={() => handleToggleRead(msg.id, msg.read)}
                          className="p-2 rounded-lg border border-border bg-bg text-text-muted hover:text-accent hover:border-accent transition-colors"
                          title={msg.read ? "Mark as unread" : "Mark as read"}
                        >
                          <Check className={`w-3.5 h-3.5 ${msg.read ? "text-success" : ""}`} />
                        </button>

                        <button
                          onClick={() => handleDeleteMessage(msg.id)}
                          className="p-2 rounded-lg border border-border bg-bg text-text-muted hover:text-red-400 hover:border-red-400/40 transition-colors"
                          title="Delete message"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl border border-border/80 bg-bg text-sm text-text font-normal leading-relaxed whitespace-pre-wrap">
                      {msg.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: EMAIL DELIVERY & NOTIFICATIONS */}
        {activeTab === "email" && (
          <div className="max-w-2xl mx-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-7 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <Send className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text">Email Delivery Settings</h2>
                <p className="text-xs text-text-muted">
                  Forward website inquiries straight to your personal Gmail inbox.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveEmailSettings} className="space-y-6">
              {/* Notification Destination Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text font-semibold">
                  Forward Emails To:
                </label>
                <input
                  type="email"
                  value={emailConfig.toEmail}
                  onChange={(e) =>
                    setEmailConfig((prev) => ({ ...prev, toEmail: e.target.value }))
                  }
                  placeholder="your-email@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  required
                />
                <span className="text-[11px] text-text-muted font-mono block">
                  New messages sent on the website will be dispatched to this inbox.
                </span>
              </div>

              {/* Provider Selection */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-text font-semibold">
                  Choose Email Delivery Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setEmailConfig((prev) => ({ ...prev, provider: "resend" }))
                    }
                    className={`p-4 rounded-xl border text-left transition-all ${
                      emailConfig.provider === "resend"
                        ? "border-accent bg-accent/10 text-accent shadow-sm"
                        : "border-border bg-bg text-text-muted hover:border-border/80"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Resend API (Recommended)</span>
                      {emailConfig.hasResendKey && (
                        <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] mt-1 text-text-muted leading-tight">
                      Free 3,000 emails/mo. Easy 1-minute setup, works everywhere.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setEmailConfig((prev) => ({ ...prev, provider: "smtp" }))
                    }
                    className={`p-4 rounded-xl border text-left transition-all ${
                      emailConfig.provider === "smtp"
                        ? "border-accent bg-accent/10 text-accent shadow-sm"
                        : "border-border bg-bg text-text-muted hover:border-border/80"
                    }`}
                  >
                    <div className="font-bold text-xs flex items-center justify-between">
                      <span>Gmail SMTP</span>
                      {emailConfig.hasSmtp && (
                        <span className="text-[10px] text-emerald-400 font-mono">Active</span>
                      )}
                    </div>
                    <p className="text-[11px] mt-1 text-text-muted leading-tight">
                      Send directly via your personal Gmail with an App Password.
                    </p>
                  </button>
                </div>
              </div>

              {/* Resend Fields */}
              {emailConfig.provider === "resend" && (
                <div className="space-y-4 p-5 rounded-2xl border border-border bg-bg/60">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-text font-semibold flex items-center justify-between">
                      <span>Resend API Key</span>
                      {emailConfig.hasResendKey && (
                        <span className="text-[11px] text-emerald-400 font-mono">
                          Saved: {emailConfig.resendKeyMasked}
                        </span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={emailConfig.resendApiKey}
                      onChange={(e) =>
                        setEmailConfig((prev) => ({ ...prev, resendApiKey: e.target.value }))
                      }
                      placeholder={
                        emailConfig.hasResendKey ? "Paste new key to replace..." : "re_123456789..."
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/80 bg-surface/80 text-[11px] text-text-muted space-y-1 leading-relaxed">
                    <div className="font-semibold text-text">How to get a free Resend key in 1 minute:</div>
                    <p>1. Go to <a href="https://resend.com" target="_blank" rel="noreferrer" className="text-accent underline font-semibold">resend.com</a> and sign up for free.</p>
                    <p>2. In your dashboard, click <strong>API Keys</strong> &gt; <strong>Create API Key</strong>.</p>
                    <p>3. Paste the key above and click <strong>Save Email Settings</strong> below.</p>
                  </div>
                </div>
              )}

              {/* SMTP Fields */}
              {emailConfig.provider === "smtp" && (
                <div className="space-y-4 p-5 rounded-2xl border border-border bg-bg/60">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-text font-semibold">
                      Gmail Address
                    </label>
                    <input
                      type="email"
                      value={emailConfig.smtpUser}
                      onChange={(e) =>
                        setEmailConfig((prev) => ({ ...prev, smtpUser: e.target.value }))
                      }
                      placeholder="abuhurairaconnects@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-text font-semibold flex items-center justify-between">
                      <span>16-Character Gmail App Password</span>
                      {emailConfig.hasSmtp && (
                        <span className="text-[11px] text-emerald-400 font-mono">Password saved</span>
                      )}
                    </label>
                    <input
                      type="password"
                      value={emailConfig.smtpPass}
                      onChange={(e) =>
                        setEmailConfig((prev) => ({ ...prev, smtpPass: e.target.value }))
                      }
                      placeholder={
                        emailConfig.hasSmtp ? "Paste new app password to replace..." : "abcd efgh ijkl mnop"
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    />
                  </div>

                  <div className="p-3.5 rounded-xl border border-border/80 bg-surface/80 text-[11px] text-text-muted space-y-1 leading-relaxed">
                    <div className="font-semibold text-text">How to get a Gmail App Password:</div>
                    <p>1. Open your Google Account &gt; <strong>Security</strong>.</p>
                    <p>2. Enable <strong>2-Step Verification</strong> if not already enabled.</p>
                    <p>3. Search for <strong>App Passwords</strong>, name it &quot;Portfolio&quot; and copy the 16 letters.</p>
                  </div>
                </div>
              )}

              {/* Status Banner */}
              {emailStatusMsg.msg && (
                <div
                  className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    emailStatusMsg.type === "success"
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-accent/40 bg-accent/10 text-accent"
                  }`}
                >
                  {emailStatusMsg.type === "success" ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{emailStatusMsg.msg}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSavingEmail}
                  className="w-full sm:flex-1 py-2.5 rounded-xl bg-accent text-accent-fg font-semibold text-xs hover:opacity-95 shadow transition-opacity disabled:opacity-50"
                >
                  {isSavingEmail ? "Saving..." : "Save Email Settings"}
                </button>

                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={isTestingEmail || (!emailConfig.hasResendKey && !emailConfig.hasSmtp && !emailConfig.resendApiKey && !emailConfig.smtpPass)}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-border bg-bg text-text hover:border-accent hover:text-accent font-semibold text-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className={`w-3.5 h-3.5 ${isTestingEmail ? "animate-pulse" : ""}`} />
                  <span>{isTestingEmail ? "Dispatching..." : "Send Test Email"}</span>
                </button>
              </div>

              {testEmailResult.msg && (
                <div
                  className={`p-3.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                    testEmailResult.type === "success"
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-accent/40 bg-accent/10 text-accent"
                  }`}
                >
                  {testEmailResult.type === "success" ? (
                    <CheckCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{testEmailResult.msg}</span>
                </div>
              )}
            </form>
          </div>
        )}

        {/* TAB 6: SECURITY / CHANGE PASSWORD */}
        {activeTab === "security" && (
          <div className="max-w-xl mx-auto rounded-3xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent/10 text-accent flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-text">Change Master Password</h2>
                <p className="text-xs text-text-muted">
                  Update the password required to access this admin panel.
                </p>
              </div>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text">Current Master Password</label>
                <input
                  type="password"
                  placeholder="Enter current password..."
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text">New Password (Min 4 chars)</label>
                <input
                  type="password"
                  placeholder="Enter new password..."
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-text">Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Re-type new password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-bg text-text text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                />
              </div>

              {pwdStatus.type === "error" && (
                <div className="p-3 rounded-xl border border-accent/40 bg-accent/10 text-xs text-accent flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{pwdStatus.msg}</span>
                </div>
              )}

              {pwdStatus.type === "success" && (
                <div className="p-3 rounded-xl border border-success/40 bg-success/10 text-xs text-success flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{pwdStatus.msg}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={pwdStatus.type === "loading"}
                className="w-full py-2.5 rounded-xl bg-accent text-accent-fg font-semibold text-xs hover:opacity-95 shadow transition-opacity disabled:opacity-50"
              >
                {pwdStatus.type === "loading" ? "Updating..." : "Update Master Password"}
              </button>
            </form>

            <div className="p-4 rounded-xl border border-border/80 bg-bg/50 text-[11px] text-text-muted space-y-1 font-mono">
              <p>• Your new password is saved directly to your config securely.</p>
              <p>• Every time you re-enter /admin, you will be prompted for this password.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
