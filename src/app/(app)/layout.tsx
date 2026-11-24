import AppHeader from "@/components/header/app-header";
import { getMyProfile, requireUser } from "@/lib/queries";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [user, profile] = await Promise.all([requireUser(), getMyProfile()]);

  return (
    <>
      <a
        href="#conteudo"
        className="sr-only z-50 rounded bg-white px-4 py-2 text-principal-100 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <AppHeader
        user={{
          nome: profile.nome,
          sobrenome: profile.sobrenome,
          avatar_url: profile.avatar_url,
          email: user.email,
        }}
      />
      <main id="conteudo" className="mx-auto w-full max-w-[1440px] px-6 pb-20 lg:px-14">
        {children}
      </main>
    </>
  );
}
