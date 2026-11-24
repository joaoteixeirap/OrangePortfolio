import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <p className="text-6xl font-light text-secondary-100">404</p>
      <h1 className="text-2xl text-principal-90">Página não encontrada</h1>
      <Link
        href="/meus-projetos"
        className="rounded bg-secondary-100 px-6 py-2.5 text-[15px] font-medium uppercase tracking-wide text-white hover:bg-secondary-110"
      >
        Voltar para projetos
      </Link>
    </main>
  );
}
