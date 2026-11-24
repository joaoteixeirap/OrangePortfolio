// Mockups de interface em SVG (1200x800) usados como capas dos projetos do seed.
// Cada template recebe cores e textos para gerar capas variadas.

export const W = 1200;
export const H = 800;
const FONT = "Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const text = (
  x: number,
  y: number,
  value: string,
  size: number,
  fill: string,
  opts: { weight?: number; anchor?: "start" | "middle" | "end"; opacity?: number; spacing?: number } = {},
) =>
  `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="${opts.weight ?? 400}" fill="${fill}" text-anchor="${opts.anchor ?? "start"}"${opts.opacity !== undefined ? ` fill-opacity="${opts.opacity}"` : ""}${opts.spacing ? ` letter-spacing="${opts.spacing}"` : ""}>${esc(value)}</text>`;

const rect = (x: number, y: number, w: number, h: number, fill: string, r = 0, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;

/** Linhas de "texto" (barras arredondadas). */
const lines = (x: number, y: number, widths: number[], fill: string, h = 10, gap = 18) =>
  widths.map((w, i) => rect(x, y + i * gap, w, h, fill, h / 2)).join("");

/** Itens de menu com espaçamento uniforme, terminando em rightX. */
const navItems = (items: string[], rightX: number, y: number, size: number, fill: string) => {
  const widths = items.map((it) => it.length * size * 0.56);
  let x = rightX - widths.reduce((a, b) => a + b, 0) - 40 * (items.length - 1);
  return items
    .map((it, i) => {
      const t = text(x, y, it, size, fill, { weight: 500 });
      x += widths[i] + 40;
      return t;
    })
    .join("");
};

const shadow = (id: string, opacity = 0.25, blur = 24) =>
  `<filter id="${id}" x="-20%" y="-20%" width="140%" height="150%"><feGaussianBlur in="SourceAlpha" stdDeviation="${blur}"/><feOffset dy="${blur / 2}" result="b"/><feComponentTransfer><feFuncA type="linear" slope="${opacity}"/></feComponentTransfer><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>`;

const svg = (defs: string, body: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${shadow("sh")}${shadow("shs", 0.18, 10)}${defs}</defs>${body}</svg>`;

const bgGradient = (a: string, b: string, angle: "diag" | "vert" = "diag") =>
  `<linearGradient id="bg" x1="0" y1="0" x2="${angle === "diag" ? 1 : 0}" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>`;

/** Janela de navegador com barra e três bolinhas. */
const browser = (x: number, y: number, w: number, h: number, chrome: string, page: string, url: string) =>
  `<g filter="url(#sh)">${rect(x, y, w, h, page, 16)}</g>` +
  `<path d="M${x} ${y + 16} a16 16 0 0 1 16 -16 h${w - 32} a16 16 0 0 1 16 16 v26 h-${w} z" fill="${chrome}"/>` +
  `<circle cx="${x + 24}" cy="${y + 21}" r="6" fill="#FF5F57"/><circle cx="${x + 44}" cy="${y + 21}" r="6" fill="#FEBC2E"/><circle cx="${x + 64}" cy="${y + 21}" r="6" fill="#28C840"/>` +
  rect(x + w / 2 - 160, y + 11, 320, 20, "#00000014", 10) +
  text(x + w / 2, y + 26, url, 12, "#00000099", { anchor: "middle" });

// ---------------------------------------------------------------------------
// Landing page
// ---------------------------------------------------------------------------
export type LandingOpts = {
  bg: [string, string];
  page: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
  brand: string;
  url: string;
  nav: string[];
  headline: [string, string];
  kicker: string;
  cta: string;
  hero: "blobs" | "cup" | "stage" | "cards";
  features: string[];
};

function heroArt(o: LandingOpts, x: number, y: number) {
  switch (o.hero) {
    case "cup":
      return (
        `<circle cx="${x + 190}" cy="${y + 190}" r="170" fill="${o.accent2}" fill-opacity="0.35"/>` +
        `<path d="M${x + 95} ${y + 150} h190 l-18 170 a30 30 0 0 1 -30 26 h-94 a30 30 0 0 1 -30 -26 z" fill="${o.accent}"/>` +
        `<path d="M${x + 285} ${y + 185} a45 45 0 0 1 0 90 h-10 v-24 h8 a21 21 0 0 0 0 -42 h-8 v-24 z" fill="${o.accent}"/>` +
        rect(x + 85, y + 136, 210, 22, o.ink, 8) +
        `<path d="M${x + 150} ${y + 110} q-20 -30 0 -55 q20 -25 0 -50" stroke="${o.muted}" stroke-width="7" fill="none" stroke-linecap="round" stroke-opacity="0.6"/>` +
        `<path d="M${x + 200} ${y + 115} q-20 -30 0 -55 q20 -25 0 -50" stroke="${o.muted}" stroke-width="7" fill="none" stroke-linecap="round" stroke-opacity="0.45"/>` +
        `<ellipse cx="${x + 190}" cy="${y + 365}" rx="140" ry="14" fill="${o.ink}" fill-opacity="0.12"/>` +
        `<circle cx="${x + 330}" cy="${y + 70}" r="26" fill="${o.accent}" fill-opacity="0.8"/>` +
        `<circle cx="${x + 40}" cy="${y + 300}" r="14" fill="${o.ink}" fill-opacity="0.25"/>`
      );
    case "stage":
      return (
        `<defs><radialGradient id="spot" cx="0.5" cy="0.2" r="0.8"><stop offset="0" stop-color="${o.accent2}" stop-opacity="0.95"/><stop offset="1" stop-color="${o.accent2}" stop-opacity="0"/></radialGradient></defs>` +
        `<path d="M${x + 120} ${y - 10} L${x + 20} ${y + 330} L${x + 220} ${y + 330} Z" fill="url(#spot)" opacity="0.7"/>` +
        `<path d="M${x + 280} ${y - 10} L${x + 170} ${y + 330} L${x + 370} ${y + 330} Z" fill="url(#spot)" opacity="0.5"/>` +
        `<circle cx="${x + 200}" cy="${y + 175}" r="120" fill="${o.accent}"/>` +
        `<circle cx="${x + 200}" cy="${y + 175}" r="80" fill="none" stroke="${o.page}" stroke-width="10" stroke-opacity="0.5"/>` +
        `<circle cx="${x + 200}" cy="${y + 175}" r="34" fill="${o.page}"/>` +
        rect(x + 10, y + 330, 380, 40, o.accent2, 6, 'fill-opacity="0.35"') +
        [0, 1, 2, 3, 4, 5, 6].map((i) => rect(x + 30 + i * 52, y + 300 - (i % 3) * 30 - 20, 18, 40 + (i % 3) * 30, o.ink, 9, 'fill-opacity="0.9"')).join("")
      );
    case "cards":
      return (
        `<g transform="rotate(-6 ${x + 200} ${y + 180})" filter="url(#shs)">${rect(x + 30, y + 40, 240, 170, o.accent, 12)}</g>` +
        `<g transform="rotate(5 ${x + 200} ${y + 180})" filter="url(#shs)">${rect(x + 150, y + 120, 240, 170, o.accent2, 12)}</g>` +
        `<g filter="url(#shs)">${rect(x + 90, y + 200, 240, 160, "#FFFFFF", 12)}${rect(x + 106, y + 216, 208, 96, o.accent, 8, 'fill-opacity="0.85"')}<circle cx="${x + 120}" cy="${y + 335}" r="11" fill="${o.accent2}"/>${rect(x + 140, y + 330, 90, 10, o.muted, 5)}</g>`
      );
    default:
      return (
        `<path d="M${x + 60} ${y + 60} C${x + 160} ${y - 30} ${x + 380} ${y + 20} ${x + 370} ${y + 170} C${x + 360} ${y + 320} ${x + 200} ${y + 380} ${x + 100} ${y + 320} C${x} ${y + 260} ${x - 30} ${y + 140} ${x + 60} ${y + 60} Z" fill="${o.accent}"/>` +
        `<path d="M${x + 210} ${y + 200} C${x + 290} ${y + 150} ${x + 400} ${y + 230} ${x + 360} ${y + 320} C${x + 330} ${y + 390} ${x + 220} ${y + 380} ${x + 200} ${y + 310} C${x + 185} ${y + 260} ${x + 170} ${y + 225} ${x + 210} ${y + 200} Z" fill="${o.accent2}" fill-opacity="0.9"/>` +
        `<circle cx="${x + 60}" cy="${y + 330}" r="22" fill="${o.accent2}"/>` +
        `<circle cx="${x + 340}" cy="${y + 40}" r="12" fill="${o.ink}" fill-opacity="0.3"/>`
      );
  }
}

export function landing(o: LandingOpts) {
  const bx = 70, by = 56, bw = 1060, bh = 688;
  const px = bx + 56; // padding interno da página
  let body = rect(0, 0, W, H, "url(#bg)");
  body += browser(bx, by, bw, bh, "#ECEEF3", o.page, o.url);

  // nav
  const ny = by + 86;
  body += `<circle cx="${px + 14}" cy="${ny - 6}" r="14" fill="${o.accent}"/>`;
  body += text(px + 38, ny, o.brand, 20, o.ink, { weight: 700 });
  body += navItems(o.nav, bx + bw - 170, ny, 15, o.muted);
  body += rect(bx + bw - 140, ny - 26, 90, 36, o.ink, 18) + text(bx + bw - 95, ny - 3, o.cta.split(" ")[0], 14, o.page, { anchor: "middle", weight: 600 });

  // hero
  const hy = by + 190;
  body += rect(px, hy - 6, o.kicker.length * 8.6 + 28, 30, o.accent, 15, 'fill-opacity="0.16"');
  body += text(px + 14, hy + 14, o.kicker, 14, o.accent, { weight: 600 });
  body += text(px, hy + 86, o.headline[0], 54, o.ink, { weight: 800, spacing: -1 });
  body += text(px, hy + 150, o.headline[1], 54, o.ink, { weight: 800, spacing: -1 });
  body += lines(px, hy + 186, [420, 370, 260], o.muted + "55", 11, 22);
  body += rect(px, hy + 270, 190, 52, o.accent, 26) + text(px + 95, hy + 302, o.cta, 16, o.page, { anchor: "middle", weight: 700 });
  body += rect(px + 206, hy + 270, 150, 52, "none", 26, `stroke="${o.ink}" stroke-width="2"`) + text(px + 281, hy + 302, "Saiba mais", 16, o.ink, { anchor: "middle", weight: 600 });
  body += heroArt(o, bx + bw - 470, hy - 20);

  // features
  const fy = by + bh - 120;
  o.features.forEach((f, i) => {
    const fx = px + i * 330;
    body += rect(fx, fy, 300, 84, o.ink, 14, 'fill-opacity="0.05"');
    body += `<circle cx="${fx + 40}" cy="${fy + 42}" r="20" fill="${i === 1 ? o.accent2 : o.accent}" fill-opacity="0.9"/>`;
    body += text(fx + 74, fy + 38, f, 16, o.ink, { weight: 700 });
    body += rect(fx + 74, fy + 50, 170, 9, o.muted + "55", 4.5);
  });

  return svg(bgGradient(o.bg[0], o.bg[1]), body);
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------
export type DashboardOpts = {
  bg: [string, string];
  dark: boolean;
  accent: string;
  accent2: string;
  accent3: string;
  brand: string;
  url: string;
  menu: string[];
  title: string;
  kpis: { label: string; value: string; delta: string; up: boolean }[];
  chartTitle: string;
  period?: string;
  sideTitle: string;
  rows: string[];
};

export function dashboard(o: DashboardOpts) {
  const bx = 60, by = 50, bw = 1080, bh = 700;
  const page = o.dark ? "#141824" : "#F5F7FB";
  const panel = o.dark ? "#1E2433" : "#FFFFFF";
  const ink = o.dark ? "#F2F4F8" : "#1B2033";
  const muted = o.dark ? "#8A93A8" : "#7A8299";
  const line = o.dark ? "#2C3447" : "#E6E9F2";

  let body = rect(0, 0, W, H, "url(#bg)");
  body += browser(bx, by, bw, bh, o.dark ? "#2A3040" : "#E9ECF2", page, o.url);

  // sidebar
  const sx = bx, sy = by + 42, sw = 210;
  body += `<path d="M${sx} ${sy} h${sw} v${bh - 42} h-${sw - 16} a16 16 0 0 1 -16 -16 z" fill="${panel}"/>`;
  body += rect(sx + 24, sy + 26, 30, 30, o.accent, 8) + text(sx + 66, sy + 48, o.brand, 18, ink, { weight: 700 });
  o.menu.forEach((m, i) => {
    const my = sy + 96 + i * 46;
    if (i === 0) body += rect(sx + 14, my - 24, sw - 28, 38, o.accent, 10, 'fill-opacity="0.16"');
    body += rect(sx + 28, my - 13, 16, 16, i === 0 ? o.accent : muted, 4, i === 0 ? "" : 'fill-opacity="0.6"');
    body += text(sx + 56, my, m, 14, i === 0 ? o.accent : muted, { weight: i === 0 ? 700 : 500 });
  });

  // topbar
  const cx = sx + sw + 28, cw = bx + bw - cx - 28;
  body += text(cx, sy + 52, o.title, 24, ink, { weight: 700 });
  body += rect(cx + cw - 330, sy + 26, 230, 38, panel, 19, `stroke="${line}"`);
  body += `<circle cx="${cx + cw - 306}" cy="${sy + 45}" r="7" fill="none" stroke="${muted}" stroke-width="2"/>`;
  body += rect(cx + cw - 290, sy + 40, 110, 9, muted, 4.5, 'fill-opacity="0.4"');
  body += `<circle cx="${cx + cw - 60}" cy="${sy + 45}" r="19" fill="${o.accent2}"/><circle cx="${cx + cw - 16}" cy="${sy + 45}" r="5" fill="${o.accent3}"/>`;

  // KPIs
  const ky = sy + 92, kw = (cw - 32) / 3;
  o.kpis.forEach((k, i) => {
    const kx = cx + i * (kw + 16);
    body += rect(kx, ky, kw, 108, panel, 14, o.dark ? "" : `stroke="${line}"`);
    body += text(kx + 20, ky + 32, k.label, 13, muted, { weight: 500 });
    body += text(kx + 20, ky + 80, k.value, k.value.length > 8 ? 26 : 30, ink, { weight: 800 });
    const c = k.up ? "#22C55E" : "#F05252";
    body += rect(kx + kw - 82, ky + 16, 62, 26, c, 13, 'fill-opacity="0.15"');
    body += text(kx + kw - 51, ky + 34, k.delta, 13, c, { anchor: "middle", weight: 700 });
  });

  // gráfico de linha
  const gy = ky + 128, gw = cw * 0.63, gh = 260;
  body += rect(cx, gy, gw, gh, panel, 14, o.dark ? "" : `stroke="${line}"`);
  body += text(cx + 20, gy + 34, o.chartTitle, 15, ink, { weight: 700 });
  body += rect(cx + gw - 120, gy + 18, 100, 26, line, 13) + text(cx + gw - 70, gy + 36, o.period ?? "Últimos 6 meses", 11, muted, { anchor: "middle" });
  const pts = [0.55, 0.62, 0.48, 0.7, 0.64, 0.82, 0.76, 0.9];
  const gx0 = cx + 30, gx1 = cx + gw - 30, gy0 = gy + gh - 40, gy1 = gy + 70;
  for (let i = 0; i < 4; i++) body += rect(gx0, gy1 + i * ((gy0 - gy1) / 3), gx1 - gx0, 1, line);
  const P = pts.map((p, i) => [gx0 + (i * (gx1 - gx0)) / (pts.length - 1), gy0 - p * (gy0 - gy1)]);
  const d = P.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const d2 = P.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${(p[1] + 46 + (i % 2) * 14).toFixed(1)}`).join(" ");
  body += `<path d="${d} L${gx1} ${gy0} L${gx0} ${gy0} Z" fill="url(#area)"/>`;
  body += `<path d="${d}" fill="none" stroke="${o.accent}" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`;
  body += `<path d="${d2}" fill="none" stroke="${o.accent3}" stroke-width="3" stroke-dasharray="8 8" stroke-linecap="round"/>`;
  body += `<circle cx="${P[5][0]}" cy="${P[5][1]}" r="8" fill="${panel}" stroke="${o.accent}" stroke-width="4"/>`;

  // painel lateral: barras
  const px = cx + gw + 16, pw = cw - gw - 16;
  body += rect(px, gy, pw, gh, panel, 14, o.dark ? "" : `stroke="${line}"`);
  body += text(px + 20, gy + 34, o.sideTitle, 15, ink, { weight: 700 });
  const bars = [0.6, 0.85, 0.45, 0.7, 0.95, 0.55];
  const barW = (pw - 60) / bars.length - 10;
  bars.forEach((b, i) => {
    const h = b * 150;
    body += rect(px + 30 + i * (barW + 10), gy + gh - 40 - h, barW, h, i === 4 ? o.accent : o.accent2, 6, i === 4 ? "" : 'fill-opacity="0.55"');
  });

  // tabela
  const ty = gy + gh + 16, th = bh - (ty - by) - 24;
  body += rect(cx, ty, cw, th, panel, 14, o.dark ? "" : `stroke="${line}"`);
  o.rows.slice(0, Math.max(1, Math.floor((th - 20) / 40))).forEach((r, i) => {
    const ry = ty + 34 + i * 40;
    body += `<circle cx="${cx + 32}" cy="${ry - 5}" r="12" fill="${[o.accent, o.accent2, o.accent3][i % 3]}" fill-opacity="0.85"/>`;
    body += text(cx + 56, ry, r, 14, ink, { weight: 600 });
    body += rect(cx + cw * 0.45, ry - 10, 120, 9, muted, 4.5, 'fill-opacity="0.35"');
    body += rect(cx + cw - 120, ry - 18, 92, 24, o.accent, 12, 'fill-opacity="0.15"');
  });

  const defs =
    bgGradient(o.bg[0], o.bg[1]) +
    `<linearGradient id="area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${o.accent}" stop-opacity="0.35"/><stop offset="1" stop-color="${o.accent}" stop-opacity="0"/></linearGradient>`;
  return svg(defs, body);
}

