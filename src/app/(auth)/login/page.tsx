import type { Metadata } from "next";
import LoginForm from "@/components/auth/login-form";
import { safeNextPath } from "@/lib/site-url";

export const metadata: Metadata = { title: "Entrar" };

type Props = { searchParams: Promise<{ next?: string; erro?: string }> };

export default async function LoginPage({ searchParams }: Props) {
  const { next, erro } = await searchParams;
  const safeNext = next ? safeNextPath(next) : undefined;
  return <LoginForm next={safeNext} error={erro} />;
}
