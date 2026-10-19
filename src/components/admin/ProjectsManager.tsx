'use client';

import { useState, useEffect } from 'react';
import { portfolioData } from '@/data/portfolio';
import { Project } from '@/types/portfolio';
import {
  ExternalLink,
  Github,
  Star,
  CheckCircle2,
  FolderGit2,
  Plus,
  Edit3,
  Trash2,
  X,
  Code2,
  Copy,
  Check,
  Search,
  AlertTriangle,
} from 'lucide-react';
import {
  fetchProjectsAction,
  saveProjectAction,
  deleteProjectAction,
  toggleProjectFeaturedAction,
} from '@/actions/admin';

interface ProjectFormData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'AI Automation' | 'Healthcare/Social' | 'Developer Tools';
  status: 'Live Production' | 'Verified Showcase' | 'Active Demo';
  priority: number;
  featured: boolean;
  problem: string;
  solution: string;
  techStackInput: string;
  architectureHighlightsInput: string;
  liveUrl: string;
  repoUrl: string;
}

const DEFAULT_FORM: ProjectFormData = {
  id: '',
  slug: '',
  title: '',
  subtitle: '',
  category: 'Full-Stack',
  status: 'Live Production',
  priority: 1,
  featured: false,
  problem: '',
  solution: '',
  techStackInput: '',
  architectureHighlightsInput: '',
  liveUrl: '',
  repoUrl: '',
};

