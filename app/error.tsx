'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Podríamos loggear el error a un servicio externo
    console.error('App Error:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-6">
      <div className="surface-card w-full max-w-md p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mt-6 text-xl font-bold text-zinc-900">Algo salió mal</h2>
        <p className="mt-2 text-sm text-zinc-600">
          Hubo un problema al cargar esta página. Ya estamos revisando qué pasó.
        </p>
        <button
          onClick={reset}
          className="primary-btn mt-8 w-full"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
