import { useState } from 'react';
import { ShoppingBag, ArrowRight, Info, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryId = 'normal' | 'doble' | 'casa' | 'light';
type ProteinId = 'res' | 'pollo' | 'portobello' | 'camaron-salmon';
type FormatId = 'normal' | 'extremo' | 'torre';
type SpiceLevel = 'mild' | 'medium' | 'hot' | 'extra-hot';

interface FormatOption {
  id: FormatId;
  label: string;
  price: number;
}
interface ProteinOption {
  id: ProteinId;
  label: string;
  emoji: string;
  price?: number;
  formats?: FormatOption[];
  defaultFlavors?: string[];
}
interface CategoryDef {
  id: CategoryId;
  label: string;
  desc: string;
  emoji: string;
  note?: string;
  proteins: ProteinOption[];
}
interface PapaItem {
  id: string;
  name: string;
  desc: string;
  price: number | null;
  priceLabel?: string;
}
interface OtroItem {
  id: string;
  name: string;
  desc: string;
  price: number | null;
}
interface FlavorItem {
  id: string;
  name: string;
  desc: string;
  spice?: SpiceLevel;
}

// ─── Salsas ───────────────────────────────────────────────────────────────────

const FLAVORS: FlavorItem[] = [
  {
    id: 'habanero-extremo',
    name: 'Habanero Extremo',
    desc: 'Solo para gente que le gusten las emociones fuertes.',
    spice: 'extra-hot',
  },
  {
    id: 'habanero',
    name: 'Habanero',
    desc: 'Combinada con la variedad de chile habanero.',
    spice: 'hot',
  },
  { id: 'diabla', name: 'Diabla', desc: 'Elaborada con chipotle.', spice: 'medium' },
  { id: 'tamarindo', name: 'Tamarindo', desc: 'Salsa sabor tamarindo.' },
  { id: 'bbq', name: 'BBQ', desc: 'Sabor con un toque agridulce.' },
  { id: 'cilantro', name: 'Cilantro', desc: 'Elaborada con cilantro.' },
  { id: 'chimi', name: 'Chimi', desc: 'Elaborada con una combinación de hierbas finas.' },
  { id: 'mojo', name: 'Mojo', desc: 'Una combinación especial de la casa.' },
  {
    id: 'torre-pizza',
    name: 'Torre Pizza',
    desc: 'Elaborada con una salsa italiana acompañada de queso parmesano y gouda.',
  },
];

// ─── Menu Data ────────────────────────────────────────────────────────────────

const CATEGORIES: CategoryDef[] = [
  {
    id: 'normal',
    label: 'Hamburguesa',
    desc: 'La clásica. Elige proteína y sabores a tu gusto.',
    emoji: '🍔',
    proteins: [
      {
        id: 'res',
        label: 'Res',
        emoji: '🥩',
        formats: [
          { id: 'normal', label: 'Normal', price: 85 },
          { id: 'extremo', label: 'Extremo', price: 90 },
          { id: 'torre', label: 'Torre', price: 100 },
        ],
      },
      {
        id: 'pollo',
        label: 'Pollo',
        emoji: '🍗',
        formats: [
          { id: 'normal', label: 'Normal', price: 90 },
          { id: 'extremo', label: 'Extremo', price: 95 },
          { id: 'torre', label: 'Torre', price: 105 },
        ],
      },
      {
        id: 'portobello',
        label: 'Portobello',
        emoji: '🍄',
        price: 90,
        defaultFlavors: ['Chimi', 'Mojo'],
      },
      {
        id: 'camaron-salmon',
        label: 'Camarón / Salmón',
        emoji: '🦐',
        price: 135,
        defaultFlavors: ['Mojo', 'Diabla'],
      },
    ],
  },
  {
    id: 'doble',
    label: 'Doble',
    desc: 'Doble proteína, doble queso, doble sabor.',
    emoji: '🍔',
    proteins: [
      { id: 'res', label: 'Res', emoji: '🥩', price: 125 },
      { id: 'pollo', label: 'Pollo', emoji: '🍗', price: 130 },
      {
        id: 'portobello',
        label: 'Portobello',
        emoji: '🍄',
        price: 130,
        defaultFlavors: ['Chimi', 'Mojo'],
      },
      {
        id: 'camaron-salmon',
        label: 'Camarón / Salmón',
        emoji: '🦐',
        price: 220,
        defaultFlavors: ['Mojo', 'Diabla'],
      },
    ],
  },
  {
    id: 'casa',
    label: 'De la Casa',
    desc: 'Con portobello incluido y sabores de la casa.',
    emoji: '⭐',
    note: 'Siempre incluye hongo portobello',
    proteins: [
      {
        id: 'res',
        label: 'Res',
        emoji: '🥩',
        price: 135,
        defaultFlavors: ['Habanero', 'Mojo', 'Chimi'],
      },
      {
        id: 'pollo',
        label: 'Pollo',
        emoji: '🍗',
        price: 140,
        defaultFlavors: ['Habanero', 'Mojo', 'Chimi'],
      },
      {
        id: 'camaron-salmon',
        label: 'Camarón / Salmón',
        emoji: '🦐',
        price: 160,
        defaultFlavors: ['Chimi', 'Mojo', 'Diabla'],
      },
    ],
  },
  {
    id: 'light',
    label: 'Light',
    desc: 'Sin pan, en cama de lechuga.',
    emoji: '🥗',
    proteins: [
      { id: 'res', label: 'Res', emoji: '🥩', price: 90 },
      { id: 'pollo', label: 'Pollo', emoji: '🍗', price: 95 },
      {
        id: 'portobello',
        label: 'Portobello',
        emoji: '🍄',
        price: 95,
        defaultFlavors: ['Chimi', 'Mojo'],
      },
      {
        id: 'camaron-salmon',
        label: 'Camarón / Salmón',
        emoji: '🦐',
        price: 115,
        defaultFlavors: ['Mojo', 'Diabla'],
      },
    ],
  },
];

const PAPAS: PapaItem[] = [
  {
    id: 'francesa-regular',
    name: 'Papas a la Francesa',
    desc: '180g de papas fritas.',
    price: 40,
    priceLabel: '180g',
  },
  {
    id: 'francesa-queso',
    name: 'Papas a la Francesa con Queso',
    desc: '180g con queso fundido.',
    price: 50,
    priceLabel: '+ queso',
  },
  {
    id: 'italianas-1',
    name: 'Papas Italianas',
    desc: 'Con 1 sabor a tu elección.',
    price: 45,
    priceLabel: '1 sabor',
  },
  {
    id: 'italianas-2',
    name: 'Papas Italianas',
    desc: 'Con 2 sabores a tu elección.',
    price: 50,
    priceLabel: '2 sabores',
  },
  { id: 'casa', name: 'Papas de la Casa', desc: 'Con Mojo y Cilantro.', price: 50 },
  {
    id: 'canica',
    name: 'Papas Canica',
    desc: '6 piezas rellenas de cheddar y jalapeño.',
    price: null,
  },
];

const OTROS: OtroItem[] = [
  { id: 'banderillas', name: 'Banderillas', desc: 'Consulta disponibilidad.', price: null },
  { id: 'hot-dogs', name: 'Hot Dogs', desc: 'Consulta disponibilidad.', price: null },
  { id: 'nuggets', name: 'Nuggets', desc: 'Consulta disponibilidad.', price: null },
  { id: 'bebidas', name: 'Bebidas', desc: 'Consulta opciones disponibles.', price: null },
  { id: 'extras', name: 'Extras', desc: 'Ingredientes adicionales a tu elección.', price: null },
];

const PROTEIN_GRADIENTS: Record<ProteinId, string> = {
  res: 'linear-gradient(135deg, #4A1A10 0%, #6B2A1A 100%)',
  pollo: 'linear-gradient(135deg, #3D2A0A 0%, #5A3E10 100%)',
  portobello: 'linear-gradient(135deg, #2A2010 0%, #3D2D15 100%)',
  'camaron-salmon': 'linear-gradient(135deg, #0A2030 0%, #153040 100%)',
};

const SPICE_LABELS: Record<SpiceLevel, { label: string; color: string }> = {
  mild: { label: 'Suave', color: 'text-sage' },
  medium: { label: 'Medio', color: 'text-gold' },
  hot: { label: 'Picante', color: 'text-wine' },
  'extra-hot': { label: 'Muy picante', color: 'text-red-600' },
};

// ─── Page Hero ────────────────────────────────────────────────────────────────

function PageHero() {
  return (
    <section
      className="pt-32 pb-16"
      style={{ background: 'linear-gradient(160deg, #5A1F1B 0%, #3D1412 100%)' }}
    >
      <div className="section-wrapper text-center">
        <p className="text-gold/70 text-xs font-sans font-semibold tracking-[0.2em] uppercase mb-3">
          Nuestras creaciones
        </p>
        <h1
          className="font-serif text-beige-light mb-4"
          style={{ fontSize: 'clamp(2.2rem, 5vw, 3.5rem)' }}
        >
          El <span className="text-gold italic">Menú</span>
        </h1>
        <p className="text-beige/60 max-w-md mx-auto text-base font-sans leading-relaxed">
          Proteínas frescas, salsas propias y preparación al momento.
        </p>
      </div>
    </section>
  );
}

// ─── Catalog Components ───────────────────────────────────────────────────────

function PriceRange({ protein }: { protein: ProteinOption }) {
  if (protein.formats) {
    const min = Math.min(...protein.formats.map((f) => f.price));
    const max = Math.max(...protein.formats.map((f) => f.price));
    return (
      <div className="flex flex-col items-end">
        <span className="text-wine font-bold font-sans text-base">
          ${min} – ${max}
        </span>
        <span className="text-brown-muted/60 text-[11px] font-sans">según tamaño</span>
      </div>
    );
  }
  return <span className="text-wine font-bold font-sans text-base">${protein.price}</span>;
}

function CatalogProteinCard({ protein }: { protein: ProteinOption }) {
  return (
    <article className="card-gold overflow-hidden flex flex-col">
      <div
        className="h-36 flex items-center justify-center"
        style={{ background: PROTEIN_GRADIENTS[protein.id] }}
      >
        <span className="text-5xl opacity-25 select-none">{protein.emoji}</span>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{protein.emoji}</span>
            <h3 className="font-serif text-brown text-lg leading-tight">{protein.label}</h3>
          </div>
          <PriceRange protein={protein} />
        </div>

        {protein.formats && (
          <div className="flex flex-wrap gap-1.5">
            {protein.formats.map((f) => (
              <span
                key={f.id}
                className="text-xs px-2.5 py-1 rounded-full bg-beige border border-beige-dark text-brown-muted font-sans"
              >
                {f.label} <span className="text-wine font-medium">${f.price}</span>
              </span>
            ))}
          </div>
        )}

        {protein.defaultFlavors && (
          <div>
            <p className="text-[11px] text-brown-muted/60 font-sans mb-1.5 uppercase tracking-wide">
              Incluye
            </p>
            <div className="flex flex-wrap gap-1">
              {protein.defaultFlavors.map((f) => (
                <span
                  key={f}
                  className="text-xs px-2 py-0.5 rounded-full bg-gold/15 text-wine border border-gold/20 font-sans"
                >
                  {f}
                </span>
              ))}
            </div>
          </div>
        )}

        {!protein.defaultFlavors && (
          <p className="text-xs text-brown-muted/60 font-sans">
            <span className="text-wine">*</span> Elige tus salsas al ordenar
          </p>
        )}
      </div>
    </article>
  );
}

function CatalogSection({ category }: { category: CategoryDef }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-2xl">{category.emoji}</span>
        <div>
          <h2 className="font-serif text-brown text-2xl leading-tight">{category.label}</h2>
          <p className="text-brown-muted/70 text-sm font-sans">{category.desc}</p>
        </div>
        <div className="flex-1 h-px bg-gold/20 ml-2" />
      </div>

      {category.note && (
        <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-lg px-4 py-2.5 mb-5 w-fit">
          <Info size={14} className="text-gold shrink-0" />
          <p className="text-brown-muted text-xs font-sans">{category.note}</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        {category.proteins.map((protein) => (
          <CatalogProteinCard key={protein.id} protein={protein} />
        ))}
      </div>
    </div>
  );
}

function PapaCard({ item }: { item: PapaItem }) {
  return (
    <article className="card-gold p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center shrink-0 text-lg">
        🍟
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-brown text-base leading-tight">{item.name}</h3>
          <div className="text-right shrink-0">
            {item.price !== null ? (
              <span className="text-wine font-bold font-sans">${item.price}</span>
            ) : (
              <span className="text-brown-muted/60 text-xs font-sans italic">Consultar</span>
            )}
            {item.priceLabel && (
              <p className="text-[11px] text-brown-muted/60 font-sans">{item.priceLabel}</p>
            )}
          </div>
        </div>
        <p className="text-brown-muted text-xs leading-relaxed">{item.desc}</p>
      </div>
    </article>
  );
}

function OtroCard({ item }: { item: OtroItem }) {
  return (
    <article className="card-gold p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-beige border border-beige-dark flex items-center justify-center shrink-0 text-lg">
        🍽
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-serif text-brown text-base leading-tight">{item.name}</h3>
          <span className="text-brown-muted/60 text-xs font-sans italic shrink-0">Consultar</span>
        </div>
        <p className="text-brown-muted text-xs leading-relaxed">{item.desc}</p>
      </div>
    </article>
  );
}

function FlavorCard({ flavor }: { flavor: FlavorItem }) {
  const spice = flavor.spice ? SPICE_LABELS[flavor.spice] : null;
  return (
    <article className="card-gold p-5 flex items-start gap-4">
      <div className="w-10 h-10 rounded-lg bg-wine/8 flex items-center justify-center shrink-0">
        {flavor.spice ? (
          <Flame
            size={18}
            className={flavor.spice === 'extra-hot' ? 'text-red-500' : 'text-wine'}
            strokeWidth={1.5}
          />
        ) : (
          <span className="text-lg">🍶</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <h3 className="font-serif text-brown text-base leading-tight">{flavor.name}</h3>
          {spice && (
            <span className={`text-[11px] font-sans font-medium ${spice.color}`}>
              {spice.label}
            </span>
          )}
        </div>
        <p className="text-brown-muted text-xs leading-relaxed">{flavor.desc}</p>
      </div>
    </article>
  );
}

// ─── Catalog ──────────────────────────────────────────────────────────────────

type CatalogFilter = 'all' | 'hamburguesas' | 'salsas' | 'papas' | 'otros';

function CatalogMode() {
  const [filter, setFilter] = useState<CatalogFilter>('all');

  const pills: { id: CatalogFilter; label: string }[] = [
    { id: 'all', label: 'Todo' },
    { id: 'salsas', label: '🍶 Salsas' },
    { id: 'hamburguesas', label: '🍔 Hamburguesas' },
    { id: 'papas', label: '🍟 Papas' },
    { id: 'otros', label: '🍽 Otros' },
  ];

  return (
    <div>
      {/* Filter pills */}
      <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 -mx-1 px-1">
        {pills.map((p) => (
          <button
            key={p.id}
            onClick={() => setFilter(p.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer border ${
              filter === p.id
                ? 'bg-wine text-beige-light border-wine'
                : 'bg-white text-brown-muted border-beige-dark hover:border-gold hover:text-wine'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-14">
        {/* Salsas — primero porque es el diferenciador del negocio */}
        {(filter === 'all' || filter === 'salsas') && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🍶</span>
              <div>
                <h2 className="font-serif text-brown text-2xl">Salsas</h2>
                <p className="text-brown-muted/70 text-sm font-sans">Todas elaboradas en casa.</p>
              </div>
              <div className="flex-1 h-px bg-gold/20 ml-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {FLAVORS.map((flavor) => (
                <FlavorCard key={flavor.id} flavor={flavor} />
              ))}
            </div>
          </div>
        )}

        {/* Burger sections */}
        {(filter === 'all' || filter === 'hamburguesas') &&
          CATEGORIES.map((cat) => <CatalogSection key={cat.id} category={cat} />)}

        {/* Papas */}
        {(filter === 'all' || filter === 'papas') && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🍟</span>
              <div>
                <h2 className="font-serif text-brown text-2xl">Papas</h2>
                <p className="text-brown-muted/70 text-sm font-sans">
                  Crujientes, cargadas o a la italiana.
                </p>
              </div>
              <div className="flex-1 h-px bg-gold/20 ml-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {PAPAS.map((item) => (
                <PapaCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}

        {/* Otros */}
        {(filter === 'all' || filter === 'otros') && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl">🍽</span>
              <div>
                <h2 className="font-serif text-brown text-2xl">Otros</h2>
                <p className="text-brown-muted/70 text-sm font-sans">
                  Consulta precios directamente.
                </p>
              </div>
              <div className="flex-1 h-px bg-gold/20 ml-2" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {OTROS.map((item) => (
                <OtroCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* CTA */}
      <div className="mt-16 text-center py-10 rounded-2xl bg-white border border-beige-dark">
        <p className="font-serif text-brown text-xl mb-2">¿Listo para ordenar?</p>
        <p className="text-brown-muted text-sm mb-6 max-w-xs mx-auto">
          Escríbenos por WhatsApp o visítanos directamente.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://wa.me/5256149717951"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
          >
            <ShoppingBag size={15} />
            Pedir por WhatsApp
          </a>
          <Link to="/contacto" className="btn-secondary">
            Más info
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export function Menu() {
  return (
    <>
      <PageHero />
      <section className="py-16 bg-beige-light">
        <div className="section-wrapper">
          <CatalogMode />
        </div>
      </section>
    </>
  );
}
