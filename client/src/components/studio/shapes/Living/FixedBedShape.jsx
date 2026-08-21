import React from 'react';

export default function FixedBedShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Wooden Slatted Frame / Platform */}
      <mesh position={[0, -h/2 + 0.05, 0]}>
        <boxGeometry args={[w, 0.1, d]} />
        <meshStandardMaterial color="#9ca3af" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Thick Mattress */}
      <mesh position={[0, h/2 - 0.15, 0]}>
        <boxGeometry args={[w - 0.05, 0.3, d - 0.05]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.9} />
      </mesh>
      {/* Pillows */}
      <mesh position={[-w/4, h/2 + 0.05, d/2 - 0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color="#f8fafc" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      <mesh position={[w/4, h/2 + 0.05, d/2 - 0.2]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.1, 0.3]} />
        <meshStandardMaterial color="#f8fafc" transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}
