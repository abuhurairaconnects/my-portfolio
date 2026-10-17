import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://abuhuraira.dev';
  const lastModified = new Date();

  return [
    { url: `${baseUrl}`, lastModified, changeFrequency: 'monthly', priority: 1.0 },
    { url: `${baseUrl}/projects`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/services`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/hire`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
  ];
}
