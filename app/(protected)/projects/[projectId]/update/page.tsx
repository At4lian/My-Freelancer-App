import { getProjectById } from '@/data/projects';
import { requireUser } from '@/hooks/require-user';
import EditProjectForm from '@/components/edit-project';
import { notFound } from 'next/navigation';
import React from 'react';

interface UpdateProjectPageProps {
  params: { projectId: string };
}

export default async function UpdateProjectPage({ params }: UpdateProjectPageProps) {
  const session = await requireUser();
  const project = await getProjectById(params.projectId, session.user.id as string);

  if (!project) {
    notFound();
  }

  const initialData = {
    name: project.name,
    description: project.description || '',
    startDate: project.start_date || new Date(),
    endDate: project.end_date || new Date(),
    deadlineDate: project.deadline_date || new Date(),
    customerId: project.customerId,
    priority: project.priority,
  } as const;

  return (
    <div className="container mx-auto py-10">
      <EditProjectForm projectId={project.id} initialData={initialData} />
    </div>
  );
}
