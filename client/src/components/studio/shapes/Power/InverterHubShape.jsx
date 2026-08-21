import React from 'react';

export default function InverterHubShape({ w, h, d, color, opacity }) {
  return (
    <group>
      {/* Main Hub Box */}
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
      </mesh>
      {/* Large Yellow Dial / Switch */}
      <mesh position={[0, h/3, d/2 + 0.005]}>
        <circleGeometry args={[0.02, 16]} />
        <meshBasicMaterial color="#FACC15" />
      </mesh>
      {/* AC Sockets */}
      <mesh position={[-w/4, -h/4, d/2 + 0.005]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh position={[w/4, -h/4, d/2 + 0.005]}>
        <boxGeometry args={[0.04, 0.04, 0.01]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
    </group>
  );
}
