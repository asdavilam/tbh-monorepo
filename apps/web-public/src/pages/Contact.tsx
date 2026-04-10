import { useState, FormEvent } from 'react';
import { MapPin, Phone, MessageCircle, Send, CheckCircle } from 'lucide-react';

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
          Hablemos
        </p>
        <h1
          className="font-serif text-beige-light mb-4"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          <span className="text-gold italic">Contáctanos</span>
        </h1>
        <p className="text-beige/60 max-w-md mx-auto text-base font-sans leading-relaxed">
          Dudas, reservaciones o simplemente un saludo — estamos aquí.
        </p>
      </div>
    </section>
  );
}

// ─── Contact Form ─────────────────────────────────────────────────────────────
function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const validate = () => {
    const e: Partial<typeof form> = {};
    if (!form.name.trim()) e.name = 'El nombre es requerido';
    if (!form.email.trim()) e.email = 'El email es requerido';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Email inválido';
    if (!form.message.trim()) e.message = 'El mensaje es requerido';
    return e;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }
    setLoading(true);
    // Simulate send
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1200);
  };

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-16 text-center">
        <div className="w-16 h-16 rounded-full bg-sage/15 flex items-center justify-center">
          <CheckCircle size={32} className="text-sage" />
        </div>
        <div>
          <h3 className="font-serif text-brown text-2xl mb-2">¡Mensaje enviado!</h3>
          <p className="text-brown-muted text-sm max-w-xs mx-auto leading-relaxed">
            Gracias por escribirnos. Te responderemos a la brevedad posible.
          </p>
        </div>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: '', email: '', message: '' });
          }}
          className="btn-ghost text-sm"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-sm font-medium text-brown font-sans">
          Nombre{' '}
          <span className="text-wine" aria-hidden>
            *
          </span>
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          placeholder="Tu nombre completo"
          value={form.name}
          onChange={(e) => {
            setForm({ ...form, name: e.target.value });
            setErrors({ ...errors, name: undefined });
          }}
          className={`input-base ${errors.name ? 'border-wine focus:ring-wine/30' : ''}`}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="text-wine text-xs mt-0.5">
            {errors.name}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-medium text-brown font-sans">
          Email{' '}
          <span className="text-wine" aria-hidden>
            *
          </span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="tu@correo.com"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setErrors({ ...errors, email: undefined });
          }}
          className={`input-base ${errors.email ? 'border-wine focus:ring-wine/30' : ''}`}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p id="email-error" className="text-wine text-xs mt-0.5">
            {errors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="text-sm font-medium text-brown font-sans">
          Mensaje{' '}
          <span className="text-wine" aria-hidden>
            *
          </span>
        </label>
        <textarea
          id="message"
          rows={5}
          placeholder="¿En qué podemos ayudarte?"
          value={form.message}
          onChange={(e) => {
            setForm({ ...form, message: e.target.value });
            setErrors({ ...errors, message: undefined });
          }}
          className={`input-base resize-none min-h-[120px] h-auto ${errors.message ? 'border-wine focus:ring-wine/30' : ''}`}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        {errors.message && (
          <p id="message-error" className="text-wine text-xs mt-0.5">
            {errors.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full justify-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <svg
              className="animate-spin w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
            </svg>
            Enviando...
          </>
        ) : (
          <>
            <Send size={16} />
            Enviar mensaje
          </>
        )}
      </button>
    </form>
  );
}

// ─── Contact Info ─────────────────────────────────────────────────────────────
const INFO_ITEMS = [
  {
    icon: Phone,
    label: 'Teléfono fijo',
    value: '55 5932 6110',
    href: 'tel:+525559326110',
    hint: 'Llámanos directamente',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '56 1497 1795',
    href: 'https://wa.me/5256149717951',
    hint: 'Escríbenos por WhatsApp',
  },
  {
    icon: MapPin,
    label: 'Dirección',
    value: 'Calzada de la Hacienda Mz 23 Lt 9\nOjo de Agua, Tecámac\nEstado de México, C.P. 55770',
    href: null,
    hint: 'Visítanos en persona',
  },
];

// ─── Main Section ─────────────────────────────────────────────────────────────
function ContactSection() {
  return (
    <section className="py-24 bg-beige-light">
      <div className="section-wrapper">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16">
          {/* Form — wider column */}
          <div className="lg:col-span-3">
            <div className="card-gold p-8">
              <h2 className="font-serif text-brown text-2xl mb-1">Envíanos un mensaje</h2>
              <p className="text-brown-muted text-sm mb-7">Te respondemos en menos de 24 horas.</p>
              <ContactForm />
            </div>
          </div>

          {/* Info — narrower column */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h2 className="font-serif text-brown text-2xl mb-1">Información de contacto</h2>
              <p className="text-brown-muted text-sm">
                O escríbenos directamente por los canales que prefieras.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {INFO_ITEMS.map(({ icon: Icon, label, value, href, hint }) => (
                <div
                  key={label}
                  className="flex items-start gap-4 p-5 rounded-xl bg-white border border-beige-dark hover:border-gold/40 transition-all duration-200"
                >
                  <div className="w-10 h-10 rounded-lg bg-wine/8 flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-wine" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-brown-muted font-sans mb-0.5">{label}</p>
                    {href ? (
                      <a
                        href={href}
                        target={href.startsWith('http') ? '_blank' : undefined}
                        rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                        className="text-brown font-medium text-sm hover:text-wine transition-colors duration-150 cursor-pointer break-all"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-brown font-medium text-sm whitespace-pre-line">{value}</p>
                    )}
                    <p className="text-xs text-brown-muted/60 mt-1">{hint}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Hours */}
            <div className="p-5 rounded-xl bg-wine/5 border border-wine/10">
              <h3 className="font-serif text-wine text-base mb-3">Horarios de atención</h3>
              <ul className="flex flex-col gap-1.5 text-sm text-brown-muted">
                <li className="flex justify-between gap-4">
                  <span>Lun – Mar</span>
                  <span className="font-medium text-wine/70">Cerrado</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Miércoles</span>
                  <span className="font-medium text-brown">7:00 – 10:30 pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Jueves</span>
                  <span className="font-medium text-brown">6:00 – 10:30 pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Vie – Sáb</span>
                  <span className="font-medium text-brown">4:00 – 10:30 pm</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Domingo</span>
                  <span className="font-medium text-brown">4:00 – 10:00 pm</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export function Contact() {
  return (
    <>
      <PageHero />
      <ContactSection />
    </>
  );
}
