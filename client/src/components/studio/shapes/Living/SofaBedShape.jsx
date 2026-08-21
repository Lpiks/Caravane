import React from 'react';

export default function SofaBedShape({ w, h, d, color, opacity, isBedMode }) {
  const cushionThickness = 0.15;
  
  return (
    <group>
      {/* Metal Frame Base */}
      <mesh position={[0, -h/4 - 0.05, 0]}>
        <boxGeometry args={[w, h/2 - 0.1, d - 0.05]} />
        <meshStandardMaterial color="#475569" transparent={opacity < 1} opacity={opacity} />
      </mesh>

      {isBedMode ? (
        <>
          {/* Bed Mode - Two cushions laid flat side-by-side to make a double bed */}
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
          {/* Sofa Mode - Seat cushion and upright backrest */}
          <mesh position={[0, -0.05, d/10]}>
            <boxGeometry args={[w, cushionThickness, d * 0.8]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
          <mesh position={[0, h/4, -d/2 + 0.1]} rotation={[-0.15, 0, 0]}>
            <boxGeometry args={[w, h/2 + 0.1, 0.18]} />
            <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
          </mesh>
        </>
      )}
    </group>
  );
}
