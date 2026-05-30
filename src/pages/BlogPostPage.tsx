import { useState, useEffect, type FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { fetchBlogs, fetchBlogBySlug } from '@/api/blog.api'
import type { BlogPost, BlogSection } from '@/types'

// ─── Article content renderer ─────────────────────────────────────────────────

const renderSection = (section: BlogSection, index: number) => {
  if (section.type === 'paragraph') {
    return (
      <p key={index} className="font-body font-extralight text-[0.88rem] leading-[2] text-bark">
        {section.text}
      </p>
    )
  }
  if (section.type === 'heading') {
    return (
      <h2 key={index} className="font-display font-light text-[1.6rem] text-deep mt-10 mb-1">
        {section.text}
      </h2>
    )
  }
  if (section.type === 'subheading') {
    return (
      <h3
        key={index}
        className="font-body text-[0.72rem] uppercase tracking-[0.2em] mt-7 mb-1"
        style={{ color: '#C49A3C' }}
      >
        {section.text}
      </h3>
    )
  }
  if (section.type === 'quote') {
    return (
      <blockquote key={index} className="my-8 pl-6" style={{ borderLeft: '2px solid #7B5EA7' }}>
        <p className="font-display font-light text-[1.18rem] leading-[1.75] italic" style={{ color: '#7B5EA7' }}>
          {section.text}
        </p>
      </blockquote>
    )
  }
  if (section.type === 'list' && section.items) {
    return (
      <ul key={index} className="space-y-2 pl-1">
        {section.items.map((item, j) => (
          <li key={j} className="flex items-start gap-3">
            <span className="flex-none mt-[0.35rem] text-[0.65rem]" style={{ color: '#C49A3C' }}>✦</span>
            <span className="font-body font-extralight text-[0.85rem] leading-[1.9] text-bark">{item}</span>
          </li>
        ))}
      </ul>
    )
  }
  return null
}

// ─── BlogPostPage ─────────────────────────────────────────────────────────────

interface BlogPostPageProps {
  slug: string
  onNavigateToJournal: () => void
  onNavigateToPost: (slug: string) => void
}

const BlogPostPage: FC<BlogPostPageProps> = ({ slug, onNavigateToJournal, onNavigateToPost }) => {
  const contentRef = useScrollReveal<HTMLDivElement>()
  const relatedRef = useScrollReveal<HTMLDivElement>()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    setNotFound(false)

    fetchBlogBySlug(slug)
      .then(async found => {
        setPost(found)
        const all = await fetchBlogs()
        const related = all
          .filter(p => p.id !== found.id)
          .sort((a, b) => {
            if (a.category === found.category && b.category !== found.category) return -1
            if (b.category === found.category && a.category !== found.category) return 1
            return 0
          })
          .slice(0, 3)
        setRelatedPosts(related)
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="bg-cream" style={{ paddingTop: '120px', minHeight: '60vh' }}>
          <div className="text-center" style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <p className="font-body font-extralight text-[0.88rem] text-muted">Loading…</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (notFound || !post) {
    return (
      <>
        <Navbar />
        <main className="bg-cream" style={{ paddingTop: '120px', minHeight: '60vh' }}>
          <div className="text-center" style={{ padding: 'clamp(4rem,8vw,7rem) clamp(1.25rem,5vw,4rem)' }}>
            <p className="font-display font-light text-[2rem] text-deep mb-4">Article not found</p>
            <button
              onClick={onNavigateToJournal}
              className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:text-deep bg-transparent border-none cursor-pointer transition-colors"
            >
              ← Back to Journal
            </button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-cream">

        {/* ── Article hero ── */}
        <div
          className="relative overflow-hidden"
          style={{
            minHeight: 'clamp(380px, 55vh, 580px)',
            paddingTop: '96px',
            background: post.gradient,
          }}
        >
          <div
            className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: '#7C5C8A', opacity: 0.15, filter: 'blur(90px)' }}
            aria-hidden="true"
          />

          <div
            className="absolute right-0 bottom-0 pointer-events-none select-none leading-none"
            style={{ fontSize: 'clamp(10rem,22vw,20rem)', opacity: 0.06, paddingRight: 'clamp(1rem,4vw,3rem)', paddingBottom: '1rem' }}
            aria-hidden="true"
          >
            {post.emoji}
          </div>

          <div
            className="relative z-10"
            style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,4rem) 0' }}
          >
            <button
              onClick={onNavigateToJournal}
              className="font-body text-[0.62rem] uppercase tracking-[0.15em] hover:text-gold-light transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
              style={{ color: 'rgba(245,240,232,0.5)' }}
            >
              <span>←</span> Back to Journal
            </button>
          </div>

          <div
            className="relative z-10"
            style={{ padding: 'clamp(1.5rem,3vw,2.5rem) clamp(1.25rem,5vw,4rem) clamp(3rem,6vw,5rem)' }}
          >
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span
                className="font-body text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1 border"
                style={{ borderColor: 'rgba(123,94,167,0.6)', color: '#A584C8' }}
              >
                {post.category}
              </span>
              <span className="font-body text-[0.62rem]" style={{ color: 'rgba(245,240,232,0.45)' }}>
                {post.date}
              </span>
              <span
                className="w-1 h-1 rounded-full"
                style={{ background: 'rgba(245,240,232,0.25)' }}
                aria-hidden="true"
              />
              <span className="font-body text-[0.62rem]" style={{ color: 'rgba(245,240,232,0.45)' }}>
                {post.readTime}
              </span>
            </div>

            <h1
              className="font-display font-light text-cream leading-[1.1] max-w-3xl mb-5"
              style={{ fontSize: 'clamp(2rem,5vw,3.8rem)' }}
            >
              {post.title}
            </h1>

            {post.subtitle && (
              <p
                className="font-body font-extralight leading-[1.9] max-w-xl"
                style={{ fontSize: 'clamp(0.85rem,2vw,0.95rem)', color: 'rgba(245,240,232,0.6)' }}
              >
                {post.subtitle}
              </p>
            )}
          </div>
        </div>

        {/* ── Article body ── */}
        <div ref={contentRef} className="reveal">
          <div
            className="max-w-2xl mx-auto"
            style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,2rem)' }}
          >
            <p
              className="font-display font-light leading-[1.7] text-deep mb-8 pb-8"
              style={{
                fontSize: 'clamp(1.05rem,2.5vw,1.3rem)',
                borderBottom: '1px solid rgba(196,184,154,0.4)',
              }}
            >
              {post.excerpt}
            </p>

            <div className="space-y-5">
              {post.content.map((section, i) => renderSection(section, i))}
            </div>

            <div
              className="mt-12 pt-8 flex items-center gap-4"
              style={{ borderTop: '1px solid rgba(196,184,154,0.4)' }}
            >
              <div className="w-12 h-12 rounded-full bg-warm flex items-center justify-center text-xl flex-none">
                🌙
              </div>
              <div>
                <p className="font-body text-[0.72rem] font-medium text-deep">Luminae Journal</p>
                <p className="font-body font-extralight text-[0.68rem] text-muted">Crystal wisdom &amp; sacred rituals</p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onNavigateToJournal}
                className="font-body text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:text-deep transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
              >
                ← Back to Journal
              </button>
            </div>
          </div>
        </div>

        {/* ── Related posts ── */}
        {relatedPosts.length > 0 && (
          <div
            ref={relatedRef}
            className="reveal bg-warm"
            style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,4rem)' }}
          >
            <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-2">Continue Reading</p>
            <h2 className="font-display font-light text-deep mb-8" style={{ fontSize: 'clamp(1.8rem,4vw,2.5rem)' }}>
              More from the <em className="italic text-amethyst">Journal</em>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {relatedPosts.map(related => (
                <article
                  key={related.id}
                  className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    background: '#F5F0E8',
                    border: '1px solid rgba(196,184,154,0.4)',
                    boxShadow: '0 2px 10px rgba(28,20,16,0.07)',
                  }}
                  onClick={() => { onNavigateToPost(related.slug); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = '0 12px 36px rgba(28,20,16,0.16)'
                    el.style.borderColor = 'rgba(123,94,167,0.4)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.boxShadow = '0 2px 10px rgba(28,20,16,0.07)'
                    el.style.borderColor = 'rgba(196,184,154,0.4)'
                  }}
                >
                  <div
                    className="w-full relative overflow-hidden flex items-center justify-center"
                    style={{ aspectRatio: '16/9', background: related.gradient }}
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                        opacity: 0.3,
                      }}
                    />
                    <span className="select-none relative z-10" style={{ fontSize: 'clamp(2.2rem,4vw,3rem)' }}>
                      {related.emoji}
                    </span>
                    <div className="absolute bottom-0 left-0 right-0 h-8" style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.3))' }} />
                  </div>

                  <div className="p-5">
                    <span className="font-body text-[0.58rem] uppercase tracking-[0.2em] block mb-2" style={{ color: '#7B5EA7' }}>
                      {related.category}
                    </span>
                    <h3 className="font-display font-light text-[1rem] text-deep leading-snug group-hover:text-amethyst transition-colors duration-200">
                      {related.title}
                    </h3>
                    <p className="font-body text-[0.62rem] uppercase tracking-[0.1em] text-gold mt-3 group-hover:text-deep transition-colors duration-200">
                      Read more →
                    </p>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-10">
              <button
                onClick={onNavigateToJournal}
                className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-muted hover:text-gold px-8 py-3 transition-all duration-200 bg-transparent cursor-pointer"
                style={{ border: '1px solid rgba(196,184,154,0.5)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = '#C49A3C' }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(196,184,154,0.5)' }}
              >
                ← View All Posts
              </button>
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}

export default BlogPostPage
