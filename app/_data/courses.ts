export type Coordinate = {
  lat: number;
  lng: number;
};

export type Course = {
  id: string;
  title: string;
  description: string;
  distanceKm: number;
  estimatedMinutes: number;
  level: 'EASY' | 'NORMAL' | 'HARD';
  region: string;
  tags: string[];
  path: Coordinate[];
};

export const mockCourses: Course[] = [
  {
    id: '1',
    title: '뚝섬 한강공원 러닝 코스',
    description: '강변 따라 왕복 5km, 야간 가로등 많고 자전거도로와 분리된 구간이 많아요.',
    distanceKm: 5.2,
    estimatedMinutes: 30,
    level: 'EASY',
    region: '서울 성동구',
    tags: ['야간좋음', '강변', '초보추천'],
    path: [
      { lat: 37.53125, lng: 127.0678 },
      { lat: 37.5322, lng: 127.073 },
      { lat: 37.5331, lng: 127.079 },
      { lat: 37.5338, lng: 127.085 },
    ],
  },
  {
    id: '2',
    title: '올림픽공원 외곽 순환 코스',
    description: '공원 외곽 순환 3km, 거의 평지라 가볍게 돌기 좋아요.',
    distanceKm: 3.1,
    estimatedMinutes: 20,
    level: 'EASY',
    region: '서울 송파구',
    tags: ['공원', '평지', '가족런'],
    path: [
      { lat: 37.5175, lng: 127.1213 },
      { lat: 37.517, lng: 127.126 },
      { lat: 37.5162, lng: 127.129 },
      { lat: 37.5152, lng: 127.124 },
    ],
  },
  {
    id: '3',
    title: '남산 언덕 러닝 코스',
    description: '오르막 많은 코스, 체력 키우기용. 초보에겐 다소 빡셈.',
    distanceKm: 4.0,
    estimatedMinutes: 35,
    level: 'HARD',
    region: '서울 중구',
    tags: ['언덕많음', '뷰좋음', '체력강화'],
    path: [
      { lat: 37.5521, lng: 126.985 },
      { lat: 37.5532, lng: 126.987 },
      { lat: 37.554, lng: 126.989 },
      { lat: 37.555, lng: 126.991 },
    ],
  },
];
