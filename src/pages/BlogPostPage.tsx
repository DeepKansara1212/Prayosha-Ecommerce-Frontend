import { useState, useEffect, type FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { fetchBlogs, fetchBlogBySlug } from '@/api/blog.api'
import type { BlogPost, BlogSection } from '@/types'

// ─── Article content renderer ─────────────────────────────────────────────────

const renderSection = (section: BlogSection, index: number) => {
  if (!section.type && (section.title || section.description)) {
    return (
      <div key={index} id={`article-section-${index}`} className="space-y-3">
        {section.title && (
          <h2 className="font-display font-light text-[1.6rem] text-deep mt-10 mb-1">
            {section.title}
          </h2>
        )}
        {section.description && (
          <p className="font-body font-extralight text-[0.88rem] leading-[2] text-bark">
            {section.description}
          </p>
        )}
      </div>
    )
  }
  if (section.type === 'image' && section.image) {
    return (
      <figure key={index} id={`article-section-${index}`} className="mx-auto w-full max-w-sm">
        <div className="aspect-square overflow-hidden">
          <img
            src={section.image}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            onError={event => { event.currentTarget.style.display = 'none' }}
          />
        </div>
      </figure>
    )
  }
  if (section.type === 'paragraph') {
    return (
      <p key={index} id={`article-section-${index}`} className="font-body font-extralight text-[0.88rem] leading-[2] text-bark">
        {section.text ?? section.description}
      </p>
    )
  }
  if (section.type === 'heading') {
    return (
      <h2 key={index} id={`article-section-${index}`} className="font-display font-light text-[1.6rem] text-deep mt-10 mb-1">
        {section.text}
      </h2>
    )
  }
  if (section.type === 'subheading') {
    return (
      <h3
        key={index}
        id={`article-section-${index}`}
        className="font-body text-[0.72rem] uppercase tracking-[0.2em] mt-7 mb-1"
        style={{ color: '#C49A3C' }}
      >
        {section.text}
      </h3>
    )
  }
  if (section.type === 'quote') {
    return (
      <blockquote key={index} id={`article-section-${index}`} className="my-8 pl-6" style={{ borderLeft: '2px solid #7B5EA7' }}>
        <p className="font-display font-light text-[1.18rem] leading-[1.75] italic" style={{ color: '#7B5EA7' }}>
          {section.text}
        </p>
      </blockquote>
    )
  }
  if (section.type === 'list' && section.items) {
    return (
      <ul key={index} id={`article-section-${index}`} className="space-y-2 pl-1">
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

const getPostImage = (post: BlogPost) =>
  post.content.find(section => section.type === 'image' && section.image)?.image ?? post.images[0]

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

        {/* ── Article heading ── */}
        <header
          className="bg-warm"
          style={{
            padding: 'clamp(2rem,4vw,3.5rem) clamp(1.25rem,5vw,4rem)',
            paddingTop: '112px',
            borderBottom: '1px solid rgba(196,184,154,0.45)',
          }}
        >
          <div className="max-w-6xl mx-auto">
            <button
              onClick={onNavigateToJournal}
              className="font-body text-[0.62rem] uppercase tracking-[0.15em] text-muted hover:text-gold transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2 mb-8"
            >
              <span>←</span> Back to Journal
            </button>
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1 border" style={{ borderColor: 'rgba(123,94,167,0.45)', color: '#7B5EA7' }}>
                {post.category}
              </span>
              <span className="font-body text-[0.62rem] text-muted">{post.date}</span>
              <span className="w-1 h-1 rounded-full bg-gold" aria-hidden="true" />
              <span className="font-body text-[0.62rem] text-muted">{post.readTime}</span>
            </div>
            <h1 className="font-display font-light text-deep leading-[1.1] max-w-4xl mb-4" style={{ fontSize: 'clamp(2.2rem,5vw,4rem)' }}>
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="font-body font-extralight leading-[1.9] max-w-2xl text-bark" style={{ fontSize: 'clamp(0.88rem,2vw,1rem)' }}>
                {post.subtitle}
              </p>
            )}
          </div>
        </header>

        {/* ── Article body ── */}
        <div ref={contentRef} className="reveal">
          <div
            className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)] gap-10 lg:gap-16"
            style={{ padding: 'clamp(3rem,6vw,5rem) clamp(1.25rem,5vw,2rem)' }}
          >
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <p className="font-body text-[0.62rem] uppercase tracking-[0.2em] text-deep mb-4">In this article</p>
                <nav className="flex flex-col gap-2 border-l border-warm pl-4" aria-label="Article contents">
                  <span className="font-body text-[0.72rem] text-gold">Overview</span>
                  {post.content.map((section, index) => {
                    const label = section.type === 'heading' || section.type === 'subheading'
                      ? section.text
                      : !section.type ? section.title : undefined
                    return label ? (
                      <a
                        key={index}
                        href={`#article-section-${index}`}
                        className="font-body text-[0.7rem] leading-relaxed text-muted hover:text-amethyst transition-colors"
                      >
                        {label}
                      </a>
                    ) : null
                  })}
                </nav>
              </div>
            </aside>

            <article className="min-w-0 max-w-3xl">
              <p
                className="font-display font-light leading-[1.7] text-deep mb-8 pb-8"
                style={{
                  fontSize: 'clamp(1.05rem,2.5vw,1.3rem)',
                  borderBottom: '1px solid rgba(196,184,154,0.4)',
                }}
              >
                {post.excerpt}
              </p>

              <div className="space-y-6">
                {post.content.map((section, i) => renderSection(section, i))}
              </div>

              <div
                className="mt-12 pt-8 flex items-center gap-4"
                style={{ borderTop: '1px solid rgba(196,184,154,0.4)' }}
              >
                <div className="w-12 h-12 rounded-full bg-warm flex items-center justify-center text-xl flex-none">🌙</div>
                <div>
                  <p className="font-body text-[0.72rem] font-medium text-deep">Prayosha Crystal Journal</p>
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
            </article>
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
                    style={{ aspectRatio: '1', background: related.gradient }}
                  >
                    {getPostImage(related) && (
                      <img
                        src={getPostImage(related)}
                        alt={related.title}
                        className="absolute inset-0 h-full w-full object-cover"
                        loading="lazy"
                        onError={event => { event.currentTarget.style.display = 'none' }}
                      />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
                        backgroundSize: '22px 22px',
                        opacity: getPostImage(related) ? 0 : 0.3,
                      }}
                    />
                    {!getPostImage(related) && <span className="select-none relative z-10" style={{ fontSize: 'clamp(2.2rem,4vw,3rem)' }}>
                      {related.emoji}
                    </span>}
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
