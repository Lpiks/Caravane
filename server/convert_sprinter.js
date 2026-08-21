const fs = require('fs');
const path = require('path');

const baseChassisPath = path.join(__dirname, '../client/src/data/baseChassis.json');

// Swap Math:
// JSX axes: X = Width, Y = Height, Z = Length
// Builder axes: X = Length, Y = Height, Z = Width
// Size mapping: [Length, Width, Height] -> [Z, X, Y]
// Offset mapping: [Length, Height, Width] -> [Z, Y_center - Height/2, X]
// Rotation mapping: [RotZ (from JSX), -RotY (from JSX), RotX (from JSX)]
function convertPart(id, name, shape, size, pos, rot, extra = {}) {
  const scaledSize = [size[2], size[0], size[1]]; // [Length, Width, Height]
  const scaledOffset = [
    pos[2] * 100,                     // X_builder (Length) = Z_jsx
    pos[1] * 100 - (size[1] / 2),    // Y_builder (Height bottom edge) = Y_center - Height/2
    pos[0] * 100                      // Z_builder (Width) = X_jsx
  ];
  const scaledRot = [
    rot[2],                           // RotX_builder = RotZ_jsx
    -rot[1],                          // RotY_builder = -RotY_jsx
    rot[0]                            // RotZ_builder = RotX_jsx
  ];

  return {
    id,
    name,
    shape,
    size: scaledSize.map(v => Math.round(v * 10) / 10),
    offset: scaledOffset.map(v => Math.round(v * 10) / 10),
    rotation: scaledRot.map(v => Math.round(v * 10) / 10),
    ...extra
  };
}

