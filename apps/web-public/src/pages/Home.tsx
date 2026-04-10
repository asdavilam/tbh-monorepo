import { Link } from 'react-router-dom';
import { ArrowRight, Star, Flame, Leaf, Award, ChevronDown } from 'lucide-react';

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background: rich dark warm gradient simulating a food-truck atmosphere */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse at 30% 40%, rgba(90,31,27,0.9) 0%, transparent 60%),
            radial-gradient(ellipse at 70% 60%, rgba(61,20,18,0.95) 0%, transparent 70%),
            linear-gradient(160deg, #1a0e0c 0%, #2A1A18 40%, #3D1412 100%)
          `,
        }}
      />

      {/* Texture overlay: subtle grain + warm glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 80%, rgba(201,164,108,0.15) 0%, transparent 40%),
            radial-gradient(circle at 80% 20%, rgba(111,175,141,0.08) 0%, transparent 40%)
          `,
        }}
      />

      {/* Decorative large burger silhouette hint */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full opacity-5 hidden lg:block"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(201,164,108,1) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 section-wrapper text-center py-32 pt-44">
        {/* Pre-title badge */}
        <div className="inline-flex items-center gap-2 bg-gold/15 border border-gold/30 text-gold px-4 py-1.5 rounded-full text-xs font-sans font-semibold tracking-[0.15em] uppercase mb-8 animate-fade-in">
          <Flame size={12} />
          Hamburguesas Artesanales
        </div>

        {/* Main title */}
        <h1
          className="font-serif text-beige-light mb-6"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
          }}
        >
          Trailer
          <span className="block text-gold italic">Burger Hall</span>
        </h1>

        {/* Subtitle */}
        <p className="text-beige/70 max-w-xl mx-auto mb-10 text-lg font-sans font-light leading-relaxed">
          Ingredientes frescos, técnica artesanal y sabor auténtico en cada mordida.
          <br className="hidden sm:block" />
          Esto no es comida rápida — es una experiencia.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link to="/menu" className="btn-primary text-base px-8 py-3.5 shadow-lg shadow-sage/20">
            Ver Menú Completo
            <ArrowRight size={18} />
          </Link>
          <Link to="/contacto" className="btn-secondary text-base px-8 py-3.5">
            Contactar
          </Link>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-beige/30 animate-bounce">
          <ChevronDown size={20} />
        </div>
      </div>
    </section>
  );
}

// ─── Why Us ────────────────────────────────────────────────────────────────────
const WHY_ITEMS = [
  {
    icon: Leaf,
    title: 'Ingredientes Frescos',
    desc: 'Seleccionamos cada ingrediente diariamente. Sin congelados, sin atajos.',
  },
  {
    icon: Flame,
    title: 'Técnica Artesanal',
    desc: 'Nuestras hamburguesas se preparan al momento con procesos que marcan la diferencia.',
  },
  {
    icon: Award,
    title: 'Sabor Garantizado',
    desc: 'Recetas propias perfeccionadas con años de experiencia en la calle y el fogón.',
  },
];

function WhyUs() {
  return (
    <section className="py-24 bg-beige-light">
      <div className="section-wrapper">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="text-gold text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
            Por qué elegirnos
          </p>
          <h2
            className="font-serif text-brown"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Lo que nos hace
            <span className="text-wine italic"> diferentes</span>
          </h2>
          <div className="ornament mt-5 max-w-xs mx-auto">
            <span className="text-gold text-lg">◆</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WHY_ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="card-gold p-8 text-center flex flex-col items-center gap-5 group"
            >
              <div className="w-14 h-14 rounded-xl bg-sage/10 flex items-center justify-center group-hover:bg-sage/20 transition-colors duration-200">
                <Icon size={26} className="text-sage" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-brown text-xl mb-2">{title}</h3>
                <p className="text-brown-muted text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Reviews ───────────────────────────────────────────────────────────────────
const REVIEWS = [
  {
    name: 'Rodrigo M.',
    text: 'La mejor hamburguesa que he probado en la ciudad. El pan brioche y la carne jugosa son un nivel aparte.',
    stars: 5,
    role: 'Cliente frecuente',
  },
  {
    name: 'Sofía L.',
    text: 'Me sorprendió la calidad para ser un trailer. Los ingredientes se notan frescos y la atención es increíble.',
    stars: 5,
    role: 'Reseña en Google',
  },
  {
    name: 'Carlos V.',
    text: 'Fui una vez y ya soy cliente fijo. La salsas caseras son lo que marca la diferencia. 100% recomendado.',
    stars: 5,
    role: 'Cliente frecuente',
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={14} className="text-gold fill-gold" />
      ))}
    </div>
  );
}

function Reviews() {
  return (
    <section
      className="py-24"
      style={{
        background: 'linear-gradient(160deg, #5A1F1B 0%, #3D1412 60%, #2A1A18 100%)',
      }}
    >
      <div className="section-wrapper">
        {/* Header */}
        <div className="text-center mb-14">
          <p className="text-gold/70 text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
            Opiniones reales
          </p>
          <h2
            className="font-serif text-beige-light"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Lo que dicen
            <span className="text-gold italic"> nuestros clientes</span>
          </h2>
          <div className="ornament mt-5 max-w-xs mx-auto">
            <span className="text-gold/50 text-lg">◆</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map(({ name, text, stars, role }) => (
            <div
              key={name}
              className="rounded-xl p-7 flex flex-col gap-4"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(201,164,108,0.2)',
              }}
            >
              <StarRating count={stars} />
              <p className="text-beige/80 text-sm leading-relaxed italic">"{text}"</p>
              <div className="border-t border-white/10 pt-4 mt-auto">
                <p className="text-beige-light font-semibold text-sm font-sans">{name}</p>
                <p className="text-beige/40 text-xs mt-0.5">{role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA Banner ────────────────────────────────────────────────────────────────
function CtaBanner() {
  return (
    <section className="py-20 bg-beige">
      <div className="section-wrapper text-center">
        <p className="text-gold text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-4">
          ¿Listo para el antojo?
        </p>
        <h2
          className="font-serif text-brown mb-4"
          style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.75rem)' }}
        >
          Descubre nuestro menú completo
        </h2>
        <p className="text-brown-muted max-w-md mx-auto mb-8 text-base leading-relaxed">
          Hamburguesas clásicas, especiales de temporada y acompañamientos que no olvidarás.
        </p>
        <Link to="/menu" className="btn-primary text-base px-10 py-4 shadow-lg shadow-sage/25">
          Ver Menú
          <ArrowRight size={18} />
        </Link>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Reviews />
      <CtaBanner />
    </>
  );
}
