import React from 'react';
import { Text } from "@react-three/drei";
import useStudioStore from "@/store/useStudioStore";

export default function MinibusCanvasShape() {
  const { driveSide } = useStudioStore();
  const isLHD = driveSide === 'LHD';
  const rightSign = isLHD ? -1 : 1;
  const driverX = isLHD ? 0.4 : -0.4;

  const length = 6.5;
  const width = 2.1;
  const height = 2.3;
  const cockpitLength = 1.2;

  // Measurements
  const frontZ = 3.85;
  const rearZ = -3.85;
  const midZ = 0;
  const bodyLength = 7.7;

  // Colors
  const baseColor = "#e0f2fe"; // Light blue tint
  const dark = "#1f2937";
  const silver = "#d1d5db";

  const ghostOpacity = 0.15;
  const glassOpacity = 0.05;

  return (
    <group>
      {/* Floor Cutouts & Door Indicators */}
      <mesh position={[rightSign * (width / 2), height / 2, 1.75]}>
        <boxGeometry args={[0.02, height, 1.2]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
      </mesh>
      <Text position={[rightSign * (width / 2 - 0.05), height / 2, 1.75]} rotation={[0, rightSign * (Math.PI / 2), 0]} fontSize={0.15} color="#ef4444" anchorX="center" anchorY="middle" letterSpacing={0.1}>SLIDING DOOR</Text>

      <mesh position={[0, height / 2, rearZ]}>
        <boxGeometry args={[1.2, height, 0.02]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
      </mesh>
      <Text position={[0, height / 2, rearZ + 0.05]} rotation={[0, 0, 0]} fontSize={0.15} color="#ef4444" anchorX="center" anchorY="middle" letterSpacing={0.1}>REAR DOORS</Text>

      {/* Main Floor Plane */}
      <mesh position={[0, -0.1, midZ]}>
        <boxGeometry args={[width, 0.1, bodyLength]} />
        <meshStandardMaterial color="#3A3D40" roughness={0.8} />
      </mesh>

      {/* GHOST SHELL */}
      <group>
        {/* Lower Body */}
        <mesh position={[-width / 2 + 0.02, 0.6, midZ]}><boxGeometry args={[0.04, 1.2, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[width / 2 - 0.02, 0.6, midZ]}><boxGeometry args={[0.04, 1.2, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[0, 0.6, rearZ + 0.02]}><boxGeometry args={[width, 1.2, 0.04]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 0.6, frontZ - 0.02]} rotation={[-0.05, 0, 0]}><boxGeometry args={[width, 1.2, 0.04]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Upper Body Glass */}
        <mesh position={[-width / 2 + 0.02, 1.7, midZ]}><boxGeometry args={[0.04, 1.0, bodyLength]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.7, midZ]}><boxGeometry args={[0.04, 1.0, bodyLength]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} /></mesh>

        {/* Bus Pillars (More of them) */}
        {[2.5, 1.0, -0.5, -2.0].map((pz, i) => (
          <React.Fragment key={i}>
            <mesh position={[-width / 2 + 0.02, 1.7, pz]}><boxGeometry args={[0.08, 1.0, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
            <mesh position={[width / 2 - 0.02, 1.7, pz]}><boxGeometry args={[0.08, 1.0, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
          </React.Fragment>
        ))}

        {/* Corners */}
        <mesh position={[-width / 2 + 0.02, 1.7, rearZ + 0.05]}><boxGeometry args={[0.08, 1.0, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.7, rearZ + 0.05]}><boxGeometry args={[0.08, 1.0, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[-width / 2 + 0.02, 1.7, frontZ - 0.1]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.08, 1.02, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.7, frontZ - 0.1]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.08, 1.02, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Windshield & Rear Window */}
        <mesh position={[0, 1.7, rearZ + 0.02]}><boxGeometry args={[width, 1.0, 0.04]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 1.7, frontZ - 0.08]} rotation={[-0.1, 0, 0]}><boxGeometry args={[width, 1.0, 0.04]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} /></mesh>

        {/* Roof */}
        <mesh position={[0, 2.22, midZ]}><boxGeometry args={[width, 0.05, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
      </group>

      {/* EXTERIOR DETAILS */}
      <group position={[0, 0.9, frontZ - 0.02]} rotation={[-0.05, 0, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[width - 0.1, 0.4, 0.05]} /><meshStandardMaterial color={dark} /></mesh>
        <mesh position={[-width / 2 + 0.4, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 32]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[width / 2 - 0.4, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 32]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>

      <mesh position={[0, 0.25, frontZ + 0.05]}><boxGeometry args={[width, 0.4, 0.2]} /><meshStandardMaterial color={dark} /></mesh>
      <mesh position={[0, 0.25, rearZ - 0.1]}><boxGeometry args={[width, 0.4, 0.2]} /><meshStandardMaterial color={dark} /></mesh>

      {/* Wheels */}
      {[
        [-width / 2 + 0.15, 2.8],
        [width / 2 - 0.15, 2.8],
        [-width / 2 + 0.15, -2.8],
        [width / 2 - 0.15, -2.8]
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[0.4, 0.4, 0.3, 32]} /><meshStandardMaterial color="#111827" roughness={0.9} /></mesh>
          <mesh position={[0, pos[0] < 0 ? -0.16 : 0.16, 0]}><cylinderGeometry args={[0.2, 0.2, 0.02, 32]} /><meshStandardMaterial color={silver} metalness={0.8} roughness={0.2} /></mesh>
        </group>
      ))}

      {/* Driver Cockpit Block */}
      <group position={[0, height / 4, length / 2 + cockpitLength / 2]}>
        <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[width - 0.2, 0.4, 0.4]} /><meshStandardMaterial color="#22252A" roughness={0.9} /></mesh>
        <group position={[-0.4, 0.2, -0.3]}>
          <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.08, 0.12, 0.3, 16]} /><meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[0, 0.2, -0.2]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.1]} /><meshStandardMaterial color="#22252A" /></mesh>
        </group>
        <group position={[0.4, 0.2, -0.3]}>
          <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.08, 0.12, 0.3, 16]} /><meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[0, 0.2, -0.2]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.1]} /><meshStandardMaterial color="#22252A" /></mesh>
        </group>
        <mesh position={[driverX, 0.5, 0.3]} rotation={[Math.PI / 4, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.05, 16]} /><meshStandardMaterial color="#22252A" /></mesh>
      </group>
    </group>
  );
}