// ---------------------------------------------------------------------------
// App mobile (três telas)
// ---------------------------------------------------------------------------
export type MobileOpts = {
  bg: [string, string];
  screen: string;
  ink: string;
  muted: string;
  accent: string;
  accent2: string;
  soft: string;
  appName: string;
  greeting: string;
  chips: string[];
  cards: string[];
  detailTitle: string;
  cta: string;
  listTitle: string;
  title: string;
  subtitle: string;
};

function phone(x: number, y: number, w: number, h: number, content: string, clipId: string) {
  return (
    `<g filter="url(#sh)">${rect(x - 10, y - 10, w + 20, h + 20, "#0E0F14", 46)}</g>` +
    `<clipPath id="${clipId}">${rect(x, y, w, h, "#000", 36)}</clipPath>` +
    `<g clip-path="url(#${clipId})">${content}</g>` +
    rect(x + w / 2 - 44, y + 8, 88, 22, "#0E0F14", 11)
  );
}

export function mobile(o: MobileOpts) {
  const pw = 250, ph = 520;
  const s = (x: number, y: number) => {
    // Tela 1: home
    let c = rect(x, y, pw, ph, o.screen);
    c += text(x + 22, y + 74, o.greeting, 13, o.muted);
    c += text(x + 22, y + 100, o.appName, 22, o.ink, { weight: 800 });
    c += `<circle cx="${x + pw - 38}" cy="${y + 86}" r="18" fill="${o.accent2}"/>`;
    c += rect(x + 22, y + 122, pw - 44, 38, o.soft, 19) + `<circle cx="${x + 44}" cy="${y + 141}" r="6" fill="none" stroke="${o.muted}" stroke-width="2"/>` + rect(x + 58, y + 136, 110, 9, o.muted, 4.5, 'fill-opacity="0.4"');
    let cxp = x + 22;
    o.chips.forEach((chip, i) => {
      const cw = chip.length * 7.4 + 26;
      if (cxp + cw > x + pw - 16) return;
      c += rect(cxp, y + 176, cw, 30, i === 0 ? o.accent : o.soft, 15) + text(cxp + cw / 2, y + 196, chip, 12, i === 0 ? "#FFFFFF" : o.ink, { anchor: "middle", weight: 600 });
      cxp += cw + 8;
    });
    o.cards.forEach((card, i) => {
      const cy = y + 224 + i * 140;
      c += rect(x + 22, cy, pw - 44, 124, o.soft, 18);
      c += rect(x + 34, cy + 12, 84, 100, i % 2 ? o.accent2 : o.accent, 14, 'fill-opacity="0.85"');
      c += `<circle cx="${x + 76}" cy="${cy + 62}" r="22" fill="#FFFFFF" fill-opacity="0.35"/>`;
      c += text(x + 130, cy + 40, card, 14, o.ink, { weight: 700 });
      c += rect(x + 130, cy + 54, 70, 8, o.muted, 4, 'fill-opacity="0.45"');
      c += rect(x + 130, cy + 84, 58, 24, o.accent, 12) + text(x + 159, cy + 100, "+", 16, "#FFFFFF", { anchor: "middle", weight: 700 });
    });
    c += rect(x, y + ph - 64, pw, 64, o.screen) + rect(x, y + ph - 64, pw, 1, o.soft);
    [0, 1, 2, 3].forEach((i) => (c += `<circle cx="${x + 40 + i * 57}" cy="${y + ph - 32}" r="${i === 0 ? 9 : 7}" fill="${i === 0 ? o.accent : o.muted}" fill-opacity="${i === 0 ? 1 : 0.45}"/>`));
    return c;
  };
  const d = (x: number, y: number) => {
    // Tela 2: detalhe
    let c = rect(x, y, pw, ph, o.screen);
    c += rect(x, y, pw, 250, o.accent);
    c += `<circle cx="${x + pw / 2}" cy="${y + 140}" r="74" fill="#FFFFFF" fill-opacity="0.25"/><circle cx="${x + pw / 2}" cy="${y + 140}" r="44" fill="${o.accent2}"/>`;
    c += `<circle cx="${x + 34}" cy="${y + 58}" r="16" fill="#FFFFFF" fill-opacity="0.9"/>`;
    c += rect(x, y + 230, pw, 300, o.screen, 26);
    c += text(x + 22, y + 276, o.detailTitle, 18, o.ink, { weight: 800 });
    [0, 1, 2, 3, 4].forEach((i) => (c += `<path d="M${x + 30 + i * 18} ${y + 292} l4 9 l10 1 l-7 7 l2 10 l-9 -5 l-9 5 l2 -10 l-7 -7 l10 -1 z" fill="${i < 4 ? "#F5B400" : o.soft}"/>`));
    c += lines(x + 22, y + 336, [200, 180, 150, 190], o.muted + "66", 8, 18);
    c += rect(x + 22, y + 420, 92, 34, o.soft, 17) + rect(x + 122, y + 420, 92, 34, o.soft, 17);
    c += rect(x + 22, y + ph - 72, pw - 44, 48, o.ink, 24) + text(x + pw / 2, y + ph - 42, o.cta, 15, o.screen, { anchor: "middle", weight: 700 });
    return c;
  };
  const l = (x: number, y: number) => {
    // Tela 3: lista/progresso
    let c = rect(x, y, pw, ph, o.screen);
    c += text(x + 22, y + 90, o.listTitle, 20, o.ink, { weight: 800 });
    c += rect(x + 22, y + 112, pw - 44, 120, o.accent, 18);
    c += `<circle cx="${x + 78}" cy="${y + 172}" r="36" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="9"/>`;
    c += `<path d="M${x + 78} ${y + 136} a36 36 0 1 1 -34 46" fill="none" stroke="#FFFFFF" stroke-width="9" stroke-linecap="round"/>`;
    c += text(x + 78, y + 178, "72%", 15, "#FFFFFF", { anchor: "middle", weight: 800 });
    c += rect(x + 130, y + 152, 90, 10, "#FFFFFF", 5, 'fill-opacity="0.85"') + rect(x + 130, y + 172, 64, 8, "#FFFFFF", 4, 'fill-opacity="0.5"');
    [0, 1, 2, 3].forEach((i) => {
      const ry = y + 254 + i * 62;
      c += rect(x + 22, ry, pw - 44, 52, o.soft, 14);
      c += rect(x + 34, ry + 12, 28, 28, i % 2 ? o.accent2 : o.accent, 8, 'fill-opacity="0.85"');
      c += rect(x + 74, ry + 15, 100 - i * 8, 9, o.ink, 4.5, 'fill-opacity="0.75"') + rect(x + 74, ry + 31, 60, 7, o.muted, 3.5, 'fill-opacity="0.45"');
      c += `<circle cx="${x + pw - 44}" cy="${ry + 26}" r="9" fill="${i < 2 ? o.accent : "none"}" stroke="${o.accent}" stroke-width="2"/>`;
    });
    return c;
  };

  let body = rect(0, 0, W, H, "url(#bg)");
  body += `<circle cx="1040" cy="120" r="220" fill="#FFFFFF" fill-opacity="0.08"/><circle cx="140" cy="720" r="260" fill="#FFFFFF" fill-opacity="0.06"/>`;
  body += text(70, 150, o.title, 46, "#FFFFFF", { weight: 800, spacing: -1 });
  body += text(72, 190, o.subtitle, 18, "#FFFFFF", { opacity: 0.85 });
  body += phone(470, 170, pw, ph, d(470, 170), "p2");
  body += phone(780, 110, pw, ph, s(780, 110), "p1");
  body += phone(160, 250, pw, ph, l(160, 250), "p3");
  return svg(bgGradient(o.bg[0], o.bg[1]), body);
}

