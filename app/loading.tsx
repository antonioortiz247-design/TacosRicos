export default function Loading() {
  return (
    <div className="mx-auto grid min-h-screen max-w-6xl place-items-center px-4">
      <div className="w-full max-w-md space-y-4">
        <div className="skeleton h-12 w-48" />
        <div className="surface-card space-y-3 p-5">
          <div className="skeleton h-40 w-full" />
          <div className="skeleton h-5 w-4/5" />
          <div className="skeleton h-4 w-3/5" />
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="skeleton h-11 w-full" />
            <div className="skeleton h-11 w-full" />
          </div>
        </div>
        <p className="text-center text-sm text-ink-600 dark:text-ink-300">Cargando experiencia…</p>
      </div>
    </div>
  );
}
