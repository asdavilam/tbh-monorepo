import { Link } from 'react-router-dom';
import { Heart, Target, Eye, MapPin, ArrowRight } from 'lucide-react';

// ─── Page Hero ─────────────────────────────────────────────────────────────────
function PageHero() {
  return (
    <section
      className="pt-32 pb-20"
      style={{
        background: 'linear-gradient(160deg, #5A1F1B 0%, #3D1412 100%)',
      }}
    >
      <div className="section-wrapper text-center">
        <p className="text-gold/70 text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
          Quiénes somos
        </p>
        <h1
          className="font-serif text-beige-light mb-4"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          Nuestra <span className="text-gold italic">Historia</span>
        </h1>
        <p className="text-beige/60 max-w-md mx-auto text-base font-sans leading-relaxed">
          Una historia de pasión, fuego lento y sabor auténtico que comenzó en las calles.
        </p>
      </div>
    </section>
  );
}

// ─── Historia ─────────────────────────────────────────────────────────────────
function Historia() {
  return (
    <section className="py-24 bg-beige-light">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual side */}
          <div className="relative order-2 lg:order-1">
            {/* Main "image" block */}
            <div
              className="rounded-2xl aspect-[4/3] overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, #3D1412 0%, #5A1F1B 50%, #7A2B26 100%)',
              }}
            >
              <div className="h-full flex flex-col items-center justify-center gap-4 p-8 text-center">
                <span className="text-7xl opacity-20 select-none">🔥</span>
                <p className="font-serif text-beige/40 text-lg italic">Desde las brasas</p>
              </div>
            </div>
            {/* Floating detail card */}
            <div className="absolute -bottom-5 -right-4 lg:-right-8 bg-white rounded-xl p-5 shadow-card-hover border border-gold/20">
              <p className="font-serif text-wine text-3xl font-bold leading-none">+5</p>
              <p className="text-brown-muted text-xs mt-1 font-sans">años de experiencia</p>
            </div>
          </div>

          {/* Text side */}
          <div className="order-1 lg:order-2 flex flex-col gap-6">
            <div>
              <p className="text-gold text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
                Nuestra historia
              </p>
              <h2
                className="font-serif text-brown mb-5"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
              >
                Nació en la calle,
                <br />
                <span className="text-wine italic">creció con pasión</span>
              </h2>
            </div>
            <p className="text-brown-muted leading-relaxed text-[15px]">
              Todo comenzó con una idea simple: hacer la hamburguesa perfecta. No la más cara ni la
              más elaborada, sino la que al primer bocado te hace cerrar los ojos.
            </p>
            <p className="text-brown-muted leading-relaxed text-[15px]">
              Arrancamos desde un trailer en las calles de la ciudad, con recetas propias y la
              convicción de que la comida de calle puede ser premium. Cada semana mejoramos, cada
              cliente nos enseña algo nuevo.
            </p>
            <p className="text-brown-muted leading-relaxed text-[15px]">
              Hoy somos un punto de referencia para los amantes de las hamburguesas artesanales — y
              seguimos cocinando con el mismo fuego del principio.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <div className="h-px flex-1 bg-gold/20" />
              <Heart size={16} className="text-gold" />
              <div className="h-px flex-1 bg-gold/20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Misión & Visión ──────────────────────────────────────────────────────────
function MisionVision() {
  return (
    <section
      className="py-24"
      style={{
        background: 'linear-gradient(160deg, #2A1A18 0%, #3D1412 100%)',
      }}
    >
      <div className="section-wrapper">
        <div className="text-center mb-14">
          <p className="text-gold/70 text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
            Lo que nos mueve
          </p>
          <h2
            className="font-serif text-beige-light"
            style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)' }}
          >
            Misión &<span className="text-gold italic"> Visión</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Misión */}
          <div
            className="rounded-xl p-8 flex flex-col gap-5"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,164,108,0.2)',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-sage/15 flex items-center justify-center">
              <Target size={22} className="text-sage" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-serif text-beige-light text-xl mb-3">Misión</h3>
              <p className="text-beige/60 text-sm leading-relaxed">
                Crear hamburguesas artesanales con ingredientes frescos, preparando cada pedido al
                momento para ofrecer un sabor auténtico y una atención cercana.
              </p>
            </div>
          </div>

          {/* Visión */}
          <div
            className="rounded-xl p-8 flex flex-col gap-5"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,164,108,0.2)',
            }}
          >
            <div className="w-12 h-12 rounded-xl bg-gold/15 flex items-center justify-center">
              <Eye size={22} className="text-gold" strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="font-serif text-beige-light text-xl mb-3">Visión</h3>
              <p className="text-beige/60 text-sm leading-relaxed">
                Ser la referencia local de hamburguesas premium: una experiencia honesta, deliciosa
                y consistente que haga volver a nuestros clientes, una y otra vez.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Ubicación ────────────────────────────────────────────────────────────────
function Ubicacion() {
  return (
    <section className="py-24 bg-beige">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Info */}
          <div className="flex flex-col gap-8">
            <div>
              <p className="text-gold text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
                Dónde encontrarnos
              </p>
              <h2
                className="font-serif text-brown"
                style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)' }}
              >
                Ven a probar
                <span className="text-wine italic"> la diferencia</span>
              </h2>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-wine" />
                </div>
                <div>
                  <p className="font-semibold text-brown text-sm mb-1">Dirección</p>
                  <p className="text-brown-muted text-sm leading-relaxed">
                    Calzada de la Hacienda Mz 23 Lt 9<br />
                    Ojo de Agua, Tecámac
                    <br />
                    Estado de México, C.P. 55770
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-wine/10 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="text-wine"
                  >
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-brown text-sm mb-1">Horarios</p>
                  <p className="text-brown-muted text-sm leading-relaxed">
                    Lun – Mar: Cerrado
                    <br />
                    Miércoles: 7:00 – 10:30 pm
                    <br />
                    Jueves: 6:00 – 10:30 pm
                    <br />
                    Vie – Sáb: 4:00 – 10:30 pm
                    <br />
                    Domingo: 4:00 – 10:00 pm
                  </p>
                </div>
              </div>
            </div>

            <Link to="/contacto" className="btn-primary w-fit">
              Contactar
              <ArrowRight size={16} />
            </Link>
          </div>

          {/* Map placeholder */}
          <div
            className="rounded-2xl overflow-hidden h-72 lg:h-96 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #EAE3D9 0%, #D4CAB8 100%)',
              border: '1px solid rgba(201,164,108,0.3)',
            }}
          >
            <div className="text-center flex flex-col items-center gap-3 text-brown-muted">
              <MapPin size={32} strokeWidth={1.2} className="text-wine/40" />
              <p className="text-sm font-sans">Mapa próximamente</p>
              <p className="text-xs">Google Maps embed</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function About() {
  return (
    <>
      <PageHero />
      <Historia />
      <MisionVision />
      <Ubicacion />
    </>
  );
}
