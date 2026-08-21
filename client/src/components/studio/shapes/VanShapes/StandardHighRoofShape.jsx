import React from 'react';
import { Text } from "@react-three/drei";
import useStudioStore from "@/store/useStudioStore";

export default function StandardHighRoofShape() {
  const { driveSide } = useStudioStore();
  const isLHD = driveSide === 'LHD';
  const rightSign = isLHD ? -1 : 1;
  const driverX = isLHD ? 0.4 : -0.4;

  const length = 3.12; // Cargo Length
  const width = 1.9; // Cargo Width
  const height = 2.5; // Exterior height
  const cockpitLength = 1.2;

  // Measurements (Total exterior length = 5.4m)
  const frontZ = 2.7;
  const rearZ = -2.7;
  const midZ = 0;
  const bodyLength = 5.4;

  // Colors
  const baseColor = "#ffffff";
  const dark = "#1f2937";
  const silver = "#d1d5db";

  const ghostOpacity = 0.15;
  const glassOpacity = 0.05;

  return (
    <group>
      {/* Floor Cutouts & Door Indicators */}
      {/* Detailed Sliding Door */}
      <group position={[rightSign * (width / 2), 1.1, -0.18]}>
        {/* Main Door Panel */}
        <mesh><boxGeometry args={[0.04, 2.1, 1.2]} /><meshBasicMaterial color="#ef4444" transparent opacity={0.15} /></mesh>

        {/* Window Cutout Representation */}
        <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.05, 0.7, 0.9]} /><meshBasicMaterial color="#1e3a8a" transparent opacity={0.3} /></mesh>

        {/* Sliding Track / Rail (exterior) */}
        <mesh position={[rightSign * 0.03, -0.1, -0.6]}><boxGeometry args={[0.02, 0.05, 2.4]} /><meshBasicMaterial color="#333" /></mesh>

        <Text position={[rightSign * -0.05, 0, 0]} rotation={[0, rightSign * (Math.PI / 2), 0]} fontSize={0.15} color="#ef4444" anchorX="center" anchorY="middle" letterSpacing={0.1}>SLIDING DOOR</Text>
      </group>

      {/* Detailed Twin Barn Doors (Master/Boxer Style) */}
      <group position={[0, 0, rearZ]}>
        {/* Left Door */}
        <group position={[-0.45, 1.1, 0]}>
          {/* Door Frame */}
          <mesh><boxGeometry args={[0.88, 2.1, 0.04]} /><meshBasicMaterial color="#ef4444" transparent opacity={0.15} /></mesh>
          {/* Window Cutout Representation */}
          <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.6, 0.7, 0.05]} /><meshBasicMaterial color="#1e3a8a" transparent opacity={0.3} /></mesh>
          {/* Hinges */}
          <mesh position={[-0.45, 0.6, 0.02]}><boxGeometry args={[0.04, 0.1, 0.06]} /><meshBasicMaterial color="#333" /></mesh>
          <mesh position={[-0.45, -0.6, 0.02]}><boxGeometry args={[0.04, 0.1, 0.06]} /><meshBasicMaterial color="#333" /></mesh>
        </group>

        {/* Right Door */}
        <group position={[0.45, 1.1, 0]}>
          {/* Door Frame */}
          <mesh><boxGeometry args={[0.88, 2.1, 0.04]} /><meshBasicMaterial color="#ef4444" transparent opacity={0.15} /></mesh>
          {/* Window Cutout Representation */}
          <mesh position={[0, 0.4, 0]}><boxGeometry args={[0.6, 0.7, 0.05]} /><meshBasicMaterial color="#1e3a8a" transparent opacity={0.3} /></mesh>
          {/* Hinges */}
          <mesh position={[0.45, 0.6, 0.02]}><boxGeometry args={[0.04, 0.1, 0.06]} /><meshBasicMaterial color="#333" /></mesh>
          <mesh position={[0.45, -0.6, 0.02]}><boxGeometry args={[0.04, 0.1, 0.06]} /><meshBasicMaterial color="#333" /></mesh>
        </group>

        <Text position={[0, 1.1, 0.05]} rotation={[0, Math.PI, 0]} fontSize={0.15} color="#ef4444" anchorX="center" anchorY="middle" letterSpacing={0.1}>BARN DOORS</Text>
      </group>

      {/* Main Floor Plane */}
      <mesh position={[0, -0.1, midZ]}>
        <boxGeometry args={[width, 0.1, bodyLength]} />
        <meshStandardMaterial color="#3A3D40" roughness={0.8} />
      </mesh>

      {/* GHOST SHELL */}
      <group>
        {/* Lower Body */}
        <mesh position={[-width / 2 + 0.02, 0.5, midZ]}><boxGeometry args={[0.04, 1.0, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[width / 2 - 0.02, 0.5, midZ]}><boxGeometry args={[0.04, 1.0, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[0, 0.5, rearZ + 0.02]}><boxGeometry args={[width, 1.0, 0.04]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 0.5, frontZ - 0.02]} rotation={[-0.1, 0, 0]}><boxGeometry args={[width, 1.0, 0.04]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Upper Body Glass */}
        <mesh position={[-width / 2 + 0.02, 1.6, midZ]}><boxGeometry args={[0.04, 1.2, bodyLength]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.6, midZ]}><boxGeometry args={[0.04, 1.2, bodyLength]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} /></mesh>

        {/* Pillars */}
        <mesh position={[-width / 2 + 0.02, 1.6, 1.6]}><boxGeometry args={[0.05, 1.2, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.6, 1.6]}><boxGeometry args={[0.05, 1.2, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[-width / 2 + 0.02, 1.6, -0.8]}><boxGeometry args={[0.05, 1.2, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.6, -0.8]}><boxGeometry args={[0.05, 1.2, 0.15]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Corners */}
        <mesh position={[-width / 2 + 0.02, 1.6, rearZ + 0.05]}><boxGeometry args={[0.05, 1.2, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.6, rearZ + 0.05]}><boxGeometry args={[0.05, 1.2, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[-width / 2 + 0.02, 1.6, frontZ - 0.2]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.02, 1.6, frontZ - 0.2]} rotation={[-0.2, 0, 0]}><boxGeometry args={[0.05, 1.25, 0.1]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Windshield */}
        <mesh position={[0, 1.6, frontZ - 0.15]} rotation={[-0.2, 0, 0]}><boxGeometry args={[width, 1.2, 0.04]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} /></mesh>

        {/* High Roof */}
        <mesh position={[0, 2.22, midZ]}><boxGeometry args={[width, 0.05, bodyLength]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 2.3, midZ]}><boxGeometry args={[width - 0.1, 0.15, bodyLength - 0.2]} /><meshStandardMaterial color={baseColor} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
      </group>

      {/* EXTERIOR DETAILS */}
      <group position={[0, 0.8, frontZ - 0.02]} rotation={[-0.1, 0, 0]}>
        <mesh position={[0, 0, 0]}><boxGeometry args={[width - 0.1, 0.35, 0.05]} /><meshStandardMaterial color={dark} /></mesh>
        <mesh position={[-width / 2 + 0.4, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 32]} /><meshBasicMaterial color="#ffffff" /></mesh>
        <mesh position={[width / 2 - 0.4, 0, 0.03]} rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 32]} /><meshBasicMaterial color="#ffffff" /></mesh>
      </group>

      <mesh position={[0, 0.2, frontZ + 0.05]}><boxGeometry args={[width, 0.3, 0.2]} /><meshStandardMaterial color={dark} /></mesh>
      <mesh position={[0, 0.2, rearZ - 0.1]}><boxGeometry args={[width, 0.3, 0.2]} /><meshStandardMaterial color={dark} /></mesh>

      {/* Wheels */}
      {[
        [-width / 2 + 0.15, 1.8],
        [width / 2 - 0.15, 1.8],
        [-width / 2 + 0.15, -1.8],
        [width / 2 - 0.15, -1.8]
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[0.35, 0.35, 0.25, 32]} /><meshStandardMaterial color="#111827" roughness={0.9} /></mesh>
          <mesh position={[0, pos[0] < 0 ? -0.13 : 0.13, 0]}><cylinderGeometry args={[0.18, 0.18, 0.02, 32]} /><meshStandardMaterial color={silver} metalness={0.8} roughness={0.2} /></mesh>
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
