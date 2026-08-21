import React from 'react';

export default function GreyWaterTankShape({ w, h, d, color, opacity }) {
  const finalOpacity = Math.min(0.4, opacity);
  
  return (
    <group>
      {/* Main Tank Body */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={true} opacity={finalOpacity} roughness={0.2} />
      </mesh>
      {/* Small Outlet Pipe */}
      <mesh position={[w/2 + 0.02, -h/4, 0]} rotation={[0, 0, Math.PI/2]}>
        <cylinderGeometry args={[0.03, 0.03, 0.04, 16]} />
        <meshStandardMaterial color="#9ca3af" metalness={0.8} />
      </mesh>
    </group>
  );
}
