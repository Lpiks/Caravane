import React from 'react';

export default function WaterTankShape({ w, h, d, color, opacity }) {
  return (
    <group>
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[h / 2, h / 2, w, 32]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* End caps */}
      <mesh position={[w / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[h / 2 - 0.02, h / 2 - 0.02, 0.04, 32]} />
        <meshStandardMaterial color="#1f2937" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <mesh position={[-w / 2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[h / 2 - 0.02, h / 2 - 0.02, 0.04, 32]} />
        <meshStandardMaterial color="#1f2937" transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}
