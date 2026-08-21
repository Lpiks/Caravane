import React from 'react';

export default function DieselHeaterShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Heater Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Hot Air Output Pipe */}
      <mesh position={[w/2 + 0.02, -h/4, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.04, 16]} />
        <meshStandardMaterial color="#EA580C" metalness={0.8} />
      </mesh>
      {/* Small Grill Lines */}
      <mesh position={[w/2 + 0.005, h/4, 0]}>
        <boxGeometry args={[0.01, h/3, d/2]} />
        <meshStandardMaterial color="#111827" />
      </mesh>
    </group>
  );
}
