import { getProjectById } from '@/data/projects';
import { requireUser } from '@/hooks/require-user';
import { notFound } from 'next/navigation';
import React from 'react';

interface ProjectPageProps {
  params: { projectId: string };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const session = await requireUser();
  const project = await getProjectById(params.projectId, session.user.id as string);

  if (!project) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">{project.name}</h1>
      {project.description && <p className="mb-2">{project.description}</p>}
      <div className="text-sm text-muted-foreground space-y-1">
        {project.start_date && (
          <p>Start: {project.start_date.toDateString()}</p>
        )}
        {project.end_date && <p>End: {project.end_date.toDateString()}</p>}
        {project.deadline_date && (
          <p>Deadline: {project.deadline_date.toDateString()}</p>
        )}
        <p>Priority: {project.priority}</p>
        <p>Status: {project.status}</p>
      </div>
    </div>
  );
}
