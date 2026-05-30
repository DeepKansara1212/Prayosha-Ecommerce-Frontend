import { useState, useEffect, type FC } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { cn } from '@/lib/utils'
import { fetchBlogs } from '@/api/blog.api'
import type { BlogPost, BlogCategory } from '@/types'

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Array<'All' | BlogCategory> = [
  'All',
  'Crystal Guides',
  'Rituals',
  'Wellness',
  'Gemstone Spotlight',
  'Spiritual Practice',
]

// ─── Shared card image area ───────────────────────────────────────────────────

const CardImage: FC<{ post: BlogPost; tall?: boolean }> = ({ post, tall }) => (
  <div
    className="w-full relative overflow-hidden flex items-center justify-center"
    style={{
      aspectRatio: tall ? '16/9' : '4/3',
      background: post.gradient,
    }}
    aria-hidden="true"
  >
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
        opacity: 0.35,
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: '45%',
        height: '45%',
        background: 'rgba(255,255,255,0.08)',
        filter: 'blur(28px)',
      }}
    />
    <span
      className="select-none relative z-10"
      style={{ fontSize: tall ? 'clamp(3.5rem,6vw,5.5rem)' : 'clamp(3rem,5vw,4rem)' }}
    >
      {post.emoji}
    </span>
    <div
      className="absolute bottom-0 left-0 right-0 h-12"
      style={{ background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.35))' }}
    />
  </div>
)

// ─── Post card ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: BlogPost
  onNavigate: (slug: string) => void
}

const PostCard: FC<PostCardProps> = ({ post, onNavigate }) => (
  <article
    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
    style={{
      background: '#F5F0E8',
      border: '1px solid rgba(196,184,154,0.4)',
      boxShadow: '0 2px 10px rgba(28,20,16,0.07)',
    }}
    onClick={() => onNavigate(post.slug)}
    aria-label={post.title}
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
    <CardImage post={post} />

    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-body text-[0.58rem] uppercase tracking-[0.2em]"
          style={{ color: '#7B5EA7' }}
        >
          {post.category}
        </span>
        <span className="font-body text-[0.6rem] text-muted">{post.readTime}</span>
      </div>

      <h3 className="font-display font-light text-[1.1rem] text-deep mb-3 leading-snug transition-colors duration-200 group-hover:text-amethyst">
        {post.title}
      </h3>

      <p
        className="font-body font-extralight text-[0.78rem] leading-[1.8] text-bark mb-4"
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.excerpt}
      </p>

      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: '1px solid rgba(196,184,154,0.3)' }}
      >
        <span className="font-body text-[0.6rem] text-muted">{post.date}</span>
        <span className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-gold transition-colors duration-200 group-hover:text-deep">
          Read more →
        </span>
      </div>
    </div>
  </article>
)

// ─── Featured card ────────────────────────────────────────────────────────────

