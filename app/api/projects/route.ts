// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import { getAllProjects } from '../../../lib/markdown';

export async function GET() {
  const projects = getAllProjects();
  return NextResponse.json(projects);
}