// ---------------------------------------------------------------------------
// E-commerce
// ---------------------------------------------------------------------------
export type ShopOpts = {
  bg: [string, string];
  page: string;
  ink: string;
  muted: string;
  accent: string;
  brand: string;
  url: string;
  banner: string;
  products: { name: string; price: string; color: string; shape: "vase" | "bowl" | "mug" | "plate" }[];
};

function product(shape: ShopOpts["products"][number]["shape"], cx: number, cy: number, color: string) {
  switch (shape) {
    case "vase":
      return `<path d="M${cx - 22} ${cy - 70} h44 v14 c0 10 30 24 30 62 c0 36 -22 54 -52 54 c-30 0 -52 -18 -52 -54 c0 -38 30 -52 30 -62 z" fill="${color}"/><ellipse cx="${cx}" cy="${cy - 70}" rx="22" ry="5" fill="#000" fill-opacity="0.15"/>`;
    case "bowl":
      return `<path d="M${cx - 78} ${cy - 10} h156 c0 50 -36 76 -78 76 c-42 0 -78 -26 -78 -76 z" fill="${color}"/><ellipse cx="${cx}" cy="${cy - 10}" rx="78" ry="14" fill="#000" fill-opacity="0.12"/>`;
    case "mug":
      return `<rect x="${cx - 46}" y="${cy - 50}" width="92" height="110" rx="14" fill="${color}"/><path d="M${cx + 46} ${cy - 24} a28 28 0 0 1 0 56" fill="none" stroke="${color}" stroke-width="13"/>`;
    default:
      return `<ellipse cx="${cx}" cy="${cy + 10}" rx="88" ry="62" fill="${color}"/><ellipse cx="${cx}" cy="${cy + 4}" rx="58" ry="38" fill="#FFFFFF" fill-opacity="0.25"/>`;
  }
}

