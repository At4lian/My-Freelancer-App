import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireUser } from "@/hooks/require-user";


export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const session = await requireUser();
  try {
    const resolvedParams = await params;
    
    if (!resolvedParams?.projectId) {
      return NextResponse.json(
        { error: 'projectId is required' },
        { status: 400 }
      );
    }

    const project = await db.project.findUnique({
      where: { 
        id: resolvedParams.projectId,
        userId: session.user?.id,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Zákazník nenalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { error: 'Chyba serveru' },
      { status: 500 }
    );
  }
}