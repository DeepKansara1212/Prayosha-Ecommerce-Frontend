import type {
  NavLink,
  CrystalCard,
  Benefit,
  Product,
  Testimonial,
  FooterColumn,
} from '@/types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Collections', href: '#collections' },
  { label: 'Raw Stones',  href: '#' },
  { label: 'Jewellery',   href: '#' },
  { label: 'Rituals',     href: '#ritual' },
  { label: 'Journal',     href: '#' },
]

export const MARQUEE_ITEMS: string[] = [
  'Iso Certified',
  'Secure Payment',
  'Premium Quality',
  'Handpicked Crystals',
  'Genuine Product',
]

export const CRYSTAL_CARDS: CrystalCard[] = [
  {
    id: 'amethyst-cathedral',
    name: 'Amethyst Cathedral',
    tag: 'Bestseller',
    price: 'From ₹3,200',
    emoji: '🔮',
    gemClass: 'bg-gem-amethyst',
    large: true,
  },
  {
    id: 'rose-quartz',
    name: 'Rose Quartz',
    tag: 'Love & Healing',
    price: 'From ₹650',
    emoji: '🌸',
    gemClass: 'bg-gem-rose',
  },
  {
    id: 'blue-aquamarine',
    name: 'Blue Aquamarine',
    tag: 'Communication',
    price: 'From ₹1,450',
    emoji: '💎',
    gemClass: 'bg-gem-aqua',
  },
  {
    id: 'golden-citrine',
    name: 'Golden Citrine',
    tag: 'Abundance',
    price: 'From ₹890',
    emoji: '✨',
    gemClass: 'bg-gem-citrine',
  },
  {
    id: 'jade-aventurine',
    name: 'Jade & Aventurine',
    tag: 'Grounding',
    price: 'From ₹720',
    emoji: '🌿',
    gemClass: 'bg-gem-sage',
  },
]

export const BENEFITS: Benefit[] = [
  {
    id: 'sourced',
    icon: '🌍',
    title: 'Ethically Sourced',
    description: 'Direct partnerships with responsible mines. Full provenance for every stone.',
  },
  {
    id: 'authentic',
    icon: '✦',
    title: 'Certified Authentic',
    description: 'Gemologist-verified. No dyed, heat-treated, or synthetic stones ever.',
  },
  {
    id: 'moon',
    icon: '🌙',
    title: 'Moon-Cleansed',
    description: 'Every piece is cleansed under a full moon before it reaches your door.',
  },
  {
    id: 'packaging',
    icon: '📦',
    title: 'Sacred Packaging',
    description: 'Wrapped in organic cotton with a crystal guide and intention card.',
  },
]

export const PRODUCTS: Product[] = [
  {
    id: 'amethyst-druzy',
    name: 'Amethyst Druzy',
    type: 'Raw Cluster',
    price: '₹1,850',
    emoji: '🔮',
    bgClass: 'bg-gem-amethyst',
  },
  {
    id: 'black-tourmaline',
    name: 'Black Tourmaline',
    type: 'Tumbled Stone',
    price: '₹490',
    emoji: '🌙',
    bgClass: 'bg-gem-tourmaline',
  },
  {
    id: 'citrine-tower',
    name: 'Citrine Tower',
    type: 'Point Crystal',
    price: '₹2,200',
    emoji: '⚡',
    bgClass: 'bg-gem-citrine',
  },
  {
    id: 'lapis-ball',
    name: 'Lapis Lazuli Ball',
    type: 'Sphere',
    price: '₹3,400',
    emoji: '💙',
    bgClass: 'bg-gem-lapis',
  },
]

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'priya',
    quote: 'The amethyst cathedral I ordered was absolutely breathtaking. The energy in my meditation room has completely transformed.',
    author: 'Priya M.',
    location: 'Mumbai',
  },
  {
    id: 'aarav',
    quote: "I've bought crystals from many places, but Prayosha Crystal's quality and authenticity is unmatched. The packaging is like receiving a gift from the earth itself.",
    author: 'Aarav K.',
    location: 'Bangalore',
  },
  {
    id: 'nisha',
    quote: 'Their crystal guides changed how I practice. I feel so much more connected to the stones after following the cleansing rituals.',
    author: 'Nisha R.',
    location: 'Delhi',
  },
]

export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: 'Shop',
    links: [
      { label: 'Raw Crystals',      href: '/collection' },
      { label: 'Tumbled Stones',    href: '/collection' },
      { label: 'Crystal Jewellery', href: '/collection' },
      { label: 'Spheres & Points',  href: '/collection' },
      { label: 'Gift Sets',         href: '/collection' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { label: 'Crystal Guide',   href: '/blog' },
      { label: 'Ritual Library',  href: '/blog' },
      { label: 'Chakra Charts',   href: '/blog' },
      { label: 'Journal',         href: '/blog' },
    ],
  },
  {
    heading: 'Help',
    links: [
      { label: 'About Us',         href: '/about' },
      { label: 'Shipping Policy',  href: '/contact' },
      { label: 'Returns',          href: '/contact' },
      { label: 'Contact',          href: '/contact' },
      { label: 'FAQ',              href: '/contact' },
      { label: 'Terms & Conditions', href: '/terms' },
      { label: 'Privacy Policy',     href: '/privacy' },
    ],
  },
]

