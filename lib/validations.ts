import { z } from "zod";

// Contact form schema with strict input validation, length limits, and honeypot
export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must not exceed 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .max(150, "Email must not exceed 150 characters"),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(2000, "Message must not exceed 2000 characters"),
  // Honeypot field - must remain empty
  website_hp: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  // Timestamp to protect against instant programmatic submissions (min 2 seconds)
  formLoadTimestamp: z.number().optional(),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

// Strict Data Model Schema for portfolio.ts
export const portfolioSchema = z.object({
  person: z.object({
    name: z.string().min(1, "Name is required"),
    monogram: z.string().min(1, "Monogram is required"),
    role: z.string().trim().min(1, "Role is required"),
    tagline: z.string().min(1, "Tagline is required"),
    location: z.string().min(1, "Location is required"),
    timezone: z.string().min(1, "Timezone is required"),
    email: z.string().email("Valid email is required"),
    social: z.object({
      github: z.string().url("Valid GitHub URL is required"),
      linkedin: z.string().url("Valid LinkedIn URL is required"),
    }),
    photo: z.string().optional(),
  }),
  availability: z.object({
    enabled: z.boolean(),
    label: z.string(),
  }),
  resumeUrl: z.string().min(1),
  scheduling: z.object({
    enabled: z.boolean(),
    url: z.string(),
    label: z.string(),
  }),
  stats: z.array(
    z.object({
      label: z.string(),
      value: z.string(),
      verified: z.boolean(),
    })
  ),
  about: z.object({
    paragraphs: z.tuple([z.string().min(1), z.string().min(1)]),
    focus: z.array(
      z.object({
        title: z.string().min(1),
        text: z.string().min(1),
      })
    ),
  }),
  stack: z.array(
    z.object({
      category: z.enum([
        "Frontend",
        "Backend",
        "Database & Data",
        "DevOps & Tools",
      ]),
      tools: z.array(
        z.object({
          name: z.string().min(1),
          icon: z.string().min(1),
        })
      ),
    })
  ),
  projects: z.array(
    z.object({
      slug: z.string().min(1),
      title: z.string().min(1),
      summary: z.string().min(1),
      featured: z.boolean(),
      problem: z.string().min(1),
      solution: z.string().min(1),
      impact: z
        .array(
          z.object({
            metric: z.string(),
            detail: z.string(),
          })
        )
        .optional(),
      tech: z.array(z.string().min(1)),
      links: z.object({
        live: z.string().url().optional().or(z.literal("")),
        repo: z.string().url().optional().or(z.literal("")),
      }),
      image: z.string().min(1),
      imageAlt: z.string().min(1),
      caseStudy: z
        .object({
          architecture: z
            .object({
              diagram: z.string(),
              alt: z.string(),
              notes: z.string(),
            })
            .optional(),
          decisions: z.array(z.string()).optional(),
          challenges: z
            .array(
              z.object({
                challenge: z.string(),
                solution: z.string(),
              })
            )
            .optional(),
          performance: z.array(z.string()).optional(),
          security: z.array(z.string()).optional(),
        })
        .optional(),
    })
  ),
  experience: z.array(
    z.object({
      role: z.string().min(1),
      org: z.string().min(1),
      type: z.enum(["full-time", "freelance", "open-source", "milestone"]),
      start: z.string().min(1),
      end: z.string().optional(),
      summary: z.string().min(1),
    })
  ),
  openSource: z.object({
    enabled: z.boolean(),
    repos: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          description: z.string(),
        })
      )
      .optional(),
  }),
  seo: z.object({
    siteUrl: z.string().url(),
    title: z.string().min(1),
    description: z.string().min(1),
    ogImage: z.string().min(1),
  }),
});

export type PortfolioData = z.infer<typeof portfolioSchema>;
