import React from 'react';

export default function GasLockerShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Locker Box */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#EAB308" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Sealed Lid/Door */}
      <mesh position={[0, h/2 + 0.01, 0]}>
        <boxGeometry args={[w - 0.05, 0.02, d - 0.05]} />
        <meshStandardMaterial color="#374151" />
      </mesh>
      {/* Gas Hazard Badge Black Background */}
      <mesh position={[0, 0, d/2 + 0.005]}>
        <planeGeometry args={[0.12, 0.12]} />
        <meshBasicMaterial color="#000000" />
      </mesh>
      {/* Gas Hazard Badge Yellow Diamond */}
      <mesh position={[0, 0, d/2 + 0.006]} rotation={[0, 0, Math.PI/4]}>
        <planeGeometry args={[0.07, 0.07]} />
        <meshBasicMaterial color="#EAB308" />
      </mesh>
    </group>
  );
}
