import type { Metadata } from "next";
import MyProjectsView from "@/components/projects/my-projects-view";
import { getMyProfile, getMyProjects, getPopularTags } from "@/lib/queries";

export const metadata: Metadata = { title: "Meus projetos" };

export default async function MeusProjetosPage() {
  const [profile, projects, tagSuggestions] = await Promise.all([
    getMyProfile(),
    getMyProjects(),
    getPopularTags(),
  ]);

  return <MyProjectsView profile={profile} projects={projects} tagSuggestions={tagSuggestions} />;
}
