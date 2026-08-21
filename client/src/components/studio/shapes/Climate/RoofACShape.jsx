import React from 'react';

export default function RoofACShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Shroud */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Top Fan Grille */}
      <mesh position={[0, h / 2 + 0.005, -d / 4]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[w / 3, 16]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
      {/* Rear Vents */}
      <mesh position={[0, 0, d / 2 + 0.005]}>
        <boxGeometry args={[w - 0.1, h / 2, 0.01]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
    </group>
  );
}
