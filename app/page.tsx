import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl items-center justify-center p-6">
      <section className="surface-card w-full max-w-md p-8 text-center">
        <img src="/logotacosricos.png" alt="Logo Tacos Rico´s" className="mx-auto h-24 w-24 rounded-3xl border border-amber-200 object-cover shadow-sm" />
        <h1 className="mt-5 text-3xl font-bold tracking-tight text-zinc-900">Tacos Rico´s</h1>
        <p className="mt-2 text-sm text-zinc-600">Pide rápido, personaliza tu orden y confirma por WhatsApp.</p>
        <div className="mt-6">
          <Link href="/demo/menu" className="primary-btn w-full">
            Entrar al menú
          </Link>
        </div>
      </section>
    </main>
  );
}
