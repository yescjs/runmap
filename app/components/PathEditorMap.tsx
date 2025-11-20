'use client';

import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMapEvents,
} from 'react-leaflet';
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

export type Coordinate = {
  lat: number;
  lng: number;
};

type PathEditorMapProps = {
  path: Coordinate[];
  onChangePath: (path: Coordinate[]) => void;
};

// 지도 클릭 이벤트 핸들러
function ClickHandler({ onAddPoint }: { onAddPoint: (c: Coordinate) => void }) {
  useMapEvents({
    click(e) {
      onAddPoint({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function PathEditorMap({ path, onChangePath }: PathEditorMapProps) {
  const defaultCenter: LatLngExpression = [37.5665, 126.978]; // 서울 시청 근처

  const positions: LatLngExpression[] = path.map((p) => [p.lat, p.lng]);

  const handleAddPoint = (coord: Coordinate) => {
    onChangePath([...path, coord]);
  };

  const handleUndo = () => {
    if (!path.length) return;
    onChangePath(path.slice(0, path.length - 1));
  };

  const handleClear = () => {
    onChangePath([]);
  };

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex gap-2 p-2 text-xs">
        <button
          type="button"
          onClick={handleUndo}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          마지막 점 삭제
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="px-2 py-1 border rounded hover:bg-gray-100"
        >
          전체 초기화
        </button>
        <span className="text-gray-500 ml-auto">
          지도를 클릭해서 경로를 추가하세요.
        </span>
      </div>

      <div className="flex-1">
        <MapContainer
          center={path[0] ? [path[0].lat, path[0].lng] : defaultCenter}
          zoom={13}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler onAddPoint={handleAddPoint} />

          {positions.length > 0 && (
            <>
              <Polyline positions={positions} pathOptions={{ weight: 4 }} />
              {/* 시작점 / 마지막점 표시 */}
              <Marker position={positions[0]} />
              {positions.length > 1 && (
                <Marker position={positions[positions.length - 1]} />
              )}
            </>
          )}
        </MapContainer>
      </div>
    </div>
  );
}
