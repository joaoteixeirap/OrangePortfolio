import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Como o Orange Portfólio coleta, usa e protege os seus dados.",
};

const REPO_URL = "https://github.com/joaoteixeirap/OrangePortfolio";
const UPDATED_AT = "24 de novembro de 2026";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="text-xl font-medium text-principal-90">{title}</h2>
      <div className="mt-3 space-y-3 leading-relaxed text-neutral-120">{children}</div>
    </section>
  );
}

export default function PrivacidadePage() {
  return (
    <>
      <header className="bg-principal-100">
        <div className="mx-auto flex h-14 max-w-3xl items-center px-6 sm:h-16">
          <Link href="/login" className="rounded" aria-label="Orange Portfólio, ir para o login">
            <Image src="/logo_home.png" width={1200} height={450} alt="" className="h-8 w-auto sm:h-9" priority />
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-20 pt-12 animate-fade-in-up">
        <h1 className="text-3xl text-principal-90 sm:text-4xl">Política de privacidade</h1>
        <p className="mt-2 text-sm text-neutral-110">Última atualização: {UPDATED_AT}</p>

        <p className="mt-6 leading-relaxed text-neutral-120">
          O Orange Portfólio é uma aplicação para cadastrar e compartilhar projetos de portfólio,
          criada no Hackathon Unisanta + FCamara 2024 e mantida como projeto pessoal de portfólio.
          Esta página explica quais dados coletamos, por que e como você pode removê-los. O
          tratamento segue a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
        </p>

        <Section title="Dados que coletamos">
          <ul className="list-disc space-y-2 pl-6">
            <li>
              <strong>Cadastro com e-mail:</strong> nome, sobrenome, endereço de e-mail e senha. A
              senha é armazenada apenas de forma criptografada (hash) e nunca fica visível para nós.
            </li>
            <li>
              <strong>Login com Google:</strong> nome, endereço de e-mail e foto de perfil da sua
              conta Google. Não temos acesso à sua senha do Google, aos seus contatos, arquivos ou
              qualquer outro dado da sua conta.
            </li>
            <li>
              <strong>Conteúdo que você publica:</strong> título, descrição, tags, link e imagem de
              capa de cada projeto.
            </li>
            <li>
              <strong>Dados técnicos:</strong> cookies de sessão, necessários para manter você
              conectado. Não usamos cookies de publicidade nem ferramentas de rastreamento.
            </li>
          </ul>
        </Section>

        <Section title="Como usamos os dados">
          <ul className="list-disc space-y-2 pl-6">
            <li>Para criar e manter a sua conta e permitir que você entre na aplicação.</li>
            <li>
              Para exibir o seu nome, foto e país junto aos seus projetos, inclusive na página
              “Descobrir”, visível para outras pessoas com conta na aplicação.
            </li>
          </ul>
          <p>
            Não vendemos, alugamos nem compartilhamos seus dados com terceiros para fins de
            publicidade. O seu e-mail não é exibido para outras pessoas.
          </p>
        </Section>

        <Section title="Dados do Google">
          <p>
            O uso de informações recebidas das APIs do Google segue a{" "}
            <a
              href="https://developers.google.com/terms/api-services-user-data-policy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-info-90 underline underline-offset-2"
            >
              Política de Dados do Usuário dos Serviços de API do Google
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            , incluindo os requisitos de uso limitado. Usamos apenas nome, e-mail e foto de perfil,
            exclusivamente para identificar você na aplicação.
          </p>
        </Section>

        <Section title="Onde os dados ficam">
          <p>
            Os dados e as imagens são armazenados no Supabase (banco de dados, autenticação e
            armazenamento de arquivos) e a aplicação é hospedada na Vercel. Esses serviços podem
            processar dados fora do Brasil, com medidas de segurança próprias. O acesso aos dados é
            restrito por regras no banco: cada pessoa só pode alterar ou excluir o próprio conteúdo.
          </p>
        </Section>

        <Section title="Seus direitos e exclusão de dados">
          <p>
            Você pode editar ou excluir seus projetos a qualquer momento na página “Meus projetos”.
            Para solicitar acesso, correção ou a exclusão completa da sua conta e de todos os dados
            associados, abra uma solicitação no{" "}
            <a
              href={`${REPO_URL}/issues`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-info-90 underline underline-offset-2"
            >
              repositório do projeto no GitHub
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            . Atendemos em até 15 dias.
          </p>
          <p>
            Se você entrou com o Google, também pode remover o acesso do Orange Portfólio a
            qualquer momento em{" "}
            <a
              href="https://myaccount.google.com/connections"
              target="_blank"
              rel="noopener noreferrer"
              className="text-info-90 underline underline-offset-2"
            >
              myaccount.google.com/connections
              <span className="sr-only"> (abre em nova aba)</span>
            </a>
            .
          </p>
        </Section>

        <Section title="Conta de demonstração">
          <p>
            A conta de demonstração é compartilhada e seu conteúdo é restaurado periodicamente.
            Não publique informações pessoais nela.
          </p>
        </Section>

        <Section title="Alterações nesta política">
          <p>
            Esta política pode ser atualizada. A data da última atualização fica no topo desta
            página.
          </p>
        </Section>

        <p className="mt-12">
          <Link href="/login" className="rounded text-info-90 underline underline-offset-2">
            Voltar para o login
          </Link>
        </p>
      </main>
    </>
  );
}
