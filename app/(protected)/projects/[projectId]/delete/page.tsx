import { requireUser } from '@/hooks/require-user';
import { getProjectById } from '@/data/projects';
import { deleteProject } from '@/actions/projects/delete-project';
import { redirect } from 'next/navigation';

interface DeleteProjectPageProps {
  params: { projectId: string };
}

export default async function DeleteProjectPage({ params }: DeleteProjectPageProps) {
  const session = await requireUser();
  const project = await getProjectById(params.projectId, session.user.id as string);

  if (!project) {
    redirect('/dashboard');
  }

  await deleteProject(project.id);
  redirect('/dashboard');
}
