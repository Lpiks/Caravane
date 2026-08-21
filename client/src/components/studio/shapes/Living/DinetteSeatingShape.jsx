import React from 'react';

export default function DinetteSeatingShape({ w, h, d, color, opacity, isBedMode }) {
  const cushionThickness = 0.15;
  
  return (
    <group>
      {/* Wooden Base Frame */}
      <mesh position={[0, -h/4 - 0.05, 0]}>
        <boxGeometry args={[w, h/2 - 0.1, d]} />
        <meshStandardMaterial color="#9ca3af" transparent={opacity < 1} opacity={opacity} />
      </mesh>

      {isBedMode ? (
        <>
          {/* Bed Mode - cushions laid flat */}
          <mesh position={[0, -0.05, d/4]}>
            <boxGeometry args={[w, cushionThickness, d/2]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.05, -d/4]}>
            <boxGeometry args={[w, cushionThickness, d/2]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
        </>
      ) : (
        <>
          {/* Seat Cushion (Bottom half) */}
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[w, 0.1, d]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
          {/* Backrest (Top half, back edge) */}
          <mesh position={[0, h/4, -d/2 + 0.1]} rotation={[-0.1, 0, 0]}>
            <boxGeometry args={[w, h/2, 0.2]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}