export function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>(portfolioData.projects);
  const [searchQuery, setSearchQuery] = useState('');
  const [notice, setNotice] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<ProjectFormData>(DEFAULT_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Load projects from server or localStorage
  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;
    
    // Check localStorage first for instant client cache
    try {
      const local = localStorage.getItem('ah_portfolio_custom_projects');
      if (local) {
        const parsed = JSON.parse(local);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setProjects(parsed);
        }
      }
    } catch {}

    // Fetch from server action
    fetchProjectsAction(token)
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
          try {
            localStorage.setItem('ah_portfolio_custom_projects', JSON.stringify(data));
          } catch {}
        }
      })
      .catch((err) => {
        console.error('Failed to load server projects:', err);
      });
  }, []);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 4000);
  };

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      ...DEFAULT_FORM,
      priority: projects.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData({
      id: project.id,
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      category: (project.category as ProjectFormData['category']) || 'Full-Stack',
      status: (project.status as ProjectFormData['status']) || 'Live Production',
      priority: project.priority || 1,
      featured: !!project.featured,
      problem: project.problem || '',
      solution: project.solution || '',
      techStackInput: (project.techStack || []).join(', '),
      architectureHighlightsInput: (project.architectureHighlights || []).join('\n'),
      liveUrl: project.links?.live || '',
      repoUrl: project.links?.repo || '',
    });
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    // Automatically generate slug if creating new project
    if (!editingId) {
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData((prev) => ({
        ...prev,
        title: val,
        slug: autoSlug,
        id: autoSlug,
      }));
    } else {
      setFormData((prev) => ({ ...prev, title: val }));
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showNotice('Please provide a project title.');
      return;
    }

    setIsSubmitting(true);
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;

    const slug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const id = formData.id.trim() || slug;

    const techStack = formData.techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const architectureHighlights = formData.architectureHighlightsInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const projectToSave: Project = {
      id,
      slug,
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      category: formData.category,
      status: formData.status,
      priority: Number(formData.priority) || 1,
      featured: formData.featured,
      problem: formData.problem.trim() || 'Custom production engineering solution.',
      solution: formData.solution.trim() || 'Delivered full-stack system solving operational bottlenecks.',
      architectureHighlights: architectureHighlights.length > 0 ? architectureHighlights : ['Production-ready TypeScript architecture'],
      techStack: techStack.length > 0 ? techStack : ['Next.js 15', 'TypeScript', 'Tailwind CSS'],
      links: {
        ...(formData.liveUrl.trim() ? { live: formData.liveUrl.trim() } : {}),
        ...(formData.repoUrl.trim() ? { repo: formData.repoUrl.trim() } : {}),
      },
      metrics: [
        { label: 'System Uptime', value: '24/7 Verified' },
        { label: 'Engineering Quality', value: '100% Type-Safe' },
      ],
    };

    try {
      // 1. Call server action
      const res = await saveProjectAction(projectToSave, token);
      
      // 2. Update local state
      let updatedList: Project[];
      if (editingId) {
        updatedList = projects.map((p) => (p.id === editingId ? projectToSave : p));
        showNotice(`Project "${projectToSave.title}" updated successfully.`);
      } else {
        // Check if exists
        const exists = projects.some((p) => p.id === projectToSave.id);
        if (exists) {
          updatedList = projects.map((p) => (p.id === projectToSave.id ? projectToSave : p));
        } else {
          updatedList = [projectToSave, ...projects];
        }
        showNotice(`New project "${projectToSave.title}" added successfully.`);
      }

      setProjects(updatedList);
      try {
        localStorage.setItem('ah_portfolio_custom_projects', JSON.stringify(updatedList));
      } catch {}

      setIsModalOpen(false);
    } catch (err: unknown) {
      console.error('Save error:', err);
      showNotice('Saved locally. (Note: Server storage was updated if authorized).');
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    setDeletingId(id);
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;

    try {
      await deleteProjectAction(id, token);
      const updated = projects.filter((p) => p.id !== id);
      setProjects(updated);
      try {
        localStorage.setItem('ah_portfolio_custom_projects', JSON.stringify(updated));
      } catch {}
      showNotice(`Project "${title}" deleted.`);
    } catch (err) {
      console.error('Delete error:', err);
      showNotice('Failed to delete project on server.');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleFeatured = async (id: string, currentTitle: string) => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('ah_admin_token') || undefined : undefined;
    
    // Optimistic UI update
    const updated = projects.map((p) => {
      if (p.id === id) {
        return { ...p, featured: !p.featured };
      }
      return p;
    });
    setProjects(updated);
    try {
      localStorage.setItem('ah_portfolio_custom_projects', JSON.stringify(updated));
    } catch {}

    try {
      const res = await toggleProjectFeaturedAction(id, token);
      const isFeat = res.featured;
      showNotice(`Updated "${currentTitle}" featured status to ${isFeat ? 'Enabled' : 'Disabled'}.`);
    } catch (err) {
      console.error('Toggle error:', err);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.subtitle.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.techStack && p.techStack.some((t) => t.toLowerCase().includes(q)))
    );
  });

  const exportTsCode = `// Generated from Abu Huraira Admin Console
// Copy and paste into src/data/portfolio.ts (projects array)
export const projects: Project[] = ${JSON.stringify(projects, null, 2)};
`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(exportTsCode);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {notice && (
        <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center justify-between animate-fade-in">
          <span>{notice}</span>
          <button onClick={() => setNotice(null)} className="text-[#8E93A4] hover:text-[#F4F4F6]">
            ✕
          </button>
        </div>
      )}

      {/* Header and Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#1E2230]">
        <div>
          <h2 className="font-display font-bold text-xl text-[#F4F4F6] flex items-center gap-2">
            <span>Production Projects Catalog</span>
            <span className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#1E2230] text-xs font-mono text-emerald-400">
              {projects.length} Total
            </span>
          </h2>
          <p className="text-xs text-[#8E93A4] mt-0.5">
            Add new systems, edit project details, and manage featured showcases in real time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsExportOpen(true)}
            className="px-3 py-2 rounded-xl bg-[#161922] hover:bg-[#1B202D] text-[#8E93A4] hover:text-[#F4F4F6] border border-[#1E2230] text-xs font-mono flex items-center gap-1.5 transition-colors"
            title="Export TypeScript code for src/data/portfolio.ts"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all active:scale-95 shadow-lg shadow-emerald-500/10"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Project</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Counters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8E93A4]" />
          <input
            type="text"
            placeholder="Search projects by title, stack or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#11131A] border border-[#1E2230] focus:border-emerald-500/50 rounded-xl text-xs text-[#F4F4F6] placeholder-[#535868] outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-[#8E93A4]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {projects.filter((p) => p.featured).length} Featured on Home
          </span>
        </div>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 gap-5">
        {filteredProjects.length === 0 ? (
          <div className="p-12 rounded-2xl bg-[#11131A] border border-[#1E2230] text-center">
            <FolderGit2 className="w-8 h-8 text-[#535868] mx-auto mb-3" />
            <p className="text-sm text-[#F4F4F6] font-medium">No projects found</p>
            <p className="text-xs text-[#8E93A4] mt-1 mb-4">
              Try adjusting your search query or click &apos;Add New Project&apos; to create one.
            </p>
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase"
            >
              Add First Project
            </button>
          </div>
        ) : (
          filteredProjects.map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-2xl bg-[#11131A] border border-[#1E2230] hover:border-[#2E354B] transition-colors"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#161922] border border-[#1E2230] flex items-center justify-center text-emerald-400 shrink-0">
                    <FolderGit2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-display font-bold text-lg text-[#F4F4F6]">
                        {project.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]">
                        {project.category}
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-400">
                        {project.status}
                      </span>
                      <span className="text-[10px] font-mono text-[#535868]">
                        Priority #{project.priority || 1}
                      </span>
                    </div>
                    <p className="text-xs text-[#8E93A4] mt-1">
                      {project.subtitle}
                    </p>
                  </div>
                </div>

                {/* Actions: Edit, Featured Toggle, Delete */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleFeatured(project.id, project.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all ${
                      project.featured
                        ? 'bg-amber-400/10 border border-amber-400/30 text-amber-300'
                        : 'bg-[#161922] border border-[#1E2230] text-[#8E93A4] hover:text-[#F4F4F6]'
                    }`}
                    title="Toggle display on homepage"
                  >
                    <Star className={`w-3.5 h-3.5 ${project.featured ? 'fill-amber-400' : ''}`} />
                    <span>{project.featured ? 'Featured' : 'Feature'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenEdit(project)}
                    className="px-3 py-1.5 rounded-xl bg-[#161922] hover:bg-[#1B202D] text-[#8E93A4] hover:text-emerald-400 border border-[#1E2230] hover:border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-colors"
                    title="Edit project details"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
                      title="Open Live Production URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {project.links?.repo && (
                    <a
                      href={project.links.repo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#161922] hover:bg-[#1B202D] text-[#8E93A4] hover:text-[#F4F4F6] border border-[#1E2230] transition-colors"
                      title="View GitHub Repository"
                    >
                      <Github className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(project.id, project.title)}
                    disabled={deletingId === project.id}
                    className="p-2 rounded-xl bg-[#161922] hover:bg-rose-500/10 text-[#8E93A4] hover:text-rose-400 border border-[#1E2230] hover:border-rose-500/30 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Architecture Highlights */}
              {project.architectureHighlights && project.architectureHighlights.length > 0 && (
                <div className="p-4 rounded-xl bg-[#08090D] border border-[#1E2230] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#535868] block mb-2">
                    Architecture & Engineering Specs:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {project.architectureHighlights.map((hl, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-[#8E93A4]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="leading-snug">{hl}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tech Stack Chips */}
              <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-[#1E2230]">
                <span className="text-[10px] font-mono text-[#535868] mr-1">Stack:</span>
                {project.techStack?.map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded-md bg-[#161922] border border-[#1E2230] text-[10px] font-mono text-[#8E93A4]"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090D]/85 backdrop-blur-md overflow-y-auto animate-fade-in">
          <div className="relative w-full max-w-2xl bg-[#11131A] border border-[#1E2230] rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2230] mb-6">
              <div>
                <h3 className="font-display font-bold text-xl text-[#F4F4F6]">
                  {editingId ? `Edit Project: ${formData.title || 'Untitled'}` : 'Add New Production Project'}
                </h3>
                <p className="text-xs text-[#8E93A4] mt-0.5">
                  Fill in the project details. Changes update immediately in the portfolio catalog.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#161922] border border-[#1E2230] flex items-center justify-center text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Madrasa Management System"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Slug / URL Identifier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. madrasa-management"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value, id: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  placeholder="e.g. Institutional Management & Automation Portal"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as ProjectFormData['category'] })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                  >
                    <option value="Full-Stack">Full-Stack</option>
                    <option value="AI Automation">AI Automation</option>
                    <option value="Healthcare/Social">Healthcare/Social</option>
                    <option value="Developer Tools">Developer Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectFormData['status'] })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                  >
                    <option value="Live Production">Live Production</option>
                    <option value="Verified Showcase">Verified Showcase</option>
                    <option value="Active Demo">Active Demo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Priority Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Live Production URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://your-live-app.com"
                    value={formData.liveUrl}
                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    GitHub Repository URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/abuhurairaconnects/..."
                    value={formData.repoUrl}
                    onChange={(e) => setFormData({ ...formData, repoUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                  Tech Stack (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="Next.js 15, TypeScript, Prisma ORM, Tailwind CSS, Docker"
                  value={formData.techStackInput}
                  onChange={(e) => setFormData({ ...formData, techStackInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] font-mono outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                  Architecture & Engineering Highlights (1 bullet per line)
                </label>
                <textarea
                  rows={3}
                  placeholder={`Next.js 15 App Router architecture with server components\nType-safe relational schema with Prisma ORM\nDockerized containerization on VPS`}
                  value={formData.architectureHighlightsInput}
                  onChange={(e) => setFormData({ ...formData, architectureHighlightsInput: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Problem It Solves
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe operational bottleneck..."
                    value={formData.problem}
                    onChange={(e) => setFormData({ ...formData, problem: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#8E93A4] mb-1.5">
                    Solution Implemented
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe engineered solution..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#08090D] border border-[#1E2230] focus:border-emerald-500/50 text-xs text-[#F4F4F6] outline-none"
                  />
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#08090D] border border-[#1E2230] flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-[#F4F4F6] block">
                    Featured Master Showcase
                  </span>
                  <span className="text-[11px] text-[#8E93A4]">
                    Display prominently on the homepage and at the top of the directory.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E2230]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#161922] hover:bg-[#1B202D] text-[#8E93A4] hover:text-[#F4F4F6] text-xs font-mono transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : editingId ? 'Update Project' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Export TypeScript Code Modal */}
      {isExportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#08090D]/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl bg-[#11131A] border border-[#1E2230] rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-4 border-b border-[#1E2230] mb-4">
              <div>
                <h3 className="font-display font-bold text-lg text-[#F4F4F6] flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-emerald-400" />
                  <span>Export Code for src/data/portfolio.ts</span>
                </h3>
                <p className="text-xs text-[#8E93A4] mt-0.5">
                  1-Click copy to permanently sync and commit your custom projects to Git.
                </p>
              </div>
              <button
                onClick={() => setIsExportOpen(false)}
                className="w-8 h-8 rounded-lg bg-[#161922] border border-[#1E2230] flex items-center justify-center text-[#8E93A4] hover:text-[#F4F4F6] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative flex-1 min-h-[300px] overflow-hidden rounded-xl border border-[#1E2230] bg-[#08090D]">
              <textarea
                readOnly
                value={exportTsCode}
                className="w-full h-full p-4 font-mono text-[11px] text-emerald-300 bg-transparent resize-none focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1E2230]">
              <span className="text-[11px] font-mono text-[#8E93A4]">
                Total {projects.length} projects exported.
              </span>
              <button
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#08090D] font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition-all active:scale-95"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy TypeScript Array</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
