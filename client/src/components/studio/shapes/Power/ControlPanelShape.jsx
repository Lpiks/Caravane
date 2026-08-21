import React from 'react';

export default function ControlPanelShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Black Bezel */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color="#000000" transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Glowing Screen */}
      <mesh position={[0, 0, d/2 + 0.005]}>
        <boxGeometry args={[w - 0.02, h - 0.02, 0.01]} />
        <meshBasicMaterial color={color} />
      </mesh>
    </group>
  );
}
