import { NextResponse } from 'next/server';
import { db } from '@/lib/db';


export async function GET(
  request: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
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
        id: resolvedParams.projectId
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Zákazník nenalezen' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal Server Error' },
      { status: 500 }
    );
  }
}