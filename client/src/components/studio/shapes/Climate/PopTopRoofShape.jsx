import React, { useMemo } from 'react';
import * as THREE from 'three';

export default function PopTopRoofShape({ w, h, d, color, opacity, isOpen = true }) {
  // Pivot angle for the open pop-top (approx 20 degrees)
  const liftAngle = 0.35; 
  
  // Side wall shape (YZ plane, X is Z-axis in this 2D shape)
  const sideShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0); // rear hinge
    shape.lineTo(d, 0); // front bottom (flat on roof)
    shape.lineTo(d * Math.cos(liftAngle), d * Math.sin(liftAngle)); // front top (matches lifted shell)
    shape.lineTo(0, 0); // close back to hinge
    return shape;
  }, [d, liftAngle]);

  const sideExtrude = useMemo(() => ({
    depth: 0.02, // 2cm thick fabric wall
    bevelEnabled: false
  }), []);

  // Calculate front wall dimensions and tilt
  const dz = d * Math.cos(liftAngle) - d; // will be negative
  const dy = d * Math.sin(liftAngle);
  const frontHeight = Math.sqrt(dz * dz + dy * dy);
  const frontTilt = Math.atan2(dz, dy); // Tilts backwards

  // Split height into base and top shell
  const baseH = 0.05;
  const topH = h - baseH;

  return (
    <group position={[0, 0, 0]}>
      {/* Base Perimeter (always flat on the roof) */}
      <mesh position={[0, baseH / 2, 0]}>
        <boxGeometry args={[w, baseH, d]} />
        <meshStandardMaterial color="#1e293b" />
      </mesh>

      {/* Hollow Canvas Tent */}
      {isOpen && (
        <group position={[0, baseH, -d / 2]}>
          {/* Left Wall */}
          <mesh position={[-w / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <extrudeGeometry args={[sideShape, sideExtrude]} />
            <meshStandardMaterial color="#cbd5e1" side={THREE.DoubleSide} />
          </mesh>

          {/* Right Wall */}
          <mesh position={[w / 2 - 0.02, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <extrudeGeometry args={[sideShape, sideExtrude]} />
            <meshStandardMaterial color="#cbd5e1" side={THREE.DoubleSide} />
          </mesh>

          {/* Front Wall */}
          <mesh 
            position={[
              0, 
              dy / 2, 
              d + dz / 2
            ]} 
            rotation={[frontTilt, 0, 0]}
          >
            <boxGeometry args={[w - 0.04, frontHeight, 0.02]} />
            <meshStandardMaterial color="#cbd5e1" />
          </mesh>
        </group>
      )}

      {/* Pivoting Roof Section (Hinged at the rear: Z = -d/2) */}
      <group position={[0, baseH, -d / 2]} rotation={[isOpen ? -liftAngle : 0, 0, 0]}>
        {/* The fiberglass roof shell */}
        <mesh position={[0, topH / 2, d / 2]}>
          <boxGeometry args={[w, topH, d]} />
          <meshStandardMaterial color={color} transparent={opacity < 1} opacity={opacity} />
        </mesh>
      </group>
    </group>
  );
}
