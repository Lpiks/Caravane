import React from 'react';

export default function SideAwningShape({ w, h, d, color, opacity, parentX }) {
  const isRightSide = (parentX || 0) >= 0;
  
  return (
    <group>
      {/* Metal Cassette Housing (Cylindrical running along Z-axis) */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[h / 2, h / 2, w, 16]} />
        <meshStandardMaterial color={color} metalness={0.8} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Extended Awning Fabric (rolls out along X-axis away from van) */}
      <mesh position={[isRightSide ? 1.0 : -1.0, -0.05, 0]}>
        <boxGeometry args={[2.0, 0.02, w - 0.1]} />
        <meshStandardMaterial color="#F59E0B" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
