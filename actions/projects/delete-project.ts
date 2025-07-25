"use server";

import { db } from "@/lib/db";
import { getProjectById } from "@/data/projects";
import { requireUser } from "@/hooks/require-user";

export const deleteProject = async (id: string) => {
  const session = await requireUser();

  const existingProject = await getProjectById(id, session.user.id as string);

  if (!existingProject) {
    return { error: "Project not found!" };
  }

  await db.project.delete({
    where: { id },
  });

  return { success: `Project "${existingProject.name}" deleted!` };
};
