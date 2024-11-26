// app/api/projects/[id]/route.ts
import { NextResponse } from 'next/server';
import { getProjectData } from '../../../../lib/markdown';

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  const { id } = await context.params;

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
