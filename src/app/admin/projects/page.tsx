import type { Metadata } from "next";
import { readContentFile } from "@/lib/content/read";
import { ProjectsEditor } from "@/components/admin/editors/projects-editor";
import { ContentError } from "@/components/admin/content-error";
import type { Projects } from "@/types/content";

export const metadata: Metadata = { title: "Projects", robots: { index: false, follow: false } };

export default async function ProjectsPage() {
  let projects: Projects;
  try {
    projects = await readContentFile<Projects>("projects");
  } catch (error) {
    return <ContentError title="Unable to load projects content" message={String(error)} />;
  }
  return (
    <ProjectsEditor
      initialHeading={projects.heading}
      initialSubheading={projects.subheading}
      initialProjects={projects.projects}
    />
  );
}