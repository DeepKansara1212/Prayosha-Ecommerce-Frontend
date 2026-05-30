import { apiClient } from './client'
import type { BlogPost, BlogSection } from '@/types'

// ─── Raw shape returned by the API (MongoDB _id) ─────────────────────────────

interface ApiBlog {
  _id: string
  slug: string
  title: string
  subtitle?: string
  excerpt: string
  category: BlogPost['category']
  readTime: string
  date: string
  emoji: string
  gradient: string
  featured: boolean
  isPublished: boolean
  content: BlogSection[]
}

function mapBlog(raw: ApiBlog): BlogPost {
  return {
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    excerpt: raw.excerpt,
    category: raw.category,
    readTime: raw.readTime,
    date: raw.date,
    emoji: raw.emoji,
    gradient: raw.gradient,
    featured: raw.featured,
    content: raw.content,
  }
}

// ─── Public endpoints ─────────────────────────────────────────────────────────

export async function fetchBlogs(): Promise<BlogPost[]> {
  const res = await apiClient.get<{ data: { blogs: ApiBlog[] } }>('/blogs')
  return res.data.data.blogs.map(mapBlog)
}

export async function fetchBlogBySlug(slug: string): Promise<BlogPost> {
  const res = await apiClient.get<{ data: { blog: ApiBlog } }>(`/blogs/${slug}`)
  return mapBlog(res.data.data.blog)
}
