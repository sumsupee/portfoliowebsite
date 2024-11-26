// app/api/projects/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getProjectData } from '../../../../lib/markdown';

interface Context {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: Context
) {
  const { id } = await params;

  try {
    const project = await getProjectData(id);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: 'Project not found' },
      { status: 404 }
    );
  }
}