export function shop(o: ShopOpts) {
  const bx = 70, by = 56, bw = 1060, bh = 688;
  const px = bx + 48;
  let body = rect(0, 0, W, H, "url(#bg)");
  body += browser(bx, by, bw, bh, "#EDE7E1", o.page, o.url);
  const ny = by + 84;
  body += text(px, ny, o.brand, 24, o.ink, { weight: 800, spacing: 1 });
  body += navItems(["Coleções", "Peças únicas", "Ateliê", "Contato"], bx + bw - 130, ny - 2, 15, o.muted);
  body += `<circle cx="${bx + bw - 90}" cy="${ny - 7}" r="16" fill="none" stroke="${o.ink}" stroke-width="2"/><circle cx="${bx + bw - 50}" cy="${ny - 7}" r="16" fill="${o.accent}"/>`;
  body += text(bx + bw - 50, ny - 2, "2", 13, "#FFFFFF", { anchor: "middle", weight: 700 });

  const banY = by + 116;
  body += rect(px, banY, bw - 96, 150, o.accent, 18);
  body += text(px + 40, banY + 66, o.banner, 34, "#FFFFFF", { weight: 800 });
  body += text(px + 40, banY + 102, "Frete grátis acima de R$ 250 · Feito à mão em Minas", 16, "#FFFFFF", { opacity: 0.9 });
  body += product("vase", bx + bw - 230, banY + 75, "#FFFFFF33") + product("bowl", bx + bw - 120, banY + 95, "#FFFFFF44");

  const gy = banY + 178, cw = (bw - 96 - 3 * 20) / 4;
  o.products.slice(0, 4).forEach((p, i) => {
    const cx = px + i * (cw + 20);
    body += rect(cx, gy, cw, 250, "#F4EFEA", 16);
    body += product(p.shape, cx + cw / 2, gy + 120, p.color);
    body += text(cx, gy + 284, p.name, 16, o.ink, { weight: 700 });
    body += text(cx, gy + 310, p.price, 15, o.muted, { weight: 500 });
    body += `<circle cx="${cx + cw - 20}" cy="${gy + 298}" r="18" fill="${o.ink}"/>` + text(cx + cw - 20, gy + 304, "+", 18, "#FFFFFF", { anchor: "middle", weight: 700 });
  });
  return svg(bgGradient(o.bg[0], o.bg[1]), body);
}

