'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

// API에서 받아올 타입 정의
type Coordinate = { lat: number; lng: number };

type Course = {
  id: number;
  title: string;
  description: string;
  distanceKm: number | null;
  estimatedMinutes: number | null;
  level: 'EASY' | 'NORMAL' | 'HARD';
  region: string | null;
  tags: string[];
  path: Coordinate[];
};

const MapView = dynamic(() => import('./components/MapView'), {
  ssr: false,
});

function HomeClient() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedId, setSelectedId] = useState<number | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const selectedCourse = courses.find((c) => c.id === selectedId);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/courses');
        const data: Course[] = await res.json();
        setCourses(data);
        if (data.length > 0) {
          setSelectedId(data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  return (
    <main className="flex h-screen">
      {/* 왼쪽: 코스 리스트 */}
      <section className="w-full max-w-md border-r border-gray-200 flex flex-col">
        <header className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">동네 러닝 코스</h1>
            <p className="text-sm text-gray-500">
              내가 뛰어본 코스를 공유하고, 다른 러너 코스도 구경해보세요.
            </p>
          </div>
          <a
            href="/course/new"
            className="text-xs px-3 py-1 border rounded bg-blue-50 text-blue-700 hover:bg-blue-100"
          >
            + 새 코스
          </a>
        </header>

        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="p-4 text-sm text-gray-500">코스를 불러오는 중...</div>
          )}

          {!loading && courses.length === 0 && (
            <div className="p-4 text-sm text-gray-500">
              아직 등록된 코스가 없습니다.
              <br />
              상단의 <span className="font-semibold">+ 새 코스</span> 버튼을 눌러
              첫 코스를 등록해보세요.
            </div>
          )}

          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => setSelectedId(course.id)}
              className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 ${
                course.id === selectedId ? 'bg-gray-100' : ''
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="font-semibold">{course.title}</div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-gray-200">
                  {course.level}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                {course.region ?? '지역 미입력'} ·{' '}
                {course.distanceKm ? `${course.distanceKm}km` : '거리 미입력'} ·{' '}
                {course.estimatedMinutes
                  ? `${course.estimatedMinutes}분`
                  : '시간 미입력'}
              </div>
              <div className="mt-1 text-xs text-gray-600 line-clamp-2">
                {course.description}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {course.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-600"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {selectedCourse && (
          <footer className="p-3 border-t border-gray-200 text-xs text-gray-600">
            선택된 코스:{' '}
            <span className="font-semibold">{selectedCourse.title}</span>
          </footer>
        )}
      </section>

      {/* 오른쪽: 지도 */}
      <section className="flex-1">
        <MapView
          courses={courses}
          selectedCourseId={selectedId}
          onSelectCourse={(id) => setSelectedId(id)}
        />
      </section>
    </main>
  );
}

export default function HomePage() {
  return <HomeClient />;
}
