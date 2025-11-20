'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { mockCourses } from './_data/courses';

// ✅ 여기서 MapView를 dynamic + ssr:false로 불러온다
const MapView = dynamic(() => import('./components/MapView'), {
  ssr: false,
});

function HomeClient() {
  const [selectedId, setSelectedId] = useState<string | undefined>(
    mockCourses[0]?.id,
  );

  const selectedCourse = mockCourses.find((c) => c.id === selectedId);

  return (
    <main className="flex h-screen">
      {/* 왼쪽: 코스 리스트 */}
      <section className="w-full max-w-md border-r border-gray-200 flex flex-col">
        <header className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">동네 러닝 코스</h1>
          <p className="text-sm text-gray-500">
            내가 뛰어본 코스를 공유하고, 다른 러너 코스도 구경해보세요.
          </p>
        </header>

        <div className="flex-1 overflow-y-auto">
          {mockCourses.map((course) => (
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
                {course.region} · {course.distanceKm}km · {course.estimatedMinutes}분
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
          courses={mockCourses}
          selectedCourseId={selectedId}
          onSelectCourse={setSelectedId}
        />
      </section>
    </main>
  );
}

export default function HomePage() {
  return <HomeClient />;
}
