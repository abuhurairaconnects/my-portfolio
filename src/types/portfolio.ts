export type RoleCategory = 
  | 'Full-Stack Web Developer'
  | 'Software Developer'
  | 'Application Developer'
  | 'AI Automation'
  | 'AI Business Automation'
  | 'AI Business Automation Consultant';

export interface ProjectLink {
  live?: string;
  repo?: string;
  demo?: string;
  caseStudy?: string;
}

export interface ProjectMetric {
  label: string;
  value: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  category: 'Full-Stack' | 'AI Automation' | 'Healthcare/Social' | 'Developer Tools';
  featured: boolean;
  priority: number;
  problem: string;
  solution: string;
  architectureHighlights: string[];
  techStack: string[];
  links: ProjectLink;
  metrics: ProjectMetric[];
  businessImpact?: string[];
  status: 'Live Production' | 'Verified Showcase' | 'Active Demo';
  badge?: string;
}

export interface SkillItem {
  name: string;
  level?: string;
  focus?: string;
  icon?: string;
}

export interface SkillCategory {
  title: string;
  subtitle: string;
  icon: string;
  skills: SkillItem[];
}

export interface EducationItem {
  institution: string;
  title: string;
  period: string;
  description: string;
  highlights: string[];
  badge?: string;
}

export interface ServiceOffering {
  id: string;
  title: string;
  roleBadge: RoleCategory;
  shortDesc: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  icon: string;
  timeline: string;
  idealFor?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  organization: string;
  projectAssociated: string;
  verified?: boolean;
}

export interface ClientFAQ {
  question: string;
  answer: string;
  category: string;
}

export interface SocialLinks {
  github: string;
  linkedin: string;
  email: string;
  telegram?: string;
  whatsapp?: string;
  phone?: string;
}

export interface PortfolioData {
  person: {
    name: string;
    monogram: string;
    headlineRoles: RoleCategory[];
    tagline: string;
    summary: string;
    heroHook: string;
    location: string;
    timezone: string;
    status: {
      available: boolean;
      text: string;
    };
    social: SocialLinks;
    photoUrl: string;
    founderRole?: string;
    instituteName?: string;
    instituteCredential?: string;
    trustHighlights?: string[];
    resumeUrl?: string;
  };
  metrics: {
    label: string;
    value: string;
    detail: string;
  }[];
  services: ServiceOffering[];
  projects: Project[];
  skills: SkillCategory[];
  educationAndEthics: EducationItem[];
  faqs: ClientFAQ[];
  testimonials: Testimonial[];
}