// ---------------------------------------------------------------------------
// Design system (prancha)
// ---------------------------------------------------------------------------
export type DesignSystemOpts = {
  bg: string;
  board: string;
  ink: string;
  muted: string;
  name: string;
  palette: { hex: string; name: string }[];
  primary: string;
  secondary: string;
};

export function designSystem(o: DesignSystemOpts) {
  let body = rect(0, 0, W, H, o.bg);
  // grade de fundo
  for (let x = 0; x < W; x += 40) body += rect(x, 0, 1, H, "#FFFFFF", 0, 'fill-opacity="0.05"');
  for (let y = 0; y < H; y += 40) body += rect(0, y, W, 1, "#FFFFFF", 0, 'fill-opacity="0.05"');

  body += `<g filter="url(#sh)">${rect(70, 60, 1060, 680, o.board, 22)}</g>`;
  body += text(120, 140, o.name, 40, o.ink, { weight: 800, spacing: -0.5 });
  body += text(122, 172, "Tokens · Tipografia · Componentes · v2.1", 16, o.muted);
  body += rect(980, 112, 100, 32, o.primary, 16, 'fill-opacity="0.15"') + text(1030, 133, "Figma", 14, o.primary, { anchor: "middle", weight: 700 });

  // paleta
  o.palette.forEach((c, i) => {
    const x = 120 + i * 160;
    body += rect(x, 214, 140, 100, c.hex, 14);
    body += text(x, 340, c.name, 14, o.ink, { weight: 700 });
    body += text(x, 360, c.hex.toUpperCase(), 13, o.muted);
  });

  // tipografia
  body += rect(120, 400, 300, 290, o.bg, 16, 'fill-opacity="0.08"');
  body += text(150, 520, "Aa", 110, o.ink, { weight: 700 });
  body += text(150, 570, "Inter / Display", 16, o.muted);
  [["H1", 30], ["H2", 24], ["Body", 16]].forEach(([l, s], i) => {
    body += text(150, 615 + i * 26, `${l} · ${s}px`, 14, o.ink, { weight: i === 0 ? 700 : 500 });
  });

  // componentes
  const cx = 450;
  body += rect(cx, 400, 180, 48, o.primary, 24) + text(cx + 90, 430, "Confirmar", 16, "#FFFFFF", { anchor: "middle", weight: 700 });
  body += rect(cx + 196, 400, 160, 48, "none", 24, `stroke="${o.primary}" stroke-width="2"`) + text(cx + 276, 430, "Cancelar", 16, o.primary, { anchor: "middle", weight: 700 });
  body += rect(cx + 372, 400, 260, 48, o.board, 10, `stroke="${o.muted}" stroke-opacity="0.5" stroke-width="1.5"`) + text(cx + 390, 430, "nome@email.com", 15, o.muted);
  // toggles e chips
  body += rect(cx, 476, 64, 34, o.primary, 17) + `<circle cx="${cx + 47}" cy="493" r="13" fill="#FFFFFF"/>`;
  body += rect(cx + 80, 476, 64, 34, o.muted, 17, 'fill-opacity="0.35"') + `<circle cx="${cx + 97}" cy="493" r="13" fill="#FFFFFF"/>`;
  ["Novo", "Em análise", "Publicado"].forEach((ch, i) => {
    const colors = [o.secondary, "#F5B400", o.primary];
    const w = ch.length * 8 + 30;
    const x = cx + 170 + [0, 76, 196][i];
    body += rect(x, 478, w, 30, colors[i], 15, 'fill-opacity="0.18"') + text(x + w / 2, 498, ch, 13, colors[i], { anchor: "middle", weight: 700 });
  });
  // card
  body += `<g filter="url(#shs)">${rect(cx, 536, 300, 154, o.board, 16)}</g>`;
  body += rect(cx + 16, 552, 268, 70, o.secondary, 10, 'fill-opacity="0.85"');
  body += rect(cx + 16, 638, 160, 11, o.ink, 5.5, 'fill-opacity="0.8"') + rect(cx + 16, 660, 110, 9, o.muted, 4.5, 'fill-opacity="0.5"');
  // alerta e slider
  body += rect(cx + 320, 536, 312, 56, o.secondary, 12, 'fill-opacity="0.15"') + `<circle cx="${cx + 348}" cy="564" r="11" fill="${o.secondary}"/>` + text(cx + 370, 569, "Alterações salvas", 15, o.ink, { weight: 600 });
  body += rect(cx + 320, 630, 312, 8, o.muted, 4, 'fill-opacity="0.3"') + rect(cx + 320, 630, 200, 8, o.primary, 4) + `<circle cx="${cx + 520}" cy="634" r="13" fill="#FFFFFF" stroke="${o.primary}" stroke-width="4"/>`;
  body += text(cx + 320, 676, "Espaçamento base: 8px", 14, o.muted);
  return svg("", body);
}
