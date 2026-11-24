import { dashboard, designSystem, landing, mobile, shop } from "./covers/templates";

export type SeedProject = {
  slug: string;
  title: string;
  tags: string[];
  description: string;
  link: string | null;
  /** Data relativa (dias atrás) para o "Descobrir" ter datas variadas. */
  daysAgo: number;
  cover: () => string;
};

export type SeedPerson = {
  key: string;
  email: string;
  nome: string;
  sobrenome: string;
  pais: string;
  demo?: boolean;
  projects: SeedProject[];
};

export const DEMO_EMAIL = "demo@orangeportfolio.dev";

// Perfis fictícios usam o domínio reservado example.com (RFC 2606):
// nenhum e-mail real recebe mensagens e ninguém consegue entrar nessas contas.
export const PEOPLE: SeedPerson[] = [
  {
    key: "marina",
    email: "marina.okada@example.com",
    nome: "Marina",
    sobrenome: "Okada",
    pais: "Brasil",
    projects: [
      {
        slug: "feira-viva",
        title: "Feira Viva — app de feiras orgânicas",
        tags: ["UX", "Mobile", "Figma"],
        daysAgo: 12,
        link: null,
        description:
          "App para encontrar feiras orgânicas perto de casa, ver o que cada barraca está vendendo no dia e reservar a cesta antes de sair. Conduzi entrevistas com 14 feirantes e 20 consumidores, mapeei a jornada de compra e prototipei o fluxo de reserva em alta fidelidade. No teste de usabilidade, o tempo para montar uma cesta caiu de 4 para 1,5 minuto.",
        cover: () =>
          mobile({
            bg: ["#2E7D32", "#81C784"],
            screen: "#FFFFFF",
            ink: "#1B3A1F",
            muted: "#6B7F6D",
            accent: "#43A047",
            accent2: "#FFB300",
            soft: "#EEF5EE",
            appName: "Feira Viva",
            greeting: "Bom dia, Ana!",
            chips: ["Frutas", "Verduras", "Queijos"],
            cards: ["Cesta semanal", "Morangos"],
            detailTitle: "Barraca do Seu Zé",
            cta: "Reservar cesta",
            listTitle: "Minha lista",
            title: "Feira Viva",
            subtitle: "Feiras orgânicas perto de você",
          }),
      },
      {
        slug: "design-system-mare",
        title: "Design System Maré",
        tags: ["Design System", "UI", "Figma"],
        daysAgo: 48,
        link: null,
        description:
          "Biblioteca de componentes e tokens criada para unificar três produtos de uma fintech. Defini a paleta com contraste AA, a escala tipográfica e 40 componentes documentados com variantes e estados. Os times de produto passaram a entregar telas novas 30% mais rápido e com muito menos retrabalho de interface.",
        cover: () =>
          designSystem({
            bg: "#0F4C5C",
            board: "#FFFFFF",
            ink: "#10242B",
            muted: "#5F7A82",
            name: "Maré Design System",
            palette: [
              { hex: "#0F4C5C", name: "Oceano" },
              { hex: "#16A3A3", name: "Maré" },
              { hex: "#5CD6C0", name: "Espuma" },
              { hex: "#FFB347", name: "Sol" },
              { hex: "#FF6B5B", name: "Coral" },
              { hex: "#F3F7F8", name: "Areia" },
            ],
            primary: "#16A3A3",
            secondary: "#0F4C5C",
          }),
      },
      {
        slug: "adota-pet",
        title: "Adota Pet — adoção responsável",
        tags: ["UX", "Mobile", "Pesquisa"],
        daysAgo: 95,
        link: null,
        description:
          "Aplicativo que conecta ONGs de proteção animal a pessoas interessadas em adotar. O foco foi reduzir devoluções: criei um questionário de compatibilidade e uma área de acompanhamento pós-adoção. Projeto desenvolvido com uma ONG de Campinas, que validou o protótipo com 35 adotantes.",
        cover: () =>
          mobile({
            bg: ["#6A3DE8", "#FF7A6B"],
            screen: "#FFFFFF",
            ink: "#23163F",
            muted: "#7B7290",
            accent: "#6A3DE8",
            accent2: "#FF7A6B",
            soft: "#F3F0FB",
            appName: "Adota Pet",
            greeting: "Olá, Júlia",
            chips: ["Cães", "Gatos", "Filhotes"],
            cards: ["Paçoca", "Mel"],
            detailTitle: "Paçoca",
            cta: "Quero adotar",
            listTitle: "Meu processo",
            title: "Adota Pet",
            subtitle: "Adoção responsável, do match ao lar",
          }),
      },
    ],
  },
  {
    key: "rafael",
    email: "rafael.nunes@example.com",
    nome: "Rafael",
    sobrenome: "Nunes",
    pais: "Brasil",
    projects: [
      {
        slug: "painel-pila",
        title: "Pila — painel de finanças pessoais",
        tags: ["React", "Dashboard", "TypeScript"],
        daysAgo: 6,
        link: null,
        description:
          "Dashboard para acompanhar gastos, metas e investimentos em um só lugar. Front-end em React com TypeScript, gráficos com Recharts e dados importados de extratos OFX. Cuidei de acessibilidade nos gráficos (tabelas alternativas e navegação por teclado) e do modo escuro.",
        cover: () =>
          dashboard({
            bg: ["#0B3D2E", "#1E7F5C"],
            dark: true,
            accent: "#2EE59D",
            accent2: "#3B82F6",
            accent3: "#FBBF24",
            brand: "Pila",
            url: "app.pila.com.br/visao-geral",
            menu: ["Visão geral", "Transações", "Metas", "Investimentos", "Relatórios"],
            title: "Visão geral",
            kpis: [
              { label: "Saldo do mês", value: "R$ 4.820", delta: "+12%", up: true },
              { label: "Gastos", value: "R$ 2.310", delta: "-8%", up: true },
              { label: "Investido", value: "R$ 18,4 mil", delta: "+3,1%", up: true },
            ],
            chartTitle: "Receitas x despesas",
            sideTitle: "Gastos por categoria",
            rows: ["Supermercado", "Transporte", "Assinaturas", "Restaurantes"],
          }),
      },
      {
        slug: "cafe-serra-azul",
        title: "Café Serra Azul — landing page",
        tags: ["Web", "Landing Page", "Next.js"],
        daysAgo: 33,
        link: null,
        description:
          "Landing page para uma torrefação de cafés especiais do sul de Minas. Construída com Next.js e Tailwind, com nota 100 em performance no Lighthouse, assinatura mensal integrada ao checkout e conteúdo editável pelo cliente. As vendas do plano de assinatura dobraram no primeiro trimestre.",
        cover: () =>
          landing({
            bg: ["#3E2723", "#8D6E63"],
            page: "#FFF8F0",
            ink: "#2B1A14",
            muted: "#7A6258",
            accent: "#C0743C",
            accent2: "#E8B98A",
            brand: "Serra Azul",
            url: "cafeserraazul.com.br",
            nav: ["Cafés", "Assinatura", "Sobre"],
            headline: ["Café especial,", "direto da fazenda"],
            kicker: "Torra da semana",
            cta: "Assinar agora",
            hero: "cup",
            features: ["Torra fresca", "Frete grátis", "Grãos 86+ pts"],
          }),
      },
      {
        slug: "atelie-barro",
        title: "Ateliê Barro — loja de cerâmica",
        tags: ["E-commerce", "Web", "Tailwind"],
        daysAgo: 71,
        link: null,
        description:
          "E-commerce para um ateliê de cerâmica artesanal. Catálogo com filtros, carrinho persistente, cálculo de frete e pagamento via Pix. Desenvolvi o front-end com foco em fotos grandes e carregamento rápido no celular, onde acontecem 80% das compras.",
        cover: () =>
          shop({
            bg: ["#B4532A", "#E9A178"],
            page: "#FFFCF8",
            ink: "#2E1D15",
            muted: "#8A6F62",
            accent: "#B4532A",
            brand: "ATELIÊ BARRO",
            url: "ateliebarro.com.br",
            banner: "Coleção Terra",
            products: [
              { name: "Vaso Ipê", price: "R$ 189", color: "#C8693D", shape: "vase" },
              { name: "Tigela Rio", price: "R$ 96", color: "#6E8B74", shape: "bowl" },
              { name: "Caneca Brasa", price: "R$ 72", color: "#2F3A4B", shape: "mug" },
              { name: "Prato Duna", price: "R$ 118", color: "#D9B48F", shape: "plate" },
            ],
          }),
      },
    ],
  },
  {
    key: "lucia",
    email: "lucia.ferraz@example.com",
    nome: "Lúcia",
    sobrenome: "Ferraz",
    pais: "Portugal",
    projects: [
      {
        slug: "bem-cuidar",
        title: "Bem Cuidar — agendamento de consultas",
        tags: ["UX", "Saúde", "Web"],
        daysAgo: 20,
        link: null,
        description:
          "Redesenho do painel de agendamento de uma rede de clínicas. Unifiquei três agendas em uma visão só, com encaixes, lista de espera e confirmação por WhatsApp. Após o lançamento, as faltas em consultas caíram 22% e o tempo da recepção por paciente diminuiu pela metade.",
        cover: () =>
          dashboard({
            bg: ["#1D4ED8", "#60A5FA"],
            dark: false,
            accent: "#2563EB",
            accent2: "#14B8A6",
            accent3: "#F59E0B",
            brand: "Bem Cuidar",
            url: "painel.bemcuidar.pt/agenda",
            menu: ["Agenda", "Pacientes", "Profissionais", "Financeiro", "Definições"],
            title: "Agenda de hoje",
            kpis: [
              { label: "Consultas hoje", value: "64", delta: "+9%", up: true },
              { label: "Confirmadas", value: "92%", delta: "+5%", up: true },
              { label: "Faltas", value: "3", delta: "-22%", up: true },
            ],
            chartTitle: "Ocupação da semana",
            period: "Esta semana",
            sideTitle: "Por especialidade",
            rows: ["Dra. Inês Matos", "Dr. Paulo Reis", "Dra. Sofia Lima", "Dr. João Prates"],
          }),
      },
      {
        slug: "trilha-estudos",
        title: "Trilha — app de estudos",
        tags: ["Mobile", "UX", "Educação"],
        daysAgo: 58,
        link: null,
        description:
          "App que transforma o edital de um concurso em uma trilha de estudos semanal, com revisões espaçadas e metas diárias. Fiz a pesquisa com estudantes, a arquitetura de informação e o protótipo navegável. A retenção na quarta semana do piloto chegou a 61%.",
        cover: () =>
          mobile({
            bg: ["#312E81", "#6366F1"],
            screen: "#FFFFFF",
            ink: "#1E1B4B",
            muted: "#6B6A86",
            accent: "#4F46E5",
            accent2: "#FACC15",
            soft: "#EEF0FF",
            appName: "Trilha",
            greeting: "Semana 6 de 20",
            chips: ["Hoje", "Revisões", "Simulados"],
            cards: ["Português", "Matemática"],
            detailTitle: "Interpretação de texto",
            cta: "Começar sessão",
            listTitle: "Metas da semana",
            title: "Trilha",
            subtitle: "Do edital à aprovação, uma semana por vez",
          }),
      },
      {
        slug: "festival-sonora",
        title: "Festival Sonora — site oficial",
        tags: ["Web", "UI", "Branding"],
        daysAgo: 120,
        link: null,
        description:
          "Identidade visual e site de um festival de música independente em Lisboa. Criei a linguagem visual a partir de ondas sonoras, a programação interativa por palco e a venda de bilhetes. O site recebeu 180 mil visitas no mês do evento.",
        cover: () =>
          landing({
            bg: ["#1A0B2E", "#5B21B6"],
            page: "#160B26",
            ink: "#FFFFFF",
            muted: "#B9A7D9",
            accent: "#FF6A3D",
            accent2: "#C084FC",
            brand: "Sonora",
            url: "festivalsonora.pt",
            nav: ["Line-up", "Palcos", "Bilhetes"],
            headline: ["Três dias de", "música ao vivo"],
            kicker: "Lisboa · 12 a 14 de julho",
            cta: "Comprar bilhete",
            hero: "stage",
            features: ["42 artistas", "3 palcos", "Zona food"],
          }),
      },
    ],
  },
  {
    key: "demo",
    email: DEMO_EMAIL,
    nome: "Conta",
    sobrenome: "Demo",
    pais: "Brasil",
    demo: true,
    projects: [
      {
        slug: "orange-portfolio",
        title: "Orange Portfólio",
        tags: ["Next.js", "Supabase", "Web"],
        daysAgo: 2,
        link: "https://github.com/joaoteixeirap/OrangePortfolio",
        description:
          "Plataforma para cadastrar e compartilhar projetos de portfólio, criada no Hackathon Unisanta + FCamara 2024 (1º lugar). Next.js com App Router, Supabase (Auth, Postgres com RLS e Storage) e Material UI seguindo o protótipo do Figma. Você está usando ela agora: experimente adicionar, editar e excluir projetos nesta conta de demonstração.",
        cover: () =>
          landing({
            bg: ["#111133", "#444466"],
            page: "#FFFFFF",
            ink: "#111133",
            muted: "#515255",
            accent: "#FF5522",
            accent2: "#FFAA66",
            brand: "Orange Portfólio",
            url: "orangeportfolio.vercel.app",
            nav: ["Projetos", "Descobrir", "Sobre"],
            headline: ["Mostre seus", "projetos ao mundo"],
            kicker: "Hackathon FCamara · 1º lugar",
            cta: "Criar portfólio",
            hero: "cards",
            features: ["Cadastre", "Descubra", "Compartilhe"],
          }),
      },
      {
        slug: "horta-urbana",
        title: "Horta Urbana — mapa de hortas comunitárias",
        tags: ["React", "Mapa", "Web"],
        daysAgo: 40,
        link: null,
        description:
          "Painel que reúne as hortas comunitárias de uma cidade, com horários de mutirão, colheitas disponíveis e voluntários por região. Feito em React com dados abertos da prefeitura e atualização colaborativa pelos próprios coordenadores das hortas.",
        cover: () =>
          dashboard({
            bg: ["#14532D", "#65A30D"],
            dark: false,
            accent: "#16A34A",
            accent2: "#84CC16",
            accent3: "#F97316",
            brand: "Horta Urbana",
            url: "hortaurbana.org/painel",
            menu: ["Painel", "Mapa", "Mutirões", "Voluntários", "Doações"],
            title: "Painel da cidade",
            kpis: [
              { label: "Hortas ativas", value: "37", delta: "+4", up: true },
              { label: "Voluntários", value: "512", delta: "+18%", up: true },
              { label: "Colheita (kg)", value: "1.284", delta: "+9%", up: true },
            ],
            chartTitle: "Colheita por mês",
            period: "Últimos 12 meses",
            sideTitle: "Mutirões por bairro",
            rows: ["Horta da Vila Mathias", "Horta do Embaré", "Horta do Macuco", "Horta da Aparecida"],
          }),
      },
      {
        slug: "foco-pomodoro",
        title: "Foco — timer Pomodoro",
        tags: ["Mobile", "UI", "Produtividade"],
        daysAgo: 85,
        link: null,
        description:
          "Timer Pomodoro com metas diárias, estatísticas de foco e sons ambientes. Projeto de estudo para praticar React Native, animações e notificações locais, com atenção a modo escuro e tamanhos de fonte grandes.",
        cover: () =>
          mobile({
            bg: ["#B91C1C", "#F97316"],
            screen: "#FFFFFF",
            ink: "#3B0D0D",
            muted: "#8A6B6B",
            accent: "#E23D28",
            accent2: "#F59E0B",
            soft: "#FDF0EE",
            appName: "Foco",
            greeting: "4 pomodoros hoje",
            chips: ["Foco", "Pausa", "Longa"],
            cards: ["Inglês", "Relatório"],
            detailTitle: "Sessão de foco",
            cta: "Iniciar 25:00",
            listTitle: "Hoje",
            title: "Foco",
            subtitle: "25 minutos de cada vez",
          }),
      },
    ],
  },
];
