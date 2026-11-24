import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Providers from "./providers";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: {
    default: "Orange Portfólio",
    template: "%s | Orange Portfólio",
  },
  description:
    "Cadastre, organize e compartilhe seus projetos. Descubra o trabalho de outras pessoas da comunidade.",
};

export const viewport: Viewport = {
  themeColor: "#111133",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={roboto.variable}>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
