import React from 'react';

export default function EngineCushionShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Engine Deck Wooden Base */}
      <mesh position={[0, -h/4, 0]}>
        <boxGeometry args={[w, h/2, d]} />
        <meshStandardMaterial color="#9ca3af" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Padded Mattress/Cushion on top */}
      <mesh position={[0, h/4, 0]}>
        <boxGeometry args={[w - 0.02, h/2, d - 0.02]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.9} />
      </mesh>
    </group>
  );
}
