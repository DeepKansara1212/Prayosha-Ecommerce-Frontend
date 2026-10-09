import { useState, useEffect, type FC } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/utils";
import { fetchBlogs } from "@/api/blog.api";
import type { BlogPost, BlogCategory } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const CATEGORIES: Array<"All" | BlogCategory> = [
  "All",
  "Crystal Guides",
  "Rituals",
  "Wellness",
  "Gemstone Spotlight",
  "Spiritual Practice",
];

function getPostImage(post: BlogPost): string | undefined {
  return post.content.find((section) => section.type === "image" && section.image)?.image
    ?? post.images[0];
}

// ─── Shared card image area ───────────────────────────────────────────────────

const CardImage: FC<{ post: BlogPost; tall?: boolean }> = ({ post, tall }) => (
  <div
    className="w-full relative overflow-hidden flex items-center justify-center"
    style={{
      aspectRatio: "1",
      background: post.gradient,
    }}
  >
    {getPostImage(post) && (
      <img
        src={getPostImage(post)}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        loading="lazy"
        onError={event => { event.currentTarget.style.display = "none" }}
      />
    )}
    <div
      className="absolute inset-0"
      style={{
        backgroundImage:
          "radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)",
        backgroundSize: "22px 22px",
        opacity: getPostImage(post) ? 0 : 0.35,
      }}
    />
    <div
      className="absolute rounded-full"
      style={{
        width: "45%",
        height: "45%",
        background: "rgba(255,255,255,0.08)",
        filter: "blur(28px)",
        opacity: getPostImage(post) ? 0 : 1,
      }}
    />
    {!getPostImage(post) && <span
      className="select-none relative z-10"
      style={{
        fontSize: tall ? "clamp(3.5rem,6vw,5.5rem)" : "clamp(3rem,5vw,4rem)",
      }}
    >
      {post.emoji}
    </span>}
  </div>
);

// ─── Post card ────────────────────────────────────────────────────────────────

interface PostCardProps {
  post: BlogPost;
  onNavigate: (slug: string) => void;
}

