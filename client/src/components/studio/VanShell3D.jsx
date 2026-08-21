import { Grid } from "@react-three/drei";
import { useState, useEffect } from "react";
import useStudioStore from "@/store/useStudioStore";
import StandardHighRoofShape from "./shapes/VanShapes/StandardHighRoofShape";
import CompactClassicShape from "./shapes/VanShapes/CompactClassicShape";
import MinibusCanvasShape from "./shapes/VanShapes/MinibusCanvasShape";
import CustomProceduralChassis from "./shapes/VanShapes/CustomProceduralChassis";
// import baseChassis from "@/data/baseChassis.json";
import useChassisStore from "@/store/useChassisStore";

export default function VanShell3D() {
  const { activeChassis, activeModelId, driveSide } = useStudioStore();
  const { chassis, fetchChassis } = useChassisStore();
  const [customChassis, setCustomChassis] = useState(null);

  useEffect(() => {
    fetchChassis();
    const existing = JSON.parse(localStorage.getItem('customChassis') || '[]');
    const testT3 = existing.find(c => c.name === 'test T3');
    if (testT3) setCustomChassis(testT3);
  }, [fetchChassis]);

  const isCustom = activeChassis === 'compact-classic' && customChassis;

  const renderActiveChassis = () => {
    // 1. If there's a custom localstorage design named test T3, use it (legacy/override support)
    if (isCustom) {
      const cx = customChassis.centerX || 0;
      const cz = customChassis.centerZ || 0;

      // Calculate floorHeight dynamically from part named "floor"
      let fh = customChassis.floorHeight || 0;
      const floorPart = customChassis.parts?.find(p => p.name?.toLowerCase().includes('floor'));
      if (floorPart && floorPart.offset && floorPart.size) {
        fh = ((floorPart.offset[1] || 0) + (floorPart.size[2] || 0)) * 0.01;
      }

      return (
        <group position={[-cx, -fh, -cz]}>
          <CustomProceduralChassis chassis={customChassis} />
        </group>
      );
    }

    // 2. Load active model directly from the MongoDB Database
    const dbChassis = chassis.find(c => c.id === activeModelId);
    if (dbChassis) {
      const cx = dbChassis.centerX || 0;
      const cz = dbChassis.centerZ || 0;

      // Calculate floorHeight dynamically from part named "floor"
      let fh = dbChassis.floorHeight || 0;
      const floorPart = dbChassis.parts?.find(p => p.name?.toLowerCase().includes('floor'));
      if (floorPart && floorPart.offset && floorPart.size) {
        fh = ((floorPart.offset[1] || 0) + (floorPart.size[2] || 0)) * 0.01;
      }

      return (
        <group 
          position={[0, -fh, 0]} 
          rotation={[0, 0, 0]}
        >
          <group position={[-cx, 0, -cz]}>
            <CustomProceduralChassis chassis={dbChassis} />
          </group>
        </group>
      );
    }

    // 3. Fallback to hardcoded templates if DB is still loading
    switch (activeChassis) {
      case 'compact-classic': return <CompactClassicShape />;
      case 'minibus-canvas': return <MinibusCanvasShape />;
      case 'standard-highroof':
      default: return <StandardHighRoofShape />;
    }
  };

  const getChassisDimensions = () => {
    if (isCustom) {
      const w = (customChassis.defaultW || 100) * 0.01;
      const l = (customChassis.defaultL || 100) * 0.01;
      return { width: w, length: l };
    }

    // Find the specific model in chassis DB for exact dimensions
    // const model = baseChassis.find(c => c.id === activeModelId);
    const model = chassis.find(c => c.id === activeModelId);
    if (model) {
      const w = (model.defaultW || 190) * 0.01;
      const l = (model.defaultL || 300) * 0.01;

      // Standard class uses standard layout grid bounds in Three.js
      if (model.class === 'standard-highroof') {
        return { width: w, length: 3.12 };
      }
      return { width: w, length: l };
    }

    switch (activeChassis) {
      case 'maxi-bus': return { width: 2.5, length: 11.52 };
      case 'minibus-canvas': return { width: 2.1, length: 6.5 };
      case 'standard-highroof': return { width: 1.9, length: 3.12 };
      case 'compact-classic':
      default: return { width: 1.8, length: 2.8 };
    }
  };

  const { width: cargoWidth, length: cargoLength } = getChassisDimensions();

  return (
    <group position={[0, 0, 0]}>
      {/* 1. Interior Buildable Grid (Bright Orange, cropped to van) */}
      <Grid
        position={[0, 0.01, 0]}
        args={[cargoLength, cargoWidth]}
        cellSize={0.5}
        cellThickness={1}
        cellColor="#33383F"
        sectionSize={1}
        sectionThickness={1.5}
        sectionColor="#E07A5F"
        fadeDistance={cargoLength + 2}
        fadeStrength={0}
      />

      {/* 2. Exterior World Grid (Slate Blue fading) */}
      <Grid
        position={[0, 0, 0]}
        args={[20, 20]}
        cellSize={1}
        cellThickness={0.5}
        cellColor="#334155"
        sectionSize={5}
        sectionThickness={1}
        sectionColor="#64748b"
        fadeDistance={20}
        fadeStrength={1}
      />

      <group scale={[1, 1, driveSide === 'LHD' ? 1 : -1]}>
        {renderActiveChassis()}
      </group>
    </group>
  );
}
