export default function Loading() {
  return (
    <div role="status" aria-label="Carregando" className="animate-pulse pt-28">
      <div className="mx-auto h-[122px] w-[122px] rounded-full bg-neutral-70" />
      <div className="mt-24 h-14 max-w-[722px] rounded bg-neutral-70" />
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="aspect-[3/2] rounded bg-neutral-70" />
        ))}
      </div>
    </div>
  );
}
