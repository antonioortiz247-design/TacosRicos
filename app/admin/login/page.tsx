import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { buildPathWithNegocio, normalizeBusinessIdentifier } from '@/lib/business-config';

async function loginAction(formData: FormData) {
  'use server';

  const password = String(formData.get('password') ?? '');
  const negocio = normalizeBusinessIdentifier(String(formData.get('negocio') ?? ''));

  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  if (password !== adminPassword) {
    redirect('/admin/login?error=1');
  }

  cookies().set('admin_session', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  redirect(buildPathWithNegocio('/admin/dashboard', negocio));
}

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string; negocio?: string } }) {
  const hasError = searchParams.error === '1';
  const negocio = normalizeBusinessIdentifier(searchParams.negocio);

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center p-4">
      <section className="glass-effect w-full rounded-2xl p-6 shadow-soft-xl">
        <div className="mb-3 flex items-center gap-3">
          <img src="/logotacosricos.png" alt="Logo tu restaurante app" className="h-12 w-12 rounded-2xl border border-white/60 object-cover shadow-soft dark:border-white/10" />
          <div>
            <h1 className="font-display text-lg font-bold text-ink-900 dark:text-ink-50">Ingreso admin</h1>
            <p className="text-xs text-ink-500 dark:text-ink-300">tu restaurante app</p>
          </div>
        </div>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-300">Ingresa tu contraseña para abrir el dashboard.</p>

        <form action={loginAction} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-ink-700 dark:text-ink-200">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="input-field"
            />
          </div>
          {hasError ? <p className="text-sm text-red-600">Contraseña inválida.</p> : null}
          <button type="submit" className="primary-btn w-full">
            Entrar
          </button>
        </form>
      </section>
    </main>
  );
}
