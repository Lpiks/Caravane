import React from 'react';

export default function CassetteToiletShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Base Box (The cassette housing) */}
      <mesh position={[0, -h/4, 0]}>
        <boxGeometry args={[w, h/2, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Toilet Bowl (Cylinder sitting on base) */}
      <mesh position={[0, h/8, 0]}>
        <cylinderGeometry args={[w/2.2, w/2, h/4, 32]} />
        <meshStandardMaterial color="#ffffff" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Seat / Lid (Thin flat cylinder on top of bowl) */}
      <mesh position={[0, h/4 + 0.02, 0]}>
        <cylinderGeometry args={[w/2.2, w/2.2, 0.04, 32]} />
        <meshStandardMaterial color="#e5e7eb" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Back Flush Tank */}
      <mesh position={[0, h/8, -d/2 + 0.08]}>
        <boxGeometry args={[w, h/1.5, 0.16]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
    </group>
  );
}