function run() {
  try {
    const rawData = fs.readFileSync(baseChassisPath, 'utf8');
    const chassis = JSON.parse(rawData);

    // Find the sprinter-144 entry
    const sprinterIndex = chassis.findIndex(c => c.id === 'sprinter-144');
    if (sprinterIndex === -1) {
      console.error('sprinter-144 not found in baseChassis.json!');
      return;
    }

    // NEW REAL-WORLD DIMENSIONS
    const width = 179;
    const bodyLength = 593;
    const frontZ = 2.965;
    const rearZ = -2.965;
    
    // Proper Sprinter layout mathematical coordinates
    // 1. The Engine Bay (Hood)
    const hoodLength = 100;
    const hoodStartZ = frontZ - (hoodLength / 100); // 1.965
    const hoodCenterZ = hoodStartZ + (hoodLength / 200); // 2.465

    // 2. The Windshield Slope (A-Pillars)
    const windRun = 50;  // 50cm horizontal run
    const windRise = 120; // 120cm vertical rise (from Y=100 to Y=220)
    const roofFrontZ = hoodStartZ - (windRun / 100); // 1.465
    const windCenterZ = roofFrontZ + (windRun / 200); // 1.715
    const windAngle = -Math.atan(windRun / windRise) * (180 / Math.PI); // -22.6 degrees
    const windLength = Math.sqrt(Math.pow(windRun, 2) + Math.pow(windRise, 2)); // 130cm

    // 3. The Main Body (Cargo + Cabin)
    const lowerBodyLength = hoodStartZ - rearZ; // 4.93m
    const lowerBodyCenterZ = rearZ + (lowerBodyLength / 2); // -0.50

    const upperBodyLength = roofFrontZ - rearZ; // 4.43m
    const upperBodyCenterZ = rearZ + (upperBodyLength / 2); // -0.75

    // 4. Interior Placement
    const cargoDividerZ = rearZ + 3.38; // 0.415 (338cm cargo length)
    const seatZ = cargoDividerZ + 0.6;  // 1.015 (Cabin seats)
    const dashZ = seatZ + 0.6;          // 1.615 (Dashboard console)
    const wheelZ = 1.83; // 144" wheelbase is 366cm

    const parts = [
      // === THE CHASSIS BASE ===
      convertPart("floor", "Main Floor", "box", [width, 10, bodyLength], [0, -0.05, 0], [0, 0, 0], { "color": "#3A3D40", "opacity": 1, "metalness": 0.2, "roughness": 0.8 }),
      convertPart("wheel-1", "Wheel Front Left", "wheel", [70, 25, 70], [-width / 200 + 0.15, -0.1, wheelZ], [0, 0, 90], { "color": "#111827" }),
      convertPart("wheel-2", "Wheel Front Right", "wheel", [70, 25, 70], [width / 200 - 0.15, -0.1, wheelZ], [0, 0, 90], { "color": "#111827" }),
      convertPart("wheel-3", "Wheel Rear Left", "wheel", [70, 25, 70], [-width / 200 + 0.15, -0.1, -wheelZ], [0, 0, 90], { "color": "#111827" }),
      convertPart("wheel-4", "Wheel Rear Right", "wheel", [70, 25, 70], [width / 200 - 0.15, -0.1, -wheelZ], [0, 0, 90], { "color": "#111827" }),

      // === THE ENGINE BAY (NOSE) ===
      // A solid base box, capped with a perfectly sloping wedge for the aerodynamic hood!
      convertPart("hood-base", "Engine Bay Base", "box", [width, 70, hoodLength], [0, 35/100, hoodCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("hood-slope", "Aerodynamic Hood", "wedge", [width, 30, hoodLength], [0, 85/100, hoodCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("front-grill-panel", "Front Grill Panel", "box", [width, 70, 4], [0, 0.35, frontZ - 0.02], [0, 0, 0], { "color": "#1f2937" }),
      convertPart("front-bumper", "Front Bumper", "box", [width, 30, 20], [0, 0.15, frontZ + 0.05], [0, 0, 0], { "color": "#1f2937" }),
      convertPart("front-headlight-l", "Front Headlight Left", "cylinder", [12, 12, 2], [-55 / 100, 0.55, frontZ + 0.01], [90, 0, 0], { "color": "#ffffff" }),
      convertPart("front-headlight-r", "Front Headlight Right", "cylinder", [12, 12, 2], [55 / 100, 0.55, frontZ + 0.01], [90, 0, 0], { "color": "#ffffff" }),

      // === THE LOWER BODY (Cargo + Cabin) ===
      convertPart("lower-body-left", "Lower Body Shell Left", "box", [4, 100, lowerBodyLength * 100], [-width / 200 + 0.02, 0.5, lowerBodyCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("lower-body-right", "Lower Body Shell Right", "box", [4, 100, lowerBodyLength * 100], [width / 200 - 0.02, 0.5, lowerBodyCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("lower-body-rear", "Lower Body Shell Rear", "box", [width, 100, 4], [0, 0.5, rearZ + 0.02], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("rear-bumper", "Rear Bumper", "box", [width, 30, 20], [0, 0.15, rearZ - 0.1], [0, 0, 0], { "color": "#1f2937" }),

      // === THE UPPER BODY (Cargo + Rear Cabin) ===
      // Stops precisely where the windshield slope begins.
      convertPart("upper-body-glass-left", "Upper Body Glass Left", "window", [4, 120, upperBodyLength * 100], [-width / 200 + 0.02, 1.6, upperBodyCenterZ], [0, 0, 0], { "color": "#1e3a8a", "opacity": 0.05, "metalness": 0.9, "roughness": 0.1 }),
      convertPart("upper-body-glass-right", "Upper Body Glass Right", "window", [4, 120, upperBodyLength * 100], [width / 200 - 0.02, 1.6, upperBodyCenterZ], [0, 0, 0], { "color": "#1e3a8a", "opacity": 0.05, "metalness": 0.9, "roughness": 0.1 }),
      convertPart("high-roof-lower", "High Roof Lower Panel", "box", [width, 5, upperBodyLength * 100], [0, 2.225, upperBodyCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("high-roof-upper", "High Roof Upper Cap", "box", [width-10, 15, upperBodyLength * 100 - 20], [0, 2.30, upperBodyCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("corner-rear-left", "Corner Rear Left", "box", [5, 120, 10], [-width / 200 + 0.02, 1.6, rearZ + 0.05], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("corner-rear-right", "Corner Rear Right", "box", [5, 120, 10], [width / 200 - 0.02, 1.6, rearZ + 0.05], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),

      // === THE WINDSHIELD SLOPE ===
      // Using wedges for the A-pillars creates a solid, gap-less transition from roof to hood!
      convertPart("pillar-wedge-left", "A-Pillar Wedge Left", "wedge", [4, windRise, windRun], [-width / 200 + 0.02, 1.6, windCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("pillar-wedge-right", "A-Pillar Wedge Right", "wedge", [4, windRise, windRun], [width / 200 - 0.02, 1.6, windCenterZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("windshield", "Front Windshield", "window", [width, windLength, 4], [0, 1.6, windCenterZ], [windAngle, 0, 0], { "color": "#1e3a8a", "opacity": 0.05, "metalness": 0.9, "roughness": 0.1 }),

      // B-Pillars stay straight and mark the cargo divider
      convertPart("pillar-b-left", "Pillar B Left", "box", [5, 120, 15], [-width / 200 + 0.02, 1.6, cargoDividerZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("pillar-b-right", "Pillar B Right", "box", [5, 120, 15], [width / 200 - 0.02, 1.6, cargoDividerZ], [0, 0, 0], { "color": "#ffffff", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),

      // === DOORS & DETAILS ===
      convertPart("sliding-door", "Sliding Door Panel", "box", [4, 182, 130], [width / 200 + 0.005, 0.91, -0.18], [0, 0, 0], { "color": "#ef4444", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("sliding-door-window", "Sliding Door Window", "window", [5, 70, 90], [width / 200 + 0.005, 1.4, -0.18], [0, 0, 0], { "color": "#1e3a8a", "opacity": 0.3, "metalness": 0.5, "roughness": 0.1 }),
      convertPart("sliding-track", "Sliding Track Rail", "box", [2, 5, 260], [width / 200 + 0.02, 1.0, -0.78], [0, 0, 0], { "color": "#333333" }),
      
      convertPart("left-barn-door", "Left Barn Door Panel", "box", [width/2 - 1.5, 210, 4], [-width/400 - 0.01, 1.1, rearZ], [0, 0, 0], { "color": "#ef4444", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("left-barn-door-window", "Left Barn Door Window", "window", [60, 70, 5], [-width/400 - 0.01, 1.5, rearZ], [0, 0, 0], { "color": "#1e3a8a", "opacity": 0.3, "metalness": 0.5, "roughness": 0.1 }),
      convertPart("right-barn-door", "Right Barn Door Panel", "box", [width/2 - 1.5, 210, 4], [width/400 + 0.01, 1.1, rearZ], [0, 0, 0], { "color": "#ef4444", "opacity": 0.15, "metalness": 0.2, "roughness": 0.7 }),
      convertPart("right-barn-door-window", "Right Barn Door Window", "window", [60, 70, 5], [width/400 + 0.01, 1.5, rearZ], [0, 0, 0], { "color": "#1e3a8a", "opacity": 0.3, "metalness": 0.5, "roughness": 0.1 }),

      convertPart("wheel-arch-left", "Wheel Arch Left", "box", [22, 40, 90], [-width / 200 + 0.11, 0.2, -wheelZ], [0, 0, 0], { "color": "#4B5563" }),
      convertPart("wheel-arch-right", "Wheel Arch Right", "box", [22, 40, 90], [width / 200 - 0.11, 0.2, -wheelZ], [0, 0, 0], { "color": "#4B5563" }),

      // === COCKPIT ===
      convertPart("cockpit-block", "Driver Cockpit Console", "box", [width-20, 40, 40], [0, 0.825, dashZ], [0, 0, 0], { "color": "#22252A" }),
      convertPart("steering-wheel", "Steering Wheel", "cylinder", [30, 30, 5], [-0.4, 1.125, dashZ - 0.1], [45, 0, 0], { "color": "#22252A" }),

      // === SEATS ===
      convertPart("driver-seat-stand", "Driver Seat Base", "cylinder", [16, 16, 30], [-0.4, 0.525, seatZ], [0, 0, 0], { "color": "#1E293B", "metalness": 0.8, "roughness": 0.2 }),
      convertPart("driver-seat-cushion", "Driver Seat Cushion", "box", [50, 10, 50], [-0.4, 0.725, seatZ], [0, 0, 0], { "color": "#22252A" }),
      convertPart("driver-seat-back", "Driver Seat Backrest", "box", [50, 50, 10], [-0.4, 1.025, seatZ - 0.2], [0, 0, 0], { "color": "#22252A" }),

      convertPart("passenger-seat-stand", "Passenger Seat Base", "cylinder", [16, 16, 30], [0.4, 0.525, seatZ], [0, 0, 0], { "color": "#1E293B", "metalness": 0.8, "roughness": 0.2 }),
      convertPart("passenger-seat-cushion", "Passenger Seat Cushion", "box", [50, 10, 50], [0.4, 0.725, seatZ], [0, 0, 0], { "color": "#22252A" }),
      convertPart("passenger-seat-back", "Passenger Seat Backrest", "box", [50, 50, 10], [0.4, 1.025, seatZ - 0.2], [0, 0, 0], { "color": "#22252A" })
    ];

    chassis[sprinterIndex].parts = parts;

    fs.writeFileSync(baseChassisPath, JSON.stringify(chassis, null, 2), 'utf8');
    console.log('Successfully converted and saved Mercedes Sprinter parts to baseChassis.json!');
    
  } catch (err) {
    console.error(err);
  }
}

run();
