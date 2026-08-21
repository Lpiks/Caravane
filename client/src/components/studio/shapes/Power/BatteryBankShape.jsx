import React from 'react';

export default function BatteryBankShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Battery Box */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Terminals */}
      <mesh position={[-w/4, h/2 + 0.02, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
        <meshStandardMaterial color="#ef4444" /> {/* Red Positive */}
      </mesh>
      <mesh position={[w/4, h/2 + 0.02, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.04, 16]} />
        <meshStandardMaterial color="#000000" /> {/* Black Negative */}
      </mesh>
    </group>
  );
}
