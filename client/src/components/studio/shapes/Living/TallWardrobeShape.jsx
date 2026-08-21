import React from 'react';

export default function TallWardrobeShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Wardrobe Cabinet Body */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.8} />
      </mesh>
      
      {/* Left Door Panel */}
      <mesh position={[-w/4 + 0.005, 0, d/2 + 0.005]}>
        <boxGeometry args={[w/2 - 0.01, h - 0.04, 0.01]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.7} />
      </mesh>
      
      {/* Right Door Panel */}
      <mesh position={[w/4 - 0.005, 0, d/2 + 0.005]}>
        <boxGeometry args={[w/2 - 0.01, h - 0.04, 0.01]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} roughness={0.7} />
      </mesh>

      {/* Handles */}
      <mesh position={[-0.03, 0, d/2 + 0.015]}>
        <boxGeometry args={[0.015, 0.15, 0.015]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.03, 0, d/2 + 0.015]}>
        <boxGeometry args={[0.015, 0.15, 0.015]} />
        <meshStandardMaterial color="#475569" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  );
}
