import React from 'react';

export default function SwivelSeatShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Base Cylinder */}
      <mesh position={[0, -h/2 + 0.15, 0]}>
        <cylinderGeometry args={[0.08, 0.12, 0.3, 16]} />
        <meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Seat Cushion */}
      <mesh position={[0, -h/2 + 0.35, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Backrest (Slanted) */}
      <mesh position={[0, -h/2 + 0.65, -0.2]} rotation={[-0.1, 0, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.1]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Armrests */}
      <mesh position={[-0.22, -h/2 + 0.5, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#1E293B" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <mesh position={[0.22, -h/2 + 0.5, 0]}>
        <boxGeometry args={[0.05, 0.05, 0.3]} />
        <meshStandardMaterial color="#1E293B" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Green Swivel Gizmo Ring */}
      <mesh position={[0, -h/2 + 0.01, 0]} rotation={[-Math.PI/2, 0, 0]}>
        <ringGeometry args={[0.2, 0.22, 32]} />
        <meshBasicMaterial color="#22C55E" />
      </mesh>
    </group>
  );
}