const PostCard: FC<PostCardProps> = ({ post, onNavigate }) => (
  <article
    className="group cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-1"
    style={{
      background: "#F5F0E8",
      border: "1px solid rgba(196,184,154,0.4)",
      boxShadow: "0 2px 10px rgba(28,20,16,0.07)",
    }}
    onClick={() => onNavigate(post.slug)}
    aria-label={post.title}
    onMouseEnter={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.boxShadow = "0 12px 36px rgba(28,20,16,0.16)";
      el.style.borderColor = "rgba(123,94,167,0.4)";
    }}
    onMouseLeave={(e) => {
      const el = e.currentTarget as HTMLElement;
      el.style.boxShadow = "0 2px 10px rgba(28,20,16,0.07)";
      el.style.borderColor = "rgba(196,184,154,0.4)";
    }}
  >
    <CardImage post={post} />

    <div className="p-6">
      <div className="flex items-center justify-between mb-3">
        <span
          className="font-body text-[0.58rem] uppercase tracking-[0.2em]"
          style={{ color: "#7B5EA7" }}
        >
          {post.category}
        </span>
        <span className="font-body text-[0.6rem] text-muted">
          {post.readTime}
        </span>
      </div>

      <h3 className="font-display font-light text-[1.1rem] text-deep mb-3 leading-snug transition-colors duration-200 group-hover:text-amethyst">
        {post.title}
      </h3>

      <p
        className="font-body font-extralight text-[0.78rem] leading-[1.8] text-bark mb-4"
        style={{
          display: "-webkit-box",
          WebkitLineClamp: 3,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {post.excerpt}
      </p>

      <div
        className="flex items-center justify-between pt-4"
        style={{ borderTop: "1px solid rgba(196,184,154,0.3)" }}
      >
        <span className="font-body text-[0.6rem] text-muted">{post.date}</span>
        <span className="font-body text-[0.62rem] uppercase tracking-[0.12em] text-gold transition-colors duration-200 group-hover:text-deep">
          Read more →
        </span>
      </div>
    </div>
  </article>
);

// ─── Featured card ────────────────────────────────────────────────────────────

const FeaturedCard: FC<PostCardProps> = ({ post, onNavigate }) => (
  <article
    className="group cursor-pointer grid grid-cols-1 md:grid-cols-[minmax(220px,0.8fr)_1.2fr] gap-0 overflow-hidden"
    style={{
      background: "#F5F0E8",
      border: "1px solid rgba(196,184,154,0.55)",
      boxShadow: "0 2px 10px rgba(28,20,16,0.07)",
    }}
    onClick={() => onNavigate(post.slug)}
    aria-label={`Featured: ${post.title}`}
  >
    <div
      className="relative overflow-hidden flex items-center justify-center"
      style={{
        aspectRatio: "1",
        background: post.gradient,
      }}
    >
      {getPostImage(post) ? (
        <img src={getPostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover" fetchPriority="high" />
      ) : (
        <span className="select-none" style={{ fontSize: "clamp(5rem,12vw,9rem)" }}>{post.emoji}</span>
      )}
    </div>

    <div className="flex flex-col justify-center p-6 sm:p-9 lg:p-12">
      <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-gold mb-4">✦ Featured Article</p>
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <span className="font-body text-[0.6rem] uppercase tracking-[0.2em] px-3 py-1 border" style={{ borderColor: "rgba(123,94,167,0.45)", color: "#7B5EA7" }}>{post.category}</span>
        <span className="font-body text-[0.62rem] text-muted">{post.date} · {post.readTime}</span>
      </div>
      <h2 className="font-display font-light text-deep leading-tight mb-4" style={{ fontSize: "clamp(1.7rem,3.5vw,2.8rem)" }}>{post.title}</h2>
      <p className="font-body font-extralight text-[0.84rem] leading-[1.9] text-bark mb-6">{post.excerpt}</p>
      <span className="inline-flex items-center gap-2 font-body text-[0.68rem] uppercase tracking-[0.2em] text-gold">Read Article <span>→</span></span>
    </div>
  </article>
);

// ─── BlogPage ─────────────────────────────────────────────────────────────────

interface BlogPageProps {
  onNavigateToPost: (slug: string) => void;
}

const BlogPage: FC<BlogPageProps> = ({ onNavigateToPost }) => {
  const [activeCategory, setActiveCategory] = useState<"All" | BlogCategory>(
    "All",
  );
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const gridRef = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    fetchBlogs()
      .then(setPosts)
      .finally(() => setLoading(false));
  }, []);

  const featuredPost =
    activeCategory === "All" ? posts.find((p) => p.featured) : null;
  const filteredPosts = posts.filter((p) => {
    const matchesCategory =
      activeCategory === "All" || p.category === activeCategory;
    if (activeCategory === "All" && p.featured) return false;
    return matchesCategory;
  });

  return (
    <>
      <Navbar />
      <main id="main-content">
        <section className="bg-cream" style={{ padding: "clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem) clamp(2rem,4vw,3rem)" }}>
          <p className="font-body text-[0.62rem] uppercase tracking-[0.3em] text-gold mb-3">Prayosha Crystal Journal</p>
          <h1 className="font-display font-light text-deep leading-tight mb-3" style={{ fontSize: "clamp(2.3rem,5vw,4rem)" }}>
            Stories for a more <em className="italic text-amethyst">intentional life</em>
          </h1>
          <p className="font-body font-extralight text-[0.86rem] leading-[1.9] text-muted max-w-2xl">
            Explore crystal wisdom, rituals, and thoughtful ways to bring a little more meaning into each day.
          </p>
        </section>

        {/* ── Category filter ── */}
        <div
          style={{
            background: "#EDE8DC",
            borderBottom: "1px solid rgba(196,184,154,0.45)",
            position: "sticky",
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ padding: "1rem clamp(1.25rem,5vw,4rem)" }}>
            <div className="flex gap-2 flex-wrap">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={cn(
                    "font-body text-[0.62rem] uppercase tracking-[0.15em] px-4 py-2 transition-all duration-200 border bg-transparent cursor-pointer",
                    activeCategory === cat
                      ? "text-cream border-[#7B5EA7]"
                      : "text-muted hover:border-[#7B5EA7] hover:text-[#7B5EA7]",
                  )}
                  style={
                    activeCategory === cat
                      ? { background: "#7B5EA7", borderColor: "#7B5EA7" }
                      : { borderColor: "rgba(196,184,154,0.6)" }
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
          <div
            style={{
              background: "#EDE8DC",
              padding: "clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)",
            }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  style={{
                    background: "#E8E2D6",
                    height: 360,
                    border: "1px solid rgba(196,184,154,0.3)",
                    animation: "pulse 1.5s ease-in-out infinite",
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
              <div
                style={{
                  padding: "clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem) 0",
                  background: "#EDE8DC",
                }}
              >
                <FeaturedCard
                  post={featuredPost}
                  onNavigate={onNavigateToPost}
                />
              </div>
            )}

            {/* ── Post grid ── */}
            <div
              ref={gridRef}
              className="reveal"
              style={{
                background: "#EDE8DC",
                padding: "clamp(2.5rem,5vw,4rem) clamp(1.25rem,5vw,4rem)",
              }}
            >
              <p className="font-body text-[0.6rem] uppercase tracking-[0.3em] text-gold mb-6">
                ✦ {activeCategory === "All" ? "All Articles" : activeCategory}
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
                    onClick={() => setActiveCategory("All")}
                    className="mt-6 font-body text-[0.65rem] uppercase tracking-[0.15em] text-gold hover:text-deep transition-colors bg-transparent border-none cursor-pointer"
                  >
                    ← View all posts
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      onNavigate={onNavigateToPost}
                    />
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
            padding: "clamp(3.5rem,7vw,6rem) clamp(1.25rem,5vw,4rem)",
            background:
              "radial-gradient(ellipse at 50% 50%, #3D1E4A 0%, #1C1410 100%)",
          }}
        >
          <p className="font-body text-[0.62rem] uppercase tracking-[0.35em] text-gold-light mb-3">
            ✦ &nbsp;Stay Connected
          </p>
          <h2
            className="font-display font-light text-cream mb-4"
            style={{ fontSize: "clamp(1.8rem,4vw,2.8rem)" }}
          >
            Subscribe to the <em className="italic text-gold-light">Journal</em>
          </h2>
          <p
            className="font-body font-extralight text-[0.82rem] max-w-md mx-auto mb-7 leading-relaxed"
            style={{ color: "rgba(245,240,232,0.55)" }}
          >
            New rituals, crystal guides, and moon cycle wisdom delivered to your
            inbox every new moon.
          </p>
          <form
            className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
            onSubmit={(e) => e.preventDefault()}
            aria-label="Subscribe to the Journal newsletter"
          >
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              className="flex-1 bg-transparent font-body text-[0.8rem] px-5 py-3 text-cream outline-none transition-colors"
              style={{ border: "1px solid rgba(196,184,154,0.3)" }}
              onFocus={(e) => {
                (e.target as HTMLInputElement).style.borderColor = "#C49A3C";
              }}
              onBlur={(e) => {
                (e.target as HTMLInputElement).style.borderColor =
                  "rgba(196,184,154,0.3)";
              }}
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
  );
};

export default BlogPage;
