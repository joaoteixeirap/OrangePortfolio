import type { Metadata } from "next";
import DiscoverView from "@/components/projects/discover-view";
import { getDiscoverProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Descobrir" };

export default async function DescobrirPage() {
  const projects = await getDiscoverProjects();
  return <DiscoverView projects={projects} />;
}