const FeaturedCard: FC<PostCardProps> = ({ post, onNavigate }) => (
  <article
    className="group cursor-pointer relative overflow-hidden"
    style={{
      background: post.gradient,
      minHeight: 'clamp(340px, 42vh, 500px)',
      border: '1px solid rgba(255,255,255,0.06)',
    }}
    onClick={() => onNavigate(post.slug)}
    aria-label={`Featured: ${post.title}`}
  >
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage:
          'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        opacity: 0.3,
      }}
    />

    <div
      className="absolute inset-0 flex items-center justify-end pointer-events-none select-none"
      style={{
        paddingRight: 'clamp(2rem,6vw,6rem)',
        opacity: 0.08,
        fontSize: 'clamp(9rem,18vw,18rem)',
      }}
      aria-hidden="true"
    >
      {post.emoji}
    </div>

    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background:
          'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 60%, transparent 100%)',
      }}
    />

    <div
      className="relative z-10 flex flex-col justify-end h-full"
      style={{
        padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)',
        minHeight: 'clamp(340px, 42vh, 500px)',
      }}
    >
      <p
        className="font-body text-[0.58rem] uppercase tracking-[0.3em] mb-3"
        style={{ color: 'rgba(196,184,154,0.9)' }}
      >
        ✦ Featured Article
      </p>

      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span
          className="font-body text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1"
          style={{
            border: '1px solid rgba(165,132,200,0.6)',
            color: '#C4A8E8',
            background: 'rgba(123,94,167,0.15)',
          }}
        >
          {post.category}
        </span>
        <span className="font-body text-[0.62rem]" style={{ color: 'rgba(245,240,232,0.55)' }}>
          {post.readTime}
        </span>
      </div>

      <h2
        className="font-display font-light text-cream leading-tight mb-4"
        style={{ fontSize: 'clamp(1.8rem,4.5vw,3.2rem)', textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}
      >
        {post.title}
      </h2>

      <p
        className="font-body font-extralight text-[0.84rem] leading-[1.8] max-w-2xl mb-6"
        style={{ color: 'rgba(245,240,232,0.65)' }}
      >
        {post.excerpt}
      </p>

      <button
        className="inline-flex items-center gap-2 font-body text-[0.68rem] uppercase tracking-[0.2em] self-start bg-transparent border-none cursor-pointer p-0 transition-colors duration-200"
        style={{ color: '#C49A3C' }}
        onClick={e => { e.stopPropagation(); onNavigate(post.slug) }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#F5F0E8' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#C49A3C' }}
      >
        Read Article
        <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </button>
    </div>
  </article>
)

// ─── BlogPage ─────────────────────────────────────────────────────────────────

interface BlogPageProps {
  onNavigateToPost: (slug: string) => void
}

const BlogPage: FC<BlogPageProps> = ({ onNavigateToPost }) => {
  const [activeCategory, setActiveCategory] = useState<'All' | BlogCategory>('All')
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const heroRef = useScrollReveal<HTMLDivElement>()
  const gridRef = useScrollReveal<HTMLDivElement>()

  useEffect(() => {
    fetchBlogs()
      .then(setPosts)
      .finally(() => setLoading(false))
  }, [])

  const featuredPost  = activeCategory === 'All' ? posts.find(p => p.featured) : null
  const filteredPosts = posts.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory
    if (activeCategory === 'All' && p.featured) return false
    return matchesCategory
  })

  return (
    <>
      <Navbar />
      <main id="main-content">

        {/* ── Hero ── */}
        <div
          className="relative overflow-hidden flex items-end"
          style={{
            minHeight: 'clamp(380px, 58vh, 600px)',
            paddingTop: '96px',
            background: 'radial-gradient(ellipse at 30% 70%, #4A2D5E 0%, #2A1A2E 45%, #1C1410 100%)',
          }}
        >
          <svg
            className="absolute right-0 top-0 w-1/2 h-full opacity-10 pointer-events-none"
            viewBox="0 0 500 600"
            fill="none"
            aria-hidden="true"
          >
            <polygon points="300,50 480,200 480,400 300,550 120,400 120,200" stroke="#B8956A" strokeWidth="0.8" fill="none" />
            <circle cx="300" cy="300" r="120" stroke="#B8956A" strokeWidth="0.4" fill="none" opacity="0.5" />
            <circle cx="300" cy="300" r="200" stroke="#B8956A" strokeWidth="0.3" fill="none" opacity="0.25" />
          </svg>

          <div
            className="absolute top-1/4 right-1/3 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: '#7C5C8A', opacity: 0.22, filter: 'blur(80px)' }}
            aria-hidden="true"
          />
          <div
            className="absolute bottom-0 left-1/4 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: '#C9837A', opacity: 0.14, filter: 'blur(60px)' }}
            aria-hidden="true"
          />

          <div
            ref={heroRef}
            className="reveal relative z-10"
            style={{ padding: 'clamp(3rem,7vw,5rem) clamp(1.25rem,5vw,4rem)' }}
          >
            <p className="flex items-center gap-3 font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-5">
              <span className="w-8 h-px bg-gold-light" aria-hidden="true" />
              The Journal
            </p>
            <h1
              className="font-display font-light text-cream leading-[1.05] mb-5"
              style={{ fontSize: 'clamp(2.8rem,7vw,5.5rem)' }}
            >
              Crystal wisdom for<br />
              <em className="italic text-gold-light">conscious living</em>
            </h1>
            <p
              className="font-body font-extralight leading-[1.9] max-w-lg"
              style={{ fontSize: 'clamp(0.83rem,2vw,0.92rem)', color: 'rgba(245,240,232,0.6)' }}
            >
              Explore rituals, gemstone guides, and spiritual practices to deepen your connection with the earth's most sacred stones.
            </p>
          </div>
        </div>

        {/* ── Category filter ── */}
        <div
          style={{
            background: '#EDE8DC',
            borderBottom: '1px solid rgba(196,184,154,0.45)',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ padding: '1rem clamp(1.25rem,5vw,4rem)' }}>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    'font-body text-[0.62rem] uppercase tracking-[0.15em] px-4 py-2 transition-all duration-200 border bg-transparent cursor-pointer',
                    activeCategory === cat
                      ? 'text-cream border-[#7B5EA7]'
                      : 'text-muted hover:border-[#7B5EA7] hover:text-[#7B5EA7]',
                  )}
                  style={
                    activeCategory === cat
                      ? { background: '#7B5EA7', borderColor: '#7B5EA7' }
                      : { borderColor: 'rgba(196,184,154,0.6)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Loading state ── */}
        {loading && (
          <div style={{ background: '#EDE8DC', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  style={{
                    background: '#E8E2D6',
                    height: 360,
                    border: '1px solid rgba(196,184,154,0.3)',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {!loading && (
          <>
            {/* ── Featured post ── */}
            {featuredPost && (
              <div style={{ padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem) 0', background: '#EDE8DC' }}>
                <FeaturedCard post={featuredPost} onNavigate={onNavigateToPost} />
              </div>
            )}

            {/* ── Post grid ── */}
            <div
              ref={gridRef}
              className="reveal"
              style={{
                background: '#EDE8DC',
                padding: 'clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)',
              }}
            >
              <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-gold mb-6">
                ✦ {activeCategory === 'All' ? 'All Articles' : activeCategory}
              </p>

              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="font-display font-light text-[1.5rem] text-deep mb-2">
                    No posts in this category yet
                  </p>
                  <p className="font-body font-extralight text-[0.82rem] text-muted">
                    We're working on new content — check back soon.
                  </p>
                  <button
                    onClick={() => setActiveCategory('All')}
                    className="mt-6 font-body text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:text-deep transition-colors bg-transparent border-none cursor-pointer"
                  >
                    ← View all posts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map(post => (
                    <PostCard key={post.id} post={post} onNavigate={onNavigateToPost} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Newsletter strip ── */}
        <div
          className="text-center"
          style={{
            padding: 'clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem)',
            background: 'radial-gradient(ellipse at 50% 50%, #3D1E4A 0%, #1C1410 100%)',
          }}
        >
          <p className="font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-3">
            ✦ &nbsp;Stay Connected
          </p>
          <h2
            className="font-display font-light text-cream mb-4"
            style={{ fontSize: 'clamp(1.8rem,4vw,2.8rem)' }}
          >
            Subscribe to the <em className="italic text-gold-light">Journal</em>
          </h2>
          <p
            className="font-body font-extralight text-[0.82rem] max-w-md mx-auto mb-7 leading-relaxed"
            style={{ color: 'rgba(245,240,232,0.55)' }}
          >
            New rituals, crystal guides, and moon cycle wisdom delivered to your inbox every new moon.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            onSubmit={e => e.preventDefault()}
            aria-label="Subscribe to the Journal newsletter"
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="flex-1 bg-transparent font-body text-[0.8rem] px-5 py-3 text-cream outline-none transition-colors"
              style={{ border: '1px solid rgba(196,184,154,0.3)' }}
              onFocus={e => { (e.target as HTMLInputElement).style.borderColor = '#C49A3C' }}
              onBlur={e => { (e.target as HTMLInputElement).style.borderColor = 'rgba(196,184,154,0.3)' }}
            />
            <button
              type="submit"
              className="font-body text-[0.65rem] uppercase tracking-[0.2em] bg-gold text-deep px-7 py-3 hover:bg-gold-light transition-colors duration-200 border-none cursor-pointer whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>

      </main>
      <Footer />
    </>
  )
}

export default BlogPage
