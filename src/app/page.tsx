import { redirect } from "next/navigation";

// O middleware já redireciona "/"; isto cobre o caso em que ele não roda.
export default function Home() {
  redirect("/meus-projetos");
}
