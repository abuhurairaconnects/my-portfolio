import fs from 'fs';
import path from 'path';
import { Project } from '@/types/portfolio';
import { portfolioData } from '@/data/portfolio';

let inMemoryProjects: Project[] | null = null;

function getDataDir(): string {
  if (process.env.DATA_DIR) return process.env.DATA_DIR;
  if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
    return path.join('/tmp', 'portfolio-data');
  }
  const cwd = process.cwd();
  if (cwd.includes('.next/standalone')) {
    return path.join(path.resolve(cwd.split('.next/standalone')[0]), 'data');
  }
  return path.join(cwd, 'data');
}

function getProjectsFilePath(): string {
  return path.join(getDataDir(), 'projects.json');
}

function ensureDataDirectory(): void {
  const dir = getDataDir();
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  } catch (err) {
    console.error('[ProjectsStore] Could not create data directory:', err);
  }
}

export async function getAdminProjects(): Promise<Project[]> {
  if (inMemoryProjects && inMemoryProjects.length > 0) {
    return inMemoryProjects;
  }

  const filePath = getProjectsFilePath();

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed) && parsed.length > 0) {
        inMemoryProjects = parsed;
        return inMemoryProjects;
      }
    }
  } catch (err) {
    console.error('[ProjectsStore] Error reading projects.json, falling back to portfolioData:', err);
  }

  inMemoryProjects = [...portfolioData.projects];
  return inMemoryProjects;
}

export async function saveAdminProject(project: Project): Promise<{ success: boolean; project: Project }> {
  const projects = await getAdminProjects();
  const existingIndex = projects.findIndex((p) => p.id === project.id || p.slug === project.slug);

  if (existingIndex >= 0) {
    projects[existingIndex] = {
      ...projects[existingIndex],
      ...project,
    };
  } else {
    // Generate an ID if empty
    if (!project.id) {
      project.id = project.slug || `proj-${Date.now()}`;
    }
    projects.push(project);
  }

  inMemoryProjects = [...projects];

  try {
    ensureDataDirectory();
    fs.writeFileSync(getProjectsFilePath(), JSON.stringify(inMemoryProjects, null, 2), 'utf-8');
  } catch (err) {
    console.error('[ProjectsStore] Error saving projects.json to disk:', err);
  }

  return { success: true, project };
}

export async function deleteAdminProject(id: string): Promise<boolean> {
  const projects = await getAdminProjects();
  const updated = projects.filter((p) => p.id !== id);

  if (updated.length === projects.length) {
    return false;
  }

  inMemoryProjects = updated;

  try {
    ensureDataDirectory();
    fs.writeFileSync(getProjectsFilePath(), JSON.stringify(inMemoryProjects, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('[ProjectsStore] Error deleting project from disk:', err);
    return false;
  }
}

export async function toggleAdminProjectFeatured(id: string): Promise<{ success: boolean; featured?: boolean }> {
  const projects = await getAdminProjects();
  const target = projects.find((p) => p.id === id);

  if (!target) {
    return { success: false };
  }

  target.featured = !target.featured;
  inMemoryProjects = [...projects];

  try {
    ensureDataDirectory();
    fs.writeFileSync(getProjectsFilePath(), JSON.stringify(inMemoryProjects, null, 2), 'utf-8');
    return { success: true, featured: target.featured };
  } catch (err) {
    console.error('[ProjectsStore] Error toggling featured in projects.json:', err);
    return { success: false };
  }
}
