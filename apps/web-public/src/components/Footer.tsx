import { Link } from 'react-router-dom';
import { MapPin, Phone, Clock } from 'lucide-react';

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconFacebook({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

export function Footer() {
  return (
    <footer style={{ backgroundColor: '#3b1f1a' }} className="text-beige/80">
      <div className="section-wrapper py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {/* Brand */}
          <div className="flex flex-col gap-4 items-center text-center">
            <img
              src="/Logo_TBH.svg"
              alt="Trailer Burger Hall"
              className="h-28 w-auto object-contain mx-auto"
            />
            <p className="text-sm leading-relaxed text-beige/60">
              Hamburguesas artesanales con ingredientes frescos. Cada mordida, una experiencia
              única.
            </p>
            <div className="flex gap-3 mt-1 justify-center">
              <a
                href="https://instagram.com/trailerburgerhall"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de Trailer Burger Hall"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-gold/20 flex items-center justify-center text-beige/60 hover:text-gold transition-all duration-200 cursor-pointer"
              >
                <IconInstagram size={18} />
              </a>
              <a
                href="https://facebook.com/trailerburgerhall"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de Trailer Burger Hall"
                className="w-9 h-9 rounded-lg bg-white/8 hover:bg-gold/20 flex items-center justify-center text-beige/60 hover:text-gold transition-all duration-200 cursor-pointer"
              >
                <IconFacebook size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg text-beige-light">Navegación</h3>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="text-sm text-beige/60 hover:text-gold transition-colors duration-150 cursor-pointer w-fit"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact info */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-lg text-beige-light">Encuéntranos</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-beige/60">
                <MapPin size={16} className="text-gold shrink-0 mt-0.5" />
                <span>
                  Calzada de la Hacienda Mz 23 Lt 9,
                  <br />
                  Ojo de Agua, Tecámac, Estado de México
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-beige/60">
                <Phone size={16} className="text-gold shrink-0" />
                <a
                  href="tel:+525559326110"
                  className="hover:text-gold transition-colors duration-150 cursor-pointer"
                >
                  55 5932 6110
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm text-beige/60">
                <Clock size={16} className="text-gold shrink-0 mt-0.5" />
                <span>
                  Lun – Mar: Cerrado
                  <br />
                  Mié: 7:00 – 10:30 pm
                  <br />
                  Jue: 6:00 – 10:30 pm
                  <br />
                  Vie – Sáb: 4:00 – 10:30 pm
                  <br />
                  Dom: 4:00 – 10:00 pm
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-beige/40">
          <p>© {new Date().getFullYear()} Trailer Burger Hall. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con
            <span className="text-gold" aria-label="amor">
              ♥
            </span>
            en México
          </p>
        </div>
      </div>
    </footer>
  );
}
