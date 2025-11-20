'use client';

import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

type Coordinate = { lat: number; lng: number };

export type Course = {
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

type MapViewProps = {
  courses: Course[];
  selectedCourseId?: number;
  onSelectCourse?: (id: number) => void;
};

export default function MapView({
  courses,
  selectedCourseId,
  onSelectCourse,
}: MapViewProps) {
  const defaultCenter: LatLngExpression = [37.5665, 126.978];

  const selectedCourse =
    courses.find((c) => c.id === selectedCourseId) || courses[0];

  const center: LatLngExpression =
    selectedCourse && selectedCourse.path.length > 0
      ? [selectedCourse.path[0].lat, selectedCourse.path[0].lng]
      : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {courses.map((course) => {
        if (!course.path.length) return null;

        const positions: LatLngExpression[] = course.path.map((p) => [
          p.lat,
          p.lng,
        ]);

        return (
          <Polyline
            key={course.id}
            positions={positions}
            pathOptions={{
              weight: course.id === selectedCourseId ? 6 : 4,
            }}
          />
        );
      })}

      {courses.map((course) => {
        if (!course.path.length) return null;
        const start: LatLngExpression = [
          course.path[0].lat,
          course.path[0].lng,
        ];

        return (
          <Marker
            key={course.id + '-marker'}
            position={start}
            eventHandlers={{
              click: () => onSelectCourse && onSelectCourse(course.id),
            }}
          >
            <Popup>
              <div className="text-sm">
                <div className="font-semibold">{course.title}</div>
                <div>
                  {course.distanceKm ?? '?'} km · {course.region ?? '지역 미입력'}
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
