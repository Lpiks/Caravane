import React from 'react';

export default function MaxxairFanShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Base Flange */}
      <mesh position={[0, -h / 4, 0]}>
        <boxGeometry args={[w, h / 2, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Open Lid (Tilted) */}
      <mesh position={[0, h / 2, d / 4]} rotation={[-0.4, 0, 0]}>
        <boxGeometry args={[w, 0.05, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Fan Blades (Dark circle inside) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[w / 2.5, 16]} />
        <meshBasicMaterial color="#111827" />
      </mesh>
    </group>
  );
}
