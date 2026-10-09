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
  images?: string[]
  readTime?: string
  date?: string
  emoji?: string
  gradient?: string
  featured: boolean
  isPublished: boolean
  content: BlogSection[]
  createdAt?: string
}

const CATEGORY_STYLE: Record<BlogPost['category'], { emoji: string; gradient: string }> = {
  'Crystal Guides': { emoji: '💎', gradient: 'linear-gradient(135deg, #44335f 0%, #7b5ea7 55%, #c4a8e8 100%)' },
  Rituals: { emoji: '🌙', gradient: 'linear-gradient(135deg, #252447 0%, #554778 55%, #a891c8 100%)' },
  Wellness: { emoji: '🌿', gradient: 'linear-gradient(135deg, #28483b 0%, #5a8a6a 55%, #a5c49d 100%)' },
  'Gemstone Spotlight': { emoji: '✨', gradient: 'linear-gradient(135deg, #553c2f 0%, #b8956a 55%, #e0c890 100%)' },
  'Spiritual Practice': { emoji: '✦', gradient: 'linear-gradient(135deg, #1b2c50 0%, #334b82 55%, #8293c2 100%)' },
}

function mapBlog(raw: ApiBlog): BlogPost {
  const style = CATEGORY_STYLE[raw.category]
  const date = raw.date ?? raw.createdAt
  const wordCount = `${raw.excerpt} ${raw.content.map(section => section.text ?? section.description ?? '').join(' ')}`
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .length

  return {
    id: raw._id,
    slug: raw.slug,
    title: raw.title,
    subtitle: raw.subtitle,
    excerpt: raw.excerpt,
    category: raw.category,
    images: raw.images ?? [],
    readTime: raw.readTime ?? `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
    date: date ? new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '',
    emoji: raw.emoji ?? style.emoji,
    gradient: raw.gradient ?? style.gradient,
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
