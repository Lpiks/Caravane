import React from 'react';

export default function SolarArrayShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Silver Frame */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Dark Blue Photovoltaic Glass */}
      <mesh position={[0, h/2 + 0.005, 0]}>
        <boxGeometry args={[w - 0.05, 0.01, d - 0.05]} />
        <meshStandardMaterial color="#1e3a8a" roughness={0.1} metalness={0.8} transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}
