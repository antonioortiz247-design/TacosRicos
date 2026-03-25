export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <p className="animate-pulse text-sm font-medium text-zinc-600">Preparando tu orden...</p>
      </div>
    </div>
  );
}
