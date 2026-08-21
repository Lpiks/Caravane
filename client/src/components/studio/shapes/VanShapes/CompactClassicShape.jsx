import React from 'react';
import { Text } from "@react-three/drei";
import useStudioStore from "@/store/useStudioStore";

export default function CompactClassicShape() {
  const { driveSide } = useStudioStore();
  const isLHD = driveSide === 'LHD';
  const rightSign = isLHD ? -1 : 1; // -X is the Right side in Three.js when facing +Z
  const driverX = isLHD ? 0.4 : -0.4; // +X is the Left side in Three.js when facing +Z

  const length = 2.8; // Internal buildable cargo space
  const width = 1.8;
  const height = 1.8;
  const cockpitLength = 1.3;

  // VW T3 Real-World Proportions (Total length ~4.57m)
  const frontZ = length / 2 + cockpitLength; // 1.4 + 1.3 = 2.7
  const rearZ = -(length / 2) - 0.47; // -1.4 - 0.47 = -1.87
  const bodyLength = frontZ - rearZ; // 2.7 - (-1.87) = 4.57
  const midZ = (frontZ + rearZ) / 2; // (2.7 - 1.87) / 2 = 0.415

  // T3 Colors (Used as faint tints for the ghost shell)
  const orange = "#c2410c";
  const cream = "#fef3c7";
  const dark = "#1f2937";
  const silver = "#d1d5db";

  // Global ghost opacity for large body panels
  const ghostOpacity = 0.15;
  const glassOpacity = 0.05;

  return (
    <group>
      {/* Floor Cutouts & Door Indicators */}
      <mesh position={[rightSign * (width / 2), height / 2, 0.415]}>
        <boxGeometry args={[0.02, height, 1.37]} />
        <meshBasicMaterial color="#ef4444" transparent opacity={0.2} />
      </mesh>
      <Text position={[rightSign * (width / 2 - 0.05), height / 2, 0.415]} rotation={[0, rightSign * (Math.PI / 2), 0]} fontSize={0.18} color="#ef4444" anchorX="center" anchorY="middle" letterSpacing={0.1}>◀ ─── ▶</Text>

      {/* Exterior Entry Step below Sliding Door */}
      <mesh position={[rightSign * (width / 2 + 0.04), 0.06, 0.415]}>
        <boxGeometry args={[0.08, 0.02, 1.1]} />
        <meshStandardMaterial color={dark} roughness={0.8} />
      </mesh>
      <mesh position={[rightSign * (width / 2 + 0.08), 0.06, 0.415]}>
        <boxGeometry args={[0.005, 0.02, 1.1]} />
        <meshStandardMaterial color={silver} metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Main Floor Plane */}
      <mesh position={[0, -0.1, midZ]}>
        <boxGeometry args={[width, 0.1, bodyLength]} />
        <meshStandardMaterial color="#3A3D40" roughness={0.8} />
      </mesh>

      {/* --- VW T3 HOLLOW GHOST SHELL --- */}
      <group>
        {/* Front Nose & Windshield */}
        <mesh position={[0, 0.45, frontZ - 0.02]} rotation={[-0.08, 0, 0]}><boxGeometry args={[width, 0.9, 0.04]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 1.35, frontZ - 0.1]} rotation={[-0.15, 0, 0]}><boxGeometry args={[width, 0.9, 0.04]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} metalness={0.5} roughness={0.1} depthWrite={false} /></mesh>

        {/* Unified Rear Tailgate (Blueprint Hatch) */}
        <mesh position={[0, 0.45, rearZ + 0.02]}><boxGeometry args={[width - 0.04, 0.9, 0.04]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 1.35, rearZ + 0.02]}><boxGeometry args={[width - 0.2, 0.8, 0.04]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} metalness={0.5} roughness={0.1} /></mesh>
        <mesh position={[-width / 2 + 0.05, 1.35, rearZ + 0.02]}><boxGeometry args={[0.1, 0.9, 0.04]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[width / 2 - 0.05, 1.35, rearZ + 0.02]}><boxGeometry args={[0.1, 0.9, 0.04]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        <mesh position={[0, 1.78, rearZ + 0.02]}><boxGeometry args={[width, 0.1, 0.04]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* Westfalia Pop-Top Wedge Roof */}
        {/* Front Luggage Rack */}
        <mesh position={[0, 1.81, 2.25]}><boxGeometry args={[width - 0.1, 0.05, 0.9]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
        {/* Closed Pop-Top Wedge */}
        <mesh position={[0, 1.83, -0.035]}><boxGeometry args={[width - 0.08, 0.06, 3.67]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

        {/* --- ASYMMETRIC SIDE PANELING --- */}
        <group>
          {[1, -1].map((sideSign) => {
            const isDoorSide = rightSign === sideSign;
            const isDriverSide = !isDoorSide;
            const xPos = sideSign * (width / 2 - 0.02);

            return (
              <group key={sideSign}>
                {/* Lower Panels */}
                <mesh position={[xPos, 0.45, 1.9]}><boxGeometry args={[0.04, 0.9, 1.6]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
                <mesh position={[isDoorSide ? xPos + sideSign * 0.01 : xPos, 0.45, 0.415]}><boxGeometry args={[0.04, 0.9, 1.37]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>
                <mesh position={[xPos, 0.45, -1.07]}><boxGeometry args={[0.04, 0.9, 1.6]} /><meshStandardMaterial color={orange} transparent opacity={ghostOpacity} depthWrite={false} side={2} /></mesh>

                {/* Window Panes */}
                <mesh position={[xPos, 1.35, 1.9]}><boxGeometry args={[0.04, 0.9, 1.6]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} metalness={0.5} roughness={0.1} /></mesh>
                <mesh position={[isDoorSide ? xPos + sideSign * 0.01 : xPos, 1.35, 0.415]}><boxGeometry args={[0.04, 0.9, 1.37]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} metalness={0.5} roughness={0.1} /></mesh>
                <mesh position={[xPos, 1.35, -1.07]}><boxGeometry args={[0.04, 0.9, 1.6]} /><meshStandardMaterial color="#1e3a8a" transparent opacity={glassOpacity} depthWrite={false} side={2} metalness={0.5} roughness={0.1} /></mesh>

                {/* Pillars */}
                <mesh position={[xPos, 1.35, frontZ - 0.1]} rotation={[-0.15, 0, 0]}><boxGeometry args={[0.05, 0.95, 0.1]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
                <mesh position={[xPos, 1.35, 1.1]}><boxGeometry args={[0.05, 0.9, 0.15]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
                <mesh position={[xPos, 1.35, -0.27]}><boxGeometry args={[0.05, 0.9, 0.15]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>
                <mesh position={[xPos, 1.35, rearZ + 0.05]}><boxGeometry args={[0.05, 0.9, 0.1]} /><meshStandardMaterial color={cream} transparent opacity={ghostOpacity} depthWrite={false} /></mesh>

                {/* D-Pillar Engine Cooling Vents (Iconic T3 Rear Vents) */}
                <mesh position={[xPos, 1.35, -1.62]}><boxGeometry args={[0.042, 0.8, 0.15]} /><meshStandardMaterial color={dark} /></mesh>

                {/* Sliding Door Track & Handle (Passenger side only) */}
                {isDoorSide && (
                  <group>
                    {/* Horizontal Sliding Door Track Groove (Runs from C-pillar to rear) */}
                    <mesh position={[xPos + sideSign * 0.012, 0.85, -1.07]}>
                      <boxGeometry args={[0.005, 0.02, 1.6]} />
                      <meshStandardMaterial color={dark} roughness={0.9} />
                    </mesh>
                    {/* Sliding Door Handle (Near the B-Pillar edge) */}
                    <mesh position={[xPos + sideSign * 0.022, 0.75, 0.95]}>
                      <boxGeometry args={[0.015, 0.04, 0.12]} />
                      <meshStandardMaterial color={dark} roughness={0.5} />
                    </mesh>
                  </group>
                )}

                {/* Camper Utility Hookups (Driver side only) */}
                {isDriverSide && (
                  <group>
                    {/* Water Fill Cap */}
                    <mesh position={[xPos - sideSign * 0.02, 0.6, 0.85]} rotation={[0, 0, Math.PI / 2]}>
                      <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
                      <meshStandardMaterial color="#ffffff" roughness={0.2} />
                    </mesh>
                    {/* CAMPER Fridge Slats (Ventilation grilles) */}
                    <mesh position={[xPos - sideSign * 0.02, 0.6, 0.45]}>
                      <boxGeometry args={[0.02, 0.18, 0.25]} />
                      <meshStandardMaterial color={dark} />
                    </mesh>
                    {/* 230V Power Socket */}
                    <mesh position={[xPos - sideSign * 0.02, 0.6, 0.05]}>
                      <boxGeometry args={[0.02, 0.08, 0.08]} />
                      <meshStandardMaterial color="#9ca3af" roughness={0.3} />
                    </mesh>
                  </group>
                )}
              </group>
            );
          })}
        </group>
      </group>

      {/* --- VW T3 FRONT NOSE DETAILS --- */}
      <group>
        {/* Double Grill Upper Section */}
        <mesh position={[0, 0.58, frontZ + 0.02]} rotation={[-0.08, 0, 0]}>
          <boxGeometry args={[width - 0.1, 0.22, 0.04]} />
          <meshStandardMaterial color={dark} roughness={0.9} />
        </mesh>
        {/* VW Emblem */}
        <mesh position={[0, 0.58, frontZ + 0.045]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.015, 32]} />
          <meshStandardMaterial color={silver} metalness={0.9} roughness={0.1} />
        </mesh>
        {/* Classic Round Headlights */}
        <mesh position={[-width / 2 + 0.22, 0.58, frontZ + 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 32]} />
          <meshStandardMaterial color="#fffae6" emissive="#fffae6" emissiveIntensity={0.2} />
        </mesh>
        <mesh position={[width / 2 - 0.22, 0.58, frontZ + 0.04]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.015, 32]} />
          <meshStandardMaterial color="#fffae6" emissive="#fffae6" emissiveIntensity={0.2} />
        </mesh>
        {/* Front Corner Indicators (Blinkers) */}
        <mesh position={[-width / 2 + 0.09, 0.5, frontZ - 0.01]} rotation={[-0.08, 0, 0]}><boxGeometry args={[0.13, 0.08, 0.04]} /><meshStandardMaterial color="#f59e0b" roughness={0.3} /></mesh>
        <mesh position={[width / 2 - 0.09, 0.5, frontZ - 0.01]} rotation={[-0.08, 0, 0]}><boxGeometry args={[0.13, 0.08, 0.04]} /><meshStandardMaterial color="#f59e0b" roughness={0.3} /></mesh>
      </group>

      {/* --- VW T3 REAR TAILGATE DETAILS --- */}
      <group>
        {/* License Plate Frame */}
        <mesh position={[0, 0.32, rearZ - 0.02]}>
          <boxGeometry args={[0.38, 0.12, 0.02]} />
          <meshStandardMaterial color={dark} />
        </mesh>
        {/* License Plate */}
        <mesh position={[0, 0.32, rearZ - 0.03]}>
          <boxGeometry args={[0.35, 0.09, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <Text position={[0, 0.32, rearZ - 0.036]} rotation={[0, Math.PI, 0]} fontSize={0.065} color="#000000">VW T3</Text>

        {/* Tail lights */}
        {/* Left tail light (Orange, Red, White sections combined) */}
        <mesh position={[-width / 2 + 0.22, 0.32, rearZ - 0.01]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} />
        </mesh>
        {/* Right tail light */}
        <mesh position={[width / 2 - 0.22, 0.32, rearZ - 0.01]}>
          <boxGeometry args={[0.22, 0.14, 0.02]} />
          <meshStandardMaterial color="#ef4444" roughness={0.2} />
        </mesh>

        {/* Tailgate Lock Cylinder / Button */}
        <mesh position={[0, 0.48, rearZ - 0.01]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.018, 0.018, 0.02, 16]} />
          <meshStandardMaterial color={silver} metalness={0.9} />
        </mesh>
      </group>

      {/* Bumpers */}
      <mesh position={[0, 0.15, frontZ + 0.1]}><boxGeometry args={[width, 0.2, 0.2]} /><meshStandardMaterial color={dark} /></mesh>
      <mesh position={[0, 0.15, rearZ - 0.1]}><boxGeometry args={[width, 0.2, 0.2]} /><meshStandardMaterial color={dark} /></mesh>

      {/* Wheels */}
      {[
        [-width / 2 - 0.02, 1.9],
        [width / 2 + 0.02, 1.9],
        [-width / 2 - 0.02, -1.07],
        [width / 2 + 0.02, -1.07]
      ].map((pos, i) => (
        <group key={i} position={[pos[0], 0, pos[1]]} rotation={[0, 0, Math.PI / 2]}>
          <mesh><cylinderGeometry args={[0.3, 0.3, 0.2, 32]} /><meshStandardMaterial color="#111827" roughness={0.9} /></mesh>
          <mesh position={[0, pos[0] < 0 ? -0.11 : 0.11, 0]}><cylinderGeometry args={[0.15, 0.15, 0.02, 32]} /><meshStandardMaterial color={silver} metalness={0.8} roughness={0.2} /></mesh>
        </group>
      ))}

      {/* Driver Cockpit Block (Interior) */}
      <group position={[0, height / 4, length / 2 + cockpitLength / 2]}>
        <mesh position={[0, 0.2, 0.3]}><boxGeometry args={[width - 0.2, 0.4, 0.4]} /><meshStandardMaterial color="#22252A" roughness={0.9} /></mesh>
        <group position={[-0.4, 0.2, -0.3]}>
          <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.08, 0.12, 0.3, 16]} /><meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[0, 0.2, -0.2]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.1]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[-0.22, 0.05, 0]}><boxGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#1E293B" /></mesh>
          <mesh position={[0.22, 0.05, 0]}><boxGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#1E293B" /></mesh>
        </group>
        <group position={[0.4, 0.2, -0.3]}>
          <mesh position={[0, -0.3, 0]}><cylinderGeometry args={[0.08, 0.12, 0.3, 16]} /><meshStandardMaterial color="#1E293B" metalness={0.8} roughness={0.2} /></mesh>
          <mesh position={[0, -0.1, 0]}><boxGeometry args={[0.5, 0.1, 0.5]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[0, 0.2, -0.2]} rotation={[-0.1, 0, 0]}><boxGeometry args={[0.5, 0.5, 0.1]} /><meshStandardMaterial color="#22252A" /></mesh>
          <mesh position={[-0.22, 0.05, 0]}><boxGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#1E293B" /></mesh>
          <mesh position={[0.22, 0.05, 0]}><boxGeometry args={[0.05, 0.05, 0.3]} /><meshStandardMaterial color="#1E293B" /></mesh>
        </group>
        <mesh position={[driverX, 0.5, 0.3]} rotation={[Math.PI / 4, 0, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#22252A" />
        </mesh>
      </group>
    </group>
  );
}
