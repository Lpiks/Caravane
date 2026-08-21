import { useRef, useState, useEffect } from "react";
import * as THREE from 'three';
import { TransformControls } from "@react-three/drei";
import useStudioStore from "@/store/useStudioStore";
import KitchenGalleyShape from "./shapes/Kitchen/KitchenGalleyShape";
import UprightFridgeShape from "./shapes/Kitchen/UprightFridgeShape";
import CooktopShape from "./shapes/Kitchen/CooktopShape";
import GasLockerShape from "./shapes/Kitchen/GasLockerShape";
import ShowerCabinShape from "./shapes/Bathroom/ShowerCabinShape";
import CassetteToiletShape from "./shapes/Bathroom/CassetteToiletShape";
import GreyWaterTankShape from "./shapes/Bathroom/GreyWaterTankShape";
import DinetteSeatingShape from "./shapes/Living/DinetteSeatingShape";
import SofaBedShape from "./shapes/Living/SofaBedShape";
import FixedBedShape from "./shapes/Living/FixedBedShape";
import LagunTableShape from "./shapes/Living/LagunTableShape";
import SwivelSeatShape from "./shapes/Living/SwivelSeatShape";
import TallWardrobeShape from "./shapes/Living/TallWardrobeShape";
import EngineCushionShape from "./shapes/Living/EngineCushionShape";
import WaterTankShape from "./shapes/Power/WaterTankShape";
import BatteryBankShape from "./shapes/Power/BatteryBankShape";
import DieselHeaterShape from "./shapes/Power/DieselHeaterShape";
import ControlPanelShape from "./shapes/Power/ControlPanelShape";
import InverterHubShape from "./shapes/Power/InverterHubShape";
import SolarArrayShape from "./shapes/Climate/SolarArrayShape";
import PopTopRoofShape from "./shapes/Climate/PopTopRoofShape";
import SideAwningShape from "./shapes/Climate/SideAwningShape";
import RoofACShape from "./shapes/Climate/RoofACShape";
import MaxxairFanShape from "./shapes/Climate/MaxxairFanShape";
import OverheadLockerShape from "./shapes/Climate/OverheadLockerShape";

