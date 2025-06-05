"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { CreateProjectSchema } from "@/schemas";
import { getProjectById } from "@/data/projects";
import { requireUser } from "@/hooks/require-user";

export const updateProject = async (
  id: string,
  values: z.infer<typeof CreateProjectSchema>
) => {
  const validatedFields = CreateProjectSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Neplatné záznamy!" };
  }

  const session = await requireUser();

  const existingProject = await getProjectById(id, session.user.id as string);

  if (!existingProject) {
    return { error: "Project not found!" };
  }

  const {
    name,
    description,
    startDate,
    endDate,
    deadlineDate,
    customerId,
    priority,
  } = validatedFields.data;

  await db.project.update({
    where: { id },
    data: {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      deadline_date: deadlineDate,
      customerId,
      priority,
    },
  });

  return { success: `Project "${name}" updated!` };
};
