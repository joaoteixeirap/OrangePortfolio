<div align="center">

# 🍊 Orange Portfólio

**Seu portfólio de projetos, num lugar só.**

Plataforma em que a pessoa desenvolvedora cadastra, organiza e mostra os projetos que já fez, e descobre o que a comunidade anda construindo.

![1º lugar](https://img.shields.io/badge/🏆_1º_lugar-Hackathon_Unisanta_+_FCamara_2024-FF5522?style=for-the-badge)

[![Abrir o app](https://img.shields.io/badge/Abrir_o_app-orangeportfolio--alpha.vercel.app-FF5522?style=for-the-badge)](https://orangeportfolio-alpha.vercel.app)

![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Material UI](https://img.shields.io/badge/Material_UI_7-007FFF?style=flat-square&logo=mui&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

<table>
<tr>
<td align="center" width="50%"><img src="https://github.com/user-attachments/assets/112897a5-f4a5-4b08-bec4-2306d419649f" alt="Descobrir: projetos de toda a comunidade" /><br /><sub><b>Descobrir: projetos de toda a comunidade</b></sub></td>
<td align="center" width="50%"><img src="https://github.com/user-attachments/assets/49d48dc6-5b59-43e5-9646-2ba84a6d7c44" alt="Visualização do projeto, com autor e tags" /><br /><sub><b>Visualização do projeto, com autor e tags</b></sub></td>
</tr>
<tr>
<td align="center" width="50%"><img src="https://github.com/user-attachments/assets/47726f9b-86bf-4bbc-9ca3-a7d89bb09b59" alt="Meus projetos" /><br /><sub><b>Meus projetos</b></sub></td>
<td align="center" width="50%"><img src="https://github.com/user-attachments/assets/d27c43b5-3caf-4155-beaf-17530843ac30" alt="Adicionar projeto com upload da capa" /><br /><sub><b>Adicionar projeto com upload da capa</b></sub></td>
</tr>
</table>

## 🧪 Teste você mesmo

Entre em **[orangeportfolio-alpha.vercel.app](https://orangeportfolio-alpha.vercel.app)** com a conta de demonstração:

| E-mail | Senha |
|---|---|
| `demo@orangeportfolio.dev` | `OrangeDemo2024` |

Ou crie a sua conta com e-mail ou com o Google.

---

## 🏆 O hackathon

O desafio foi proposto pela **FCamara** e pela **Orange Juice**, comunidade de tecnologia nascida no Programa de Formação da FCamara, no Hackathon da Universidade Santa Cecília (Unisanta) de 2024.

> **O desafio:** desenvolver uma aplicação navegável e responsiva, o Orange Portfólio, em que as pessoas usuárias cadastram e exibem os projetos que desenvolveram. A interface já vinha pronta no Figma, em Material Design, nas versões desktop e mobile, e o resultado seria comparado com o protótipo.

Seis equipes disputaram: TDD, Gentleman's, Filhos do LA, **Bugs Busters**, Peopleware Champions e JavaLi.

**A Bugs Busters ficou em 1º lugar.** Cada integrante ganhou uma licença de 3 meses da Udemy.

## ✨ O que dá para fazer

| | Funcionalidade | Como funciona |
|---|---|---|
| 🔐 | **Cadastro e login** | Com e-mail e senha ou com o Google, e rotas protegidas para quem não está logado |
| 🗂️ | **Meus projetos** | Perfil com avatar, nome e país, e a lista dos seus projetos |
| ➕ | **Adicionar e editar** | Modal com título, tags, link, descrição e upload da imagem de capa |
| 🗑️ | **Excluir** | Com confirmação antes de apagar |
| 🔎 | **Descobrir** | Projetos de toda a comunidade, com busca por tags |
| 👀 | **Visualizar** | Modal com o projeto completo, autor, data e tags |
| 📱 | **Responsivo** | Desktop e mobile, seguindo o protótipo do Figma |

## 🔄 Do hackathon à v2

O projeto do hackathon foi apresentado com React, Tailwind CSS e Java Spring Boot, mas ficou incompleto e a demo saiu do ar. Em 2026, a v2 terminou o que faltava, com vibe coding usando **Claude Code**:

| | Hackathon (2024) | v2 (2026) |
|---|---|---|
| **Backend** | Incompleto | Supabase: Postgres, autenticação e armazenamento de imagens |
| **Segurança** | Sem regras de acesso | RLS: todo mundo vê os projetos, mas só a dona edita e apaga os seus |
| **Login** | E-mail e senha | E-mail e senha + Google |
| **Visual** | Inspirado no Figma | Ajustado para seguir o protótipo de perto |
| **Dados** | Vazio | 3 perfis e 12 projetos de exemplo, com capas, para a tela Descobrir não abrir vazia |
| **Demo** | Fora do ar | No ar na Vercel, com conta de demonstração |

## 🚀 Próximos passos

Os planos futuros apresentados no pitch:

- ✅ **Autenticação por outros serviços e redes sociais:** o login com Google já entrou na v2.
- ⬜ **Colaboração entre usuários:** projetos feitos a várias mãos, com coautoria.
- ⬜ **Contratação de freelancers:** quem visita o portfólio pode chamar a pessoa para um trabalho.

<!--TEAM-->

---

<details>
<summary><b>👩‍💻 Para desenvolvedores: rodar o projeto</b></summary>

### Pré-requisitos

- Node.js 20+
- pnpm
- Um projeto no [Supabase](https://supabase.com) (o plano grátis basta)

### Rodar localmente

```bash
git clone https://github.com/joaoteixeirap/OrangePortfolio.git
cd OrangePortfolio
pnpm install
cp .env.example .env.local # preencha com os dados do seu projeto Supabase
pnpm dev                   # http://localhost:3000
```

### Variáveis de ambiente

| Variável | Para que serve |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL do projeto Supabase |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Chave pública (o acesso é limitado pelo RLS) |
| `NEXT_PUBLIC_SITE_URL` | URL do site, usada nos links de confirmação de e-mail |
| `SUPABASE_SECRET_KEY` | Chave secreta, usada **só** pelo script de seed. Nunca no front nem na Vercel |
| `DEMO_PASSWORD` | Senha da conta de demonstração criada pelo seed |

### Banco de dados

As migrações ficam em `supabase/migrations` (tabelas `profiles` e `projects`, políticas de RLS e o bucket `project-covers`). Aplique com a CLI do Supabase e depois popule com os dados de exemplo:

```bash
supabase db push
pnpm seed
```

### Comandos

| Comando | O que faz |
|---|---|
| `pnpm dev` | servidor de desenvolvimento |
| `pnpm build` / `pnpm start` | build e servidor de produção |
| `pnpm lint` | ESLint |
| `pnpm typecheck` | checagem de tipos do TypeScript |
| `pnpm seed` | cria a conta demo, os perfis e os projetos de exemplo |
| `pnpm seed:covers` | gera as imagens de capa dos projetos de exemplo |

</details>

---

<div align="center">

Feito com 🍊 e vibe coding em Santos 🌊

</div>