export default function ModuleMesh3D({ mod, isReadonly = false }) {
  const { 
    updateModulePosition, 
    removeModule,
    showRoof, 
    showOverhead, 
    showUnderbed, 
    ghostBedTop,
    activeModuleId,
    setActiveModule,
    rotateModule,
    activeChassis
  } = useStudioStore();
  
  const meshRef = useRef();
  const active = activeModuleId === mod.id;

  let isVisible = true;
  if (mod.layer === 'roof' && !showRoof) isVisible = false;
  if (mod.layer === 'overhead' && !showOverhead) isVisible = false;
  if (mod.layer === 'underbed' && !showUnderbed) isVisible = false;

  let opacity = 1;
  if (mod.layer === 'furniture' && ghostBedTop) {
    opacity = 0.25;
  }

  // Keyboard shortcut to rotate
  useEffect(() => {
    if (isReadonly) return;
    const handleKeyDown = (e) => {
      if (active && e.key.toLowerCase() === 'r') {
        rotateModule(mod.id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [active, mod.id, rotateModule, isReadonly]);

  if (!isVisible) return null;

  const [w = 1, h = 1, d = 1] = mod.dimensions || [];

  const renderShape = () => {

    /*
    // 1. Water Tanks (Cylinder)
    if (mod.typeId.includes('water-tank')) {
      return <WaterTankShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Battery Bank
    if (mod.typeId === 'battery-bank') {
      return <BatteryBankShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 2. Solar Arrays
    if (mod.typeId.includes('solar-array')) {
      return <SolarArrayShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 3. Kitchen Galley
    if (mod.typeId === 'kitchen-galley') {
      return <KitchenGalleyShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Upright Fridge
    if (mod.typeId === 'upright-fridge') {
      return <UprightFridgeShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Gas Locker
    if (mod.typeId === 'gas-locker') {
      return <GasLockerShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Bathroom Modules
    if (mod.typeId === 'shower-cabin') {
      return <ShowerCabinShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    if (mod.typeId === 'cassette-toilet') {
      return <CassetteToiletShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    if (mod.typeId === 'grey-water-tank') {
      return <GreyWaterTankShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 4. Dinette Seating
    if (mod.typeId === 'dinette-seating') {
      return <DinetteSeatingShape w={w} h={h} d={d} color={mod.color} opacity={opacity} isBedMode={mod.isBedMode} />;
    }
    // Sofa Bed
    if (mod.typeId === 'sofa-bed') {
      return <SofaBedShape w={w} h={h} d={d} color={mod.color} opacity={opacity} isBedMode={mod.isBedMode} />;
    }
    // Fixed Bed
    if (mod.typeId === 'bed-fixed') {
      return <FixedBedShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Tall Wardrobe
    if (mod.typeId === 'tall-wardrobe') {
      return <TallWardrobeShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Engine Cushion
    if (mod.typeId === 'engine-cushion') {
      return <EngineCushionShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Lagun Table
    if (mod.typeId === 'lagun-table') {
      return <LagunTableShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Swivel Seat
    if (mod.typeId === 'swivel-seat') {
      return <SwivelSeatShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 7. Diesel Heater
    if (mod.typeId === 'diesel-heater') {
      return <DieselHeaterShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 8. Control Panel
    if (mod.typeId === 'control-panel') {
      return <ControlPanelShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 9. Inverter Hub
    if (mod.typeId === 'inverter-hub') {
      return <InverterHubShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // 10. Pop-Top Roof
    if (mod.typeId === 'pop-top-roof') {
      return <PopTopRoofShape w={w} h={h} d={d} color={mod.color} opacity={opacity} isOpen={mod.isOpen} />;
    }
    // 11. Side Awning
    if (mod.typeId === 'side-awning') {
      return <SideAwningShape w={w} h={h} d={d} color={mod.color} opacity={opacity} parentX={mod.position[0]} />;
    }
    // Roof AC
    if (mod.typeId === 'roof-ac') {
      return <RoofACShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Maxxair Fan
    if (mod.typeId === 'maxxair-fan') {
      return <MaxxairFanShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    // Overhead Locker
    if (mod.typeId === 'overhead-locker') {
      return <OverheadLockerShape w={w} h={h} d={d} color={mod.color} opacity={opacity} />;
    }
    */

    // Default Fallback: Mathematical Render of Parts Array
    if (mod.parts && mod.parts.length > 0) {
      const override = mod.chassisOverrides?.[activeChassis] || {};
      const defaultL = mod.defaultL || 1;
      const defaultW = mod.defaultW || 1;
      const defaultH = mod.defaultH || 1;
      const scaleL = (override.l || defaultL) / defaultL;
      const scaleW = (override.w || defaultW) / defaultW;
      const scaleH = (override.h || defaultH) / defaultH;

      return (
        <group>
          {mod.parts.map(part => {
            const secondState = mod.states?.find(s => s !== 'default') || 'open';
            const currentState = (mod.isOpen || mod.isBedMode) ? secondState : 'default';
            const isVisible = !(part.visibleInStates && Array.isArray(part.visibleInStates) && part.visibleInStates.length > 0 && !part.visibleInStates.includes(currentState));
            if (!isVisible) return null;

            const S = 1 / 100;
            const scaledL = (part.size?.[0] || 0) * scaleL * S;
            const scaledH = (part.size?.[2] || 0) * scaleH * S;
            const scaledW = (part.size?.[1] || 0) * scaleW * S;

            const getArrayValue = (field) => {
              if (!part[field]) return [0, 0, 0];
              if (Array.isArray(part[field])) return part[field];
              if (typeof part[field] === 'object') {
                return part[field][currentState] || part[field]['default'] || [0, 0, 0];
              }
              return [0, 0, 0];
            };

            const currentOffset = getArrayValue('offset');
            const currentRotation = getArrayValue('rotation');

            const initialPosition = [
              (currentOffset[0] * scaleL * S),
              ((currentOffset[1] * scaleH * S)) + (scaledH / 2) - (h / 2),
              (currentOffset[2] * scaleW * S)
            ];

            const initialRotation = [
              THREE.MathUtils.degToRad(currentRotation[0]),
              THREE.MathUtils.degToRad(currentRotation[1]),
              THREE.MathUtils.degToRad(currentRotation[2])
            ];

            let finalPartColor = part.color || '#4b5563';
            if (part.isColorable && mod.color) {
              finalPartColor = mod.color;
            }
            const partColor = part.shape === 'window' ? '#000000' : part.shape === 'wheel' ? '#1a1a1a' : finalPartColor;
            const pOpacity = part.shape === 'window' ? 0.5 : (part.opacity !== undefined ? part.opacity : opacity);
            const isTrans = part.shape === 'window' ? true : (pOpacity < 1);

            let geometry;
            if (part.shape === 'wedge') {
              const shape = new THREE.Shape();
              shape.moveTo(-0.5, -0.5);
              shape.lineTo(0.5, -0.5);
              shape.lineTo(-0.5, 0.5);
              shape.lineTo(-0.5, -0.5);
              const geom = new THREE.ExtrudeGeometry(shape, { depth: 1, bevelEnabled: false });
              geom.center();
              geom.scale(scaledL, scaledH, scaledW);
              geometry = <primitive object={geom} attach="geometry" />;
            } else if (part.shape === 'cylinder') {
              geometry = <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledH, 32]} />;
            } else if (part.shape === 'wheel') {
              geometry = <cylinderGeometry args={[scaledL / 2, scaledL / 2, scaledW, 32]} />;
            } else if (part.shape === 'sphere') {
              geometry = <sphereGeometry args={[scaledL / 2, 32, 32]} />;
            } else {
              geometry = <boxGeometry args={[scaledL, scaledH, scaledW]} />;
            }

            return (
              <mesh key={part.id} position={initialPosition} rotation={initialRotation}>
                {geometry}
                <meshStandardMaterial 
                  color={partColor}
                  roughness={part.shape === 'window' ? 0.1 : part.shape === 'wheel' ? 0.9 : (part.roughness !== undefined ? part.roughness : 0.7)}
                  metalness={part.shape === 'window' ? 0.9 : part.shape === 'wheel' ? 0.1 : (part.metalness !== undefined ? part.metalness : 0.2)}
                  transparent={isTrans}
                  opacity={pOpacity}
                />
              </mesh>
            );
          })}
        </group>
      );
    }

    // Ultimate Fallback Box (if parts array is completely missing)
    return (
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial 
          color={mod.color} 
          transparent={opacity < 1} 
          opacity={opacity}
        />
      </mesh>
    );
  };

  return (
    <>
      {!isReadonly && active && (
        <TransformControls 
          object={meshRef} 
          mode="translate" 
          showX={true} 
          showZ={true} 
          showY={true}
          onMouseUp={() => {
            if (meshRef.current) {
              updateModulePosition(mod.id, [
                meshRef.current.position.x,
                meshRef.current.position.y,
                meshRef.current.position.z
              ]);
            }
          }}
        />
      )}
      <group 
        ref={meshRef}
        position={mod.position} 
        rotation={[0, mod.rotation || 0, 0]}
        onClick={isReadonly ? undefined : (e) => { e.stopPropagation(); setActiveModule(mod.id); }}
        onContextMenu={isReadonly ? undefined : (e) => { e.stopPropagation(); removeModule(mod.id); }}
      >
        {renderShape()}
        
        {active && (
          <mesh>
            <boxGeometry args={[w+0.04, h+0.04, d+0.04]} />
            <meshBasicMaterial color="#ffffff" wireframe />
          </mesh>
        )}
      </group>
    </>
  );
}
