import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function loginAction(formData: FormData) {
  'use server';

  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');

  const adminUser = process.env.ADMIN_USER ?? 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD ?? 'admin123';

  if (username !== adminUser || password !== adminPassword) {
    redirect('/admin/login?error=1');
  }

  cookies().set('admin_session', '1', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  });

  redirect('/admin/dashboard');
}

export default async function AdminLoginPage({ searchParams }: { searchParams: { error?: string } }) {
  const hasError = searchParams.error === '1';

  return (
    <main className="mx-auto grid min-h-screen max-w-md place-items-center p-4">
      <section className="w-full rounded-2xl border bg-white p-6 shadow-sm dark:bg-zinc-900">
        <h1 className="text-xl font-bold text-warm-700">Ingreso admin</h1>
        <p className="mt-1 text-sm text-zinc-500">Inicia sesión para abrir el dashboard del dueño.</p>

        <form action={loginAction} className="mt-4 space-y-3">
          <div>
            <label className="mb-1 block text-sm font-medium">Usuario</label>
            <input name="username" required className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Contraseña</label>
            <input
              name="password"
              type="password"
              required
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          {hasError ? <p className="text-sm text-red-600">Usuario o contraseña inválidos.</p> : null}
          <button type="submit" className="w-full rounded-lg bg-warm-500 px-3 py-2 text-sm font-semibold text-white">
            Entrar al dashboard
          </button>
        </form>
      </section>
    </main>
  );
}
