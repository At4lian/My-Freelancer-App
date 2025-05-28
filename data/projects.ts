import { db } from "@/lib/db";

export const getProjectByName = async (name: string, userId: string) => {
  try {
    const project = await db.project.findFirst({
      where: {
        name,
        createdByUserId: userId,
      }
    });

    return project;
  } catch {
    return null;
  }
}

export const getProjectById = async (id: string, userId: string) => {
  try {
    const project = await db.project.findFirst({
      where: {
        id,
        createdByUserId: userId,
      }
    });

    return project;
  } catch {
    return null;
  }
}
