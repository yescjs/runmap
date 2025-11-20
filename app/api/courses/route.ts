import { NextResponse } from 'next/server';
import { prisma } from '@/app/lib/prisma';

export async function GET() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
  });

  // tags, path JSON 문자열을 파싱해서 반환
  const parsed = courses.map((c) => ({
    id: c.id,
    title: c.title,
    description: c.description,
    distanceKm: c.distanceKm,
    estimatedMinutes: c.estimatedMinutes,
    level: c.level as 'EASY' | 'NORMAL' | 'HARD',
    region: c.region,
    tags: JSON.parse(c.tags) as string[],
    path: JSON.parse(c.path) as { lat: number; lng: number }[],
    createdAt: c.createdAt,
  }));

  return NextResponse.json(parsed);
}

export async function POST(request: Request) {
  const body = await request.json();

  const {
    title,
    description,
    distanceKm,
    estimatedMinutes,
    level,
    region,
    tags,
    path,
  } = body;

  if (!title || !path || path.length < 2) {
    return NextResponse.json(
      { error: 'title과 path(2점 이상)는 필수입니다.' },
      { status: 400 },
    );
  }

  const course = await prisma.course.create({
    data: {
      title,
      description: description ?? '',
      distanceKm: distanceKm ?? null,
      estimatedMinutes: estimatedMinutes ?? null,
      level: level ?? 'EASY',
      region: region ?? '',
      tags: JSON.stringify(tags ?? []),
      path: JSON.stringify(path ?? []),
    },
  });

  return NextResponse.json({ id: course.id }, { status: 201 });
}
