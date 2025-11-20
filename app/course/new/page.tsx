'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { Coordinate } from '../../components/PathEditorMap';

const PathEditorMap = dynamic(
  () => import('../../components/PathEditorMap'),
  { ssr: false },
);

export default function NewCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [region, setRegion] = useState('');
  const [description, setDescription] = useState('');
  const [distanceKm, setDistanceKm] = useState('');
  const [estimatedMinutes, setEstimatedMinutes] = useState('');
  const [level, setLevel] = useState<'EASY' | 'NORMAL' | 'HARD'>('EASY');
  const [tagText, setTagText] = useState('야간좋음,강변,초보추천');
  const [path, setPath] = useState<Coordinate[]>([]);
  const [resultJson, setResultJson] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      alert('코스 이름을 입력해주세요.');
      return;
    }
    if (path.length < 2) {
      alert('경로를 2점 이상 찍어주세요.');
      return;
    }

    const tags = tagText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title,
      region,
      description,
      distanceKm: distanceKm ? Number(distanceKm) : null,
      estimatedMinutes: estimatedMinutes ? Number(estimatedMinutes) : null,
      level,
      tags,
      path,
    };

    setResultJson(JSON.stringify(payload, null, 2));
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.error('POST /api/courses error:', data);
        alert('저장 중 오류가 발생했습니다.');
        return;
      }

      const data = await res.json();
      console.log('생성된 코스 ID:', data.id);

      alert('코스가 저장되었습니다.');
      router.push('/');
    } catch (err) {
      console.error(err);
      alert('네트워크 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex flex-col h-screen">
      <header className="p-4 border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">새 러닝 코스 등록</h1>
          <p className="text-sm text-gray-500">
            지도를 클릭해 경로를 만들고, 코스 정보를 입력하세요.
          </p>
        </div>
        <a
          href="/"
          className="text-sm px-3 py-1 border rounded hover:bg-gray-50"
        >
          ← 목록으로
        </a>
      </header>

      <div className="flex flex-1">
        {/* 왼쪽: 폼 */}
        <section className="w-full max-w-md border-r border-gray-200 p-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                코스 이름
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="예) 뚝섬 한강공원 왕복 5km"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                지역
              </label>
              <input
                type="text"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="예) 서울 성동구"
              />
            </div>

            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  거리 (km)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={distanceKm}
                  onChange={(e) => setDistanceKm(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="예) 5.2"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">
                  예상 시간 (분)
                </label>
                <input
                  type="number"
                  value={estimatedMinutes}
                  onChange={(e) => setEstimatedMinutes(e.target.value)}
                  className="w-full border rounded px-2 py-1 text-sm"
                  placeholder="예) 30"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                난이도
              </label>
              <select
                value={level}
                onChange={(e) =>
                  setLevel(e.target.value as 'EASY' | 'NORMAL' | 'HARD')
                }
                className="w-full border rounded px-2 py-1 text-sm"
              >
                <option value="EASY">EASY (초보 추천)</option>
                <option value="NORMAL">NORMAL (보통)</option>
                <option value="HARD">HARD (언덕/고난도)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                태그 (쉼표로 구분)
              </label>
              <input
                type="text"
                value={tagText}
                onChange={(e) => setTagText(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
                placeholder="예) 야간좋음,강변,초보추천"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                코스 설명
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm h-24"
                placeholder="예) 강변 위주 평지, 야간 가로등 많고 자전거도로와 분리되어 있어 초보자도 안전합니다."
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white text-sm font-semibold py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={isSubmitting}
              >
                {isSubmitting ? '저장 중...' : '코스 저장하기'}
              </button>
            </div>
          </form>

          {resultJson && (
            <div className="mt-4">
              <h2 className="text-sm font-semibold mb-1">생성된 JSON</h2>
              <pre className="text-xs bg-gray-100 p-2 rounded max-h-64 overflow-auto">
{resultJson}
              </pre>
            </div>
          )}
        </section>

        {/* 오른쪽: 지도 편집기 */}
        <section className="flex-1">
          <PathEditorMap path={path} onChangePath={setPath} />
        </section>
      </div>
    </main>
  );
}
