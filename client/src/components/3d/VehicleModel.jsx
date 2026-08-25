"use client";
import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Sphere } from "@react-three/drei";
import useVehicleStore from "@/store/useVehicleStore";
import useStudioStore from "@/store/useStudioStore";
import * as THREE from "three";

import CompactClassicShape from "@/components/studio/shapes/VanShapes/CompactClassicShape";
import StandardHighRoofShape from "@/components/studio/shapes/VanShapes/StandardHighRoofShape";
import MinibusCanvasShape from "@/components/studio/shapes/VanShapes/MinibusCanvasShape";
import CustomProceduralChassis from "@/components/studio/shapes/VanShapes/CustomProceduralChassis";
import ModuleMesh3D from "@/components/studio/ModuleMesh3D";
// import { getStudioTemplates } from "@/data/templates";
import axios from "axios";
import useChassisStore from "@/store/useChassisStore";
import useComponentStore from "@/store/useComponentStore";
import { useEffect } from "react";

const ShowroomVehicle = ({ vehicleId, headlightsOn, customModules }) => {
  const groupRef = useRef();
  const { chassis, fetchChassis } = useChassisStore();
  const { components, fetchComponents } = useComponentStore();
  const { driveSide } = useStudioStore();

  const [dbTemplates, setDbTemplates] = useState([]);

  useEffect(() => {
    fetchChassis();
    fetchComponents();
  }, [fetchChassis, fetchComponents]);

  useEffect(() => {
    const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    if (!customModules && vehicleId) {
      axios.get(`${API_BASE}/api/templates?chassisId=${vehicleId}`)
        .then(res => setDbTemplates(res.data))
        .catch(err => console.error("Error fetching templates", err));
    }
  }, [vehicleId, customModules]);

  // Subtle floating/idle animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 1.5) * 0.02;
    }
  });

  // Check if this vehicleId exists in our database chassis list
  const dbChassis = chassis.find(c => c.id === vehicleId);

  // Memoized modules hydration with O(1) map lookup
  const displayModules = useMemo(() => {
    const raw = customModules || (dbTemplates.length > 0 ? dbTemplates[dbTemplates.length - 1].modules : []);
    if (!raw) return [];
    const compMap = new Map(components.map(c => [c.id, c]));
    return raw.map(mod => {
      const dbComp = compMap.get(mod.typeId);
      if (dbComp) {
        return {
          ...mod,
          parts: dbComp.parts,
          defaultL: dbComp.defaultL,
          defaultW: dbComp.defaultW,
          defaultH: dbComp.defaultH,
          chassisOverrides: dbComp.chassisOverrides
        };
      }
      return mod;
    });
  }, [customModules, dbTemplates, components]);

  if (dbChassis) {
    const cx = dbChassis.centerX || 0;
    const cz = dbChassis.centerZ || 0;

    // Calculate floorHeight dynamically from part named "floor"
    let fh = dbChassis.floorHeight || 0;
    const floorPart = dbChassis.parts?.find(p => p.name?.toLowerCase().includes('floor'));
    if (floorPart && floorPart.offset && floorPart.size) {
      fh = ((floorPart.offset[1] || 0) + (floorPart.size[2] || 0)) * 0.01;
    }

    // Calculate dynamic roof lights
    let roofHeight = 2.18;
    const roofPart = dbChassis.parts?.find(p => p.name?.toLowerCase().includes('roof') || p.name?.toLowerCase().includes('ceiling'));
    if (roofPart && roofPart.offset) {
      // In CustomProceduralChassis, offset[1] is the bottom edge of the part
      roofHeight = (roofPart.offset[1] * 0.01) - 0.01; 
    }

    let xPositions = [-1.0, 1.0];
    if (floorPart && floorPart.size) {
      // In CustomProceduralChassis, size[0] is the X-axis length (scaledL)
      const length = (floorPart.size[0] || 400) * 0.01;
      
      if (length < 3.5) {
        // Version 1 (Short vans): Keep exactly as before
        xPositions = [-length * 0.25, length * 0.25];
      } else {
        // Version 2+ (Longer vans): 3 lights, tighter spacing to avoid hitting the front/windshield
        xPositions = [-length * 0.15, 0, length * 0.15];
      }
    }

    // Relative Y position for the lights inside the floor-offset group
    const lightLocalY = roofHeight - fh;

    return (
      <group ref={groupRef} position={[0, fh, 0]}>
        <group 
          position={[0, -fh, 0]} 
          rotation={[0, 0, 0]}
        >
          <group position={[-cx, 0, -cz]}>
            <CustomProceduralChassis chassis={dbChassis} />
          </group>
        </group>

        {/* Dynamic Interior Ceiling Spotlights */}
        {headlightsOn && xPositions.map((xPos, i) => (
          <group key={`dyn-light-${i}`} position={[xPos, lightLocalY, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.015, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffae6" emissiveIntensity={3} />
            </mesh>
            <pointLight 
              position={[0, -0.05, 0]}
              intensity={8} 
              distance={4}
              decay={2} 
              color="#fffae6" 
            />
          </group>
        ))}

        {displayModules.map(mod => (
          <ModuleMesh3D key={mod.id} mod={mod} isReadonly={true} />
        ))}
      </group>
    );
  }

  let ShapeComponent = StandardHighRoofShape;
  let chassisId = 'standard-highroof';
  let cockpitLength = 1.2;
  // Interior ceiling light positions (flush with ceiling)
  // Master Roof bottom is 2.195. Light half-height is 0.0075. Y = 2.1875
  let roofLights = [{ y: 2.18, z: -0.5 }, { y: 2.18, z: 1.0 }];

  if (vehicleId === 'vw-t3' || vehicleId === 'compact-classic') {
    ShapeComponent = CompactClassicShape;
    chassisId = 'compact-classic';
    cockpitLength = 1.3;
    // T3 Roof bottom is 1.80. Y = 1.7925
    roofLights = [{ y: 1.79, z: -0.3 }, { y: 1.79, z: 0.8 }];
  } else if (vehicleId === 'toyota-coaster' || vehicleId === 'minibus-canvas') {
    ShapeComponent = MinibusCanvasShape;
    chassisId = 'minibus-canvas';
    cockpitLength = 1.2;
    // Minibus Roof bottom is 2.195. Y = 2.1875
    roofLights = [{ y: 2.18, z: -2.0 }, { y: 2.18, z: 0 }, { y: 2.18, z: 1.5 }];
  }

  const vanZOffset = cockpitLength / 2;

  return (
    <group ref={groupRef}>
      
      {/* Group the van body and lights with the required Z-offset to match the templates */}
      <group position={[0, 0, -vanZOffset]}>
        <ShapeComponent />

        {/* Interior Ceiling Spotlights (Flush with ceiling, lighting decor) */}
        {headlightsOn && roofLights.map((pos, i) => (
          <group key={`roof-light-${i}`} position={[0, pos.y, pos.z]}>
            {/* Physical LED Puck Light Fixture */}
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.08, 0.08, 0.015, 32]} />
              <meshStandardMaterial color="#ffffff" emissive="#fffae6" emissiveIntensity={3} />
            </mesh>
            
            {/* The actual light filling the interior */}
            <pointLight 
              position={[0, -0.05, 0]}
              intensity={8} 
              distance={4}
              decay={2} 
              color="#fffae6" 
            />
          </group>
        ))}
      </group>

      {/* Showroom Default Interior Template (Read-Only) */}
      {displayModules.map(mod => (
        <ModuleMesh3D key={mod.id} mod={mod} isReadonly={true} />
      ))}
      
    </group>
  );
};

export default function VehicleModel({ customModules, activeModelId, activeChassis }) {
  const { selectedVehicle, headlightsOn } = useVehicleStore();

  // Prefer the specific activeModelId submitted in client design, fallback to global showroom select
  const finalVehicleId = activeModelId || selectedVehicle;

  return (
    <ShowroomVehicle vehicleId={finalVehicleId} headlightsOn={headlightsOn} customModules={customModules} />
  );
}
