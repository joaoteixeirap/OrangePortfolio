import Image from "next/image";
import Link from "next/link";

type AuthLayoutProps = {
  illustration: "login" | "cadastro";
  notice?: React.ReactNode;
  children: React.ReactNode;
};

const illustrations = {
  login: { src: "/img_login.png", width: 525, height: 832 },
  cadastro: { src: "/img_cadastro.png", width: 549, height: 832 },
} as const;

/** Ilustração à esquerda (só no desktop) e formulário centralizado à direita. */
export default function AuthLayout({ illustration, notice, children }: AuthLayoutProps) {
  const img = illustrations[illustration];
  return (
    <div className="flex min-h-dvh bg-white">
      <div className="relative hidden h-dvh shrink-0 lg:block">
        <Image
          src={img.src}
          width={img.width}
          height={img.height}
          alt=""
          priority
          className="h-full w-auto object-cover object-left"
        />
      </div>
      <main className="relative flex flex-1 flex-col items-center justify-start px-6 pb-16 pt-28 sm:px-10 lg:justify-center lg:py-16">
        <div
          className="absolute inset-x-6 top-6 flex justify-center sm:top-10 lg:top-[7%]"
          aria-live="polite"
        >
          {notice}
        </div>
        <div className="w-full max-w-[517px] animate-fade-in-up">{children}</div>
        <footer className="absolute inset-x-0 bottom-4 text-center text-sm">
          <Link href="/privacidade" className="rounded text-neutral-100 hover:text-neutral-110 hover:underline">
            Política de privacidade
          </Link>
        </footer>
      </main>
    </div>
  );
}
