"use server"

import { z } from "zod";

import { db } from "@/lib/db";
import { CreateProjectSchema } from "@/schemas";
import { getProjectByName } from "@/data/projects";
import { requireUser } from "@/hooks/require-user";

export const createProject = async (values: z.infer<typeof CreateProjectSchema>) => {
  const validateFields = CreateProjectSchema.safeParse(values);

  if (!validateFields.success) {
    return { error: "Neplatné záznamy!" };
  }

  const { name, description, startDate, endDate, deadlineDate, customerId, priority } = validateFields.data;

  const session = await requireUser();

  const existingProjectName = await getProjectByName(name, session.user.id as string);

  if (existingProjectName) {
    return { error: `Project with this name "${name}" already exist!` };
  }

  

  await db.project.create({
    data: {
      name,
      description,
      start_date: startDate,
      end_date: endDate,
      deadline_date: deadlineDate,
      customerId,
      priority,
      createdByUserId: session.user?.id as string
    }
  });

  return { success: `Project "${name}" has been successfully created!` };
}