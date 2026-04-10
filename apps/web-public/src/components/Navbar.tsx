import { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { to: '/', label: 'Inicio' },
  { to: '/menu', label: 'Menú' },
  { to: '/nosotros', label: 'Nosotros' },
  { to: '/contacto', label: 'Contacto' },
];

const NAV_BG = '#3b1f1a';
const TEXT_DEFAULT = '#c08a3e';
const TEXT_ACTIVE = '#6b8e62';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = () => setOpen(false);

  return (
    <header
      style={{
        backgroundColor: scrolled ? NAV_BG : 'transparent',
        boxShadow: scrolled ? '0 4px 24px rgba(0,0,0,0.25)' : 'none',
      }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-3' : 'py-5'
      }`}
    >
      <div className="section-wrapper flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group" onClick={handleNavClick}>
          <span
            className="font-serif text-2xl font-bold tracking-tight transition-colors duration-200"
            style={{ color: TEXT_DEFAULT }}
          >
            TBH
          </span>
          <span
            className="hidden sm:block text-xs font-sans font-medium tracking-[0.2em] uppercase mt-0.5 opacity-70"
            style={{ color: TEXT_DEFAULT }}
          >
            Trailer Burger Hall
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
              style={({ isActive }) => ({
                color: isActive ? TEXT_ACTIVE : TEXT_DEFAULT,
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden transition-colors duration-150 cursor-pointer p-2 -mr-2 rounded-lg"
          style={{ color: TEXT_DEFAULT }}
          onClick={() => setOpen(!open)}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="section-wrapper flex flex-col pb-4 pt-2 gap-1 border-t border-white/10 mt-3">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={handleNavClick}
              className="px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer"
              style={({ isActive }) => ({
                color: isActive ? TEXT_ACTIVE : TEXT_DEFAULT,
                backgroundColor: isActive ? 'rgba(255,255,255,0.08)' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
