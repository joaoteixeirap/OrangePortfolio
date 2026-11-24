"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Popover from "@mui/material/Popover";
import Logout from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { signOut } from "@/app/(auth)/actions";
import UserAvatar from "@/components/user-avatar";
import { fullName, type Author } from "@/lib/projects";

type AppHeaderProps = {
  user: Pick<Author, "nome" | "sobrenome" | "avatar_url"> & { email: string };
};

const NAV = [
  { href: "/meus-projetos", label: "Meus projetos" },
  { href: "/descobrir", label: "Descobrir" },
];

/** Nome e e-mail no topo dos menus (não recebe foco do teclado). */
function UserInfo({ name, email }: { name: string; email: string }) {
  return (
    <li className="list-none px-4 pb-2 pt-1" role="none">
      <p className="text-base text-neutral-120">{name}</p>
      <p className="text-sm text-neutral-110">{email}</p>
    </li>
  );
}
UserInfo.muiSkipListHighlight = true;

export default function AppHeader({ user }: AppHeaderProps) {
  const pathname = usePathname();
  const [mobileAnchor, setMobileAnchor] = useState<HTMLElement | null>(null);
  const [profileAnchor, setProfileAnchor] = useState<HTMLElement | null>(null);
  const [bellAnchor, setBellAnchor] = useState<HTMLElement | null>(null);
  const [signingOut, startTransition] = useTransition();
  const name = fullName(user);

  const userInfo = <UserInfo name={name} email={user.email} />;

  const logoutItem = (
    <MenuItem onClick={() => startTransition(() => signOut())} disabled={signingOut}>
      <ListItemIcon>
        <Logout fontSize="small" />
      </ListItemIcon>
      {signingOut ? "Saindo…" : "Sair"}
    </MenuItem>
  );

  return (
    <header className="sticky top-0 z-40 bg-principal-100 text-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]">
      <div className="flex h-14 items-center justify-between px-3 sm:h-16 sm:px-6 lg:h-[73px] lg:px-6">
        <div className="flex items-center gap-1 lg:gap-0">
          <IconButton
            className="lg:!hidden"
            color="inherit"
            aria-label="Abrir menu"
            aria-controls={mobileAnchor ? "menu-mobile" : undefined}
            aria-haspopup="true"
            aria-expanded={mobileAnchor ? "true" : undefined}
            onClick={(e) => setMobileAnchor(e.currentTarget)}
          >
            <MenuIcon />
          </IconButton>

          <Link href="/meus-projetos" className="flex items-center rounded" aria-label="Orange Portfólio, ir para Meus projetos">
            <Image
              src="/logo_home.png"
              width={1200}
              height={450}
              alt=""
              priority
              className="h-8 w-auto sm:h-9 lg:h-[42px]"
            />
          </Link>

          <nav aria-label="Principal" className="hidden lg:ml-[86px] lg:block">
            <ul className="flex items-center gap-6">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`rounded px-1 py-1 text-xl font-medium transition-colors hover:text-secondary-70 ${
                        active ? "underline decoration-secondary-100 decoration-2 underline-offset-8" : ""
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <IconButton
            aria-label="Abrir menu da conta"
            aria-controls={profileAnchor ? "menu-perfil" : undefined}
            aria-haspopup="true"
            aria-expanded={profileAnchor ? "true" : undefined}
            onClick={(e) => setProfileAnchor(e.currentTarget)}
            sx={{ p: 0.5 }}
          >
            <UserAvatar person={user} size={40} decorative />
          </IconButton>
          <IconButton
            color="inherit"
            aria-label="Notificações"
            onClick={(e) => setBellAnchor(e.currentTarget)}
          >
            <NotificationsIcon />
          </IconButton>
        </div>
      </div>

      {/* Menu mobile (hamburger), como no style guide */}
      <Menu
        id="menu-mobile"
        anchorEl={mobileAnchor}
        open={Boolean(mobileAnchor)}
        onClose={() => setMobileAnchor(null)}
        onClick={() => setMobileAnchor(null)}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        {userInfo}
        <Divider />
        {NAV.map((item) => (
          <MenuItem
            key={item.href}
            component={Link}
            href={item.href}
            selected={pathname.startsWith(item.href)}
          >
            {item.label}
          </MenuItem>
        ))}
        <Divider />
        {logoutItem}
      </Menu>

      <Menu
        id="menu-perfil"
        anchorEl={profileAnchor}
        open={Boolean(profileAnchor)}
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 220, mt: 1 } } }}
      >
        {userInfo}
        <Divider />
        {logoutItem}
      </Menu>

      <Popover
        open={Boolean(bellAnchor)}
        anchorEl={bellAnchor}
        onClose={() => setBellAnchor(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { mt: 1, px: 2, py: 1.5 } } }}
      >
        <p className="text-sm text-neutral-110">Você não tem notificações.</p>
      </Popover>
    </header>
  );
}
