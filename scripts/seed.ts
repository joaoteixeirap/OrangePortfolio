// Popula o Supabase com 3 perfis fictícios + a conta demo e os projetos deles.
//
//   pnpm seed            -> mostra o que será feito (não altera nada)
//   pnpm seed --yes      -> aplica
//
// Lê NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY e DEMO_PASSWORD do .env.local.
// É idempotente: rodar de novo recria os projetos dessas contas (útil para
// "resetar" a conta demo depois que visitantes mexerem nela).

import { randomBytes } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { createClient, type SupabaseClient, type User } from "@supabase/supabase-js";
import type { Database } from "../src/lib/database.types";
import { DEMO_EMAIL, PEOPLE, type SeedPerson } from "./seed-data";

const BUCKET = "project-covers";
const COVERS_DIR = path.join(process.cwd(), "supabase", "seed", "covers");

function env(name: string) {
  const value = process.env[name];
  if (!value) {
    console.error(`✗ Defina ${name} no .env.local (veja .env.example).`);
    process.exit(1);
  }
  return value;
}

async function findUserByEmail(admin: SupabaseClient<Database>, email: string) {
  for (let page = 1; ; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
    if (found) return found;
    if (data.users.length < 1000) return null;
  }
}

async function ensureUser(admin: SupabaseClient<Database>, person: SeedPerson, demoPassword: string): Promise<User> {
  const existing = await findUserByEmail(admin, person.email);
  const password = person.demo ? demoPassword : randomBytes(24).toString("base64url");
  const user_metadata = { nome: person.nome, sobrenome: person.sobrenome };

  if (existing) {
    // Contas fictícias mantêm a senha aleatória; a demo volta para a senha configurada.
    const { data, error } = await admin.auth.admin.updateUserById(existing.id, {
      ...(person.demo ? { password } : {}),
      email_confirm: true,
      user_metadata,
    });
    if (error) throw error;
    return data.user;
  }

  const { data, error } = await admin.auth.admin.createUser({
    email: person.email,
    password,
    email_confirm: true,
    user_metadata,
  });
  if (error) throw error;
  return data.user;
}

async function clearUserData(admin: SupabaseClient<Database>, userId: string) {
  const { error } = await admin.from("projects").delete().eq("user_id", userId);
  if (error) throw error;

  const { data: files, error: listError } = await admin.storage.from(BUCKET).list(userId, { limit: 1000 });
  if (listError) throw listError;
  if (files.length) {
    const { error: rmError } = await admin.storage.from(BUCKET).remove(files.map((f) => `${userId}/${f.name}`));
    if (rmError) throw rmError;
  }
}

async function seedPerson(admin: SupabaseClient<Database>, person: SeedPerson, demoPassword: string) {
  const user = await ensureUser(admin, person, demoPassword);

  const { error: profileError } = await admin.from("profiles").upsert({
    id: user.id,
    nome: person.nome,
    sobrenome: person.sobrenome,
    pais: person.pais,
  });
  if (profileError) throw profileError;

  await clearUserData(admin, user.id);

  for (const project of person.projects) {
    const file = await readFile(path.join(COVERS_DIR, `${project.slug}.jpg`));
    const coverPath = `${user.id}/seed-${project.slug}.jpg`;
    const { error: uploadError } = await admin.storage.from(BUCKET).upload(coverPath, file, {
      contentType: "image/jpeg",
      cacheControl: "31536000",
      upsert: true,
    });
    if (uploadError) throw uploadError;
    const coverUrl = admin.storage.from(BUCKET).getPublicUrl(coverPath).data.publicUrl;

    const createdAt = new Date(Date.now() - project.daysAgo * 24 * 60 * 60 * 1000).toISOString();
    const { error } = await admin.from("projects").insert({
      user_id: user.id,
      title: project.title,
      description: project.description,
      tags: project.tags,
      link: project.link,
      cover_url: coverUrl,
      created_at: createdAt,
    });
    if (error) throw error;
  }

  console.log(`✓ ${person.nome} ${person.sobrenome} <${person.email}> — ${person.projects.length} projetos`);
}

async function main() {
  const url = env("NEXT_PUBLIC_SUPABASE_URL");
  const secret = env("SUPABASE_SECRET_KEY");
  const demoPassword = env("DEMO_PASSWORD");
  if (demoPassword.length < 6) {
    console.error("✗ DEMO_PASSWORD precisa ter pelo menos 6 caracteres.");
    process.exit(1);
  }

  const total = PEOPLE.reduce((n, p) => n + p.projects.length, 0);
  console.log(`Projeto Supabase: ${url}`);
  console.log(`Contas: ${PEOPLE.map((p) => p.email).join(", ")}`);
  console.log(`Projetos: ${total} (os projetos atuais dessas contas serão substituídos)\n`);

  if (!process.argv.includes("--yes")) {
    console.log("Nada foi alterado. Para aplicar, rode: pnpm seed --yes");
    return;
  }

  const admin = createClient<Database>(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  for (const person of PEOPLE) {
    await seedPerson(admin, person, demoPassword);
  }

  console.log(`\nPronto. Conta demo: ${DEMO_EMAIL} (senha definida em DEMO_PASSWORD).`);
}

main().catch((err) => {
  console.error("✗ Falha no seed:", err?.message ?? err);
  process.exit(1);
});
