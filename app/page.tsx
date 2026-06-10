import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, QrCode, Sparkles, Zap, ShieldCheck, Smartphone, BadgeCheck, Utensils, Salad, Flame, Coffee, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const defaultSlug = process.env.NEXT_PUBLIC_DEFAULT_BUSINESS_SLUG || 'tu-restaurante';

  const categories = [
    { label: 'Tacos', icon: Flame },
    { label: 'Especialidades', icon: Utensils },
    { label: 'Veggie', icon: Salad },
    { label: 'Bebidas', icon: Coffee }
  ];

  const featured = [
    { title: 'Taco insignia', subtitle: 'Dorado perfecto y salsas top', price: '$32', image: '/TacodeSuadero.png' },
    { title: 'Burrito premium', subtitle: 'Proteína a elección + extras', price: '$100', image: '/TacodePechuga.png' },
    { title: 'Campechano', subtitle: 'Sabor intenso + textura', price: '$32', image: '/TacoCampechano.jpg' }
  ];

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-10">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
            <Image src="/logotacosricos.png" alt="tu restaurante app" fill className="object-cover" priority />
          </div>
          <div className="leading-tight">
            <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">tu restaurante app</p>
            <p className="text-xs text-ink-500 dark:text-ink-300">food-tech · menú QR interactivo</p>
          </div>
        </div>
        <Link href="/admin/login" className="secondary-btn px-4 py-2 text-xs sm:text-sm">
          Admin
          <ChevronRight size={16} />
        </Link>
      </header>

      <section className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center">
        <div className="surface-card p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="pill">
              <QrCode size={12} className="text-brand-600 dark:text-brand-500" />
              QR Menú
            </span>
            <span className="pill">
              <Sparkles size={12} className="text-accent-600 dark:text-accent-500" />
              Premium
            </span>
            <span className="pill">
              <Zap size={12} className="text-brand-600 dark:text-brand-500" />
              Rápido
            </span>
          </div>

          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-ink-900 sm:text-5xl dark:text-ink-50">
            Menús interactivos,
            <span className="block bg-gradient-to-r from-brand-500 via-brand-600 to-accent-500 bg-clip-text text-transparent">
              experiencias deliciosas.
            </span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-relaxed text-ink-600 dark:text-ink-200">
            Convierte tu menú en una experiencia móvil premium: categorías claras, fotos dominantes, personalización y flujo de pedido con admin en tiempo real.
          </p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            <Link href={`/${defaultSlug}/menu`} className="primary-btn w-full">
              Abrir demo
              <ArrowRight size={18} />
            </Link>
            <Link href="/admin/login" className="secondary-btn w-full">
              Entrar al admin
              <ShieldCheck size={18} />
            </Link>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Mobile-first</p>
              <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">UI táctil rápida, lista para QR</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Realtime</p>
              <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">Pedidos y estados en vivo</p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/60 p-4 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Personalizable</p>
              <p className="mt-1 text-xs text-ink-600 dark:text-ink-300">Toppings, notas y variantes</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="surface-card overflow-hidden p-0">
            <div className="relative aspect-[4/3] w-full">
              <Image src="/TacodePechuga.jpg" alt="Demo" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 500px" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-white">Demo interactiva</p>
                  <p className="text-xs text-white/80">Diseño tipo Uber Eats + Stripe</p>
                </div>
                <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  QR ready
                </span>
              </div>
            </div>
          </div>

          <div className="surface-card">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
                <Smartphone size={18} />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Diseño QR-friendly</p>
                <p className="text-xs text-ink-600 dark:text-ink-300">Categorías, imágenes, y CTA claros</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">Categorías</h2>
          <Link href={`/${defaultSlug}/menu`} className="text-xs font-bold text-brand-600 hover:underline dark:text-brand-500">
            Ver menú
          </Link>
        </div>
        <div className="mt-3 flex gap-3 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.label}
                href={`/${defaultSlug}/menu`}
                className="group flex min-w-[170px] items-center gap-3 rounded-2xl border border-white/70 bg-white/60 px-4 py-3 shadow-soft backdrop-blur transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/80 dark:border-white/10 dark:bg-white/5"
              >
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-ink-950/5 text-brand-600 transition-all duration-300 group-hover:scale-105 dark:bg-white/10 dark:text-brand-500">
                  <Icon size={18} />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-display text-sm font-bold text-ink-900 dark:text-ink-50">{cat.label}</p>
                  <p className="text-xs text-ink-600 dark:text-ink-300">Explorar</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">Platillos destacados</h2>
          <span className="pill">
            <BadgeCheck size={12} className="text-accent-600 dark:text-accent-500" />
            seleccionados
          </span>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((item) => (
            <article key={item.title} className="surface-card group overflow-hidden p-0">
              <div className="relative aspect-[4/3] w-full overflow-hidden">
                <Image src={item.image} alt={item.title} fill className="object-cover transition-all duration-300 group-hover:scale-105" sizes="(max-width: 1024px) 100vw, 360px" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950/55 via-transparent to-transparent" />
                <div className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white backdrop-blur">
                  recomendado
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-display text-base font-bold text-ink-900 dark:text-ink-50">{item.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-ink-600 dark:text-ink-300">{item.subtitle}</p>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 px-3 py-1.5 font-display text-sm font-bold text-white shadow-soft">
                    {item.price}
                  </div>
                </div>
                <Link href={`/${defaultSlug}/menu`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-ink-950 px-4 py-3 font-display text-sm font-bold text-white transition-all duration-300 hover:scale-[1.01] hover:bg-ink-900 active:scale-[0.98] dark:bg-white/10 dark:text-ink-50 dark:hover:bg-white/15">
                  Ver en menú
                  <ArrowRight size={18} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-3">
        <div className="surface-card">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white shadow-soft">
              <Zap size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Checkout rápido</p>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Carrito persistente, CTA claros y flujo sin fricción.</p>
            </div>
          </div>
        </div>
        <div className="surface-card">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-accent-500 to-accent-600 text-white shadow-soft">
              <ShieldCheck size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Panel admin</p>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Pedidos en vivo, cocina/mesero y editor de precios.</p>
            </div>
          </div>
        </div>
        <div className="surface-card">
          <div className="flex items-start gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-white shadow-soft">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="font-display text-sm font-bold text-ink-900 dark:text-ink-50">Experiencia premium</p>
              <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">UI moderna, dark mode elegante y microinteracciones suaves.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-12 rounded-2xl border border-white/60 bg-white/60 p-6 shadow-soft backdrop-blur dark:border-white/10 dark:bg-white/5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-display text-base font-bold text-ink-900 dark:text-ink-50">tu restaurante app</p>
            <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Menús interactivos, experiencias deliciosas.</p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <Link href={`/${defaultSlug}/menu`} className="primary-btn px-5 py-3 text-sm">
              Abrir demo
              <ArrowRight size={18} />
            </Link>
            <Link href="/admin/login" className="secondary-btn px-5 py-3 text-sm">
              Admin
            </Link>
          </div>
        </div>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/60 pt-4 text-xs text-ink-500 dark:border-white/10 dark:text-ink-300">
          <span>© 2026 tu restaurante app</span>
          <span className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1">
              <QrCode size={14} />
              QR
            </span>
            <span className="inline-flex items-center gap-1">
              <Zap size={14} />
              realtime
            </span>
          </span>
        </div>
      </footer>
    </main>
  );
}
