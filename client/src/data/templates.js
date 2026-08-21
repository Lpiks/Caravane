export const getStudioTemplates = (activeChassis, activeModelId) => {
  let length = 5.4;
  let width = 1.9;
  let cockpitLength = 1.2;
  
  if (activeChassis === 'compact-classic') {
    length = 2.8;
    width = 1.8;
    cockpitLength = 1.3;
  }
  if (activeChassis === 'minibus-canvas') {
    length = 6.5;
    width = 2.1;
    cockpitLength = 1.2;
  }
  if (activeChassis === 'maxi-bus') {
    if (activeModelId === 'uk-double-decker') {
      length = 9.1;
      width = 2.4;
    } else {
      length = 11.52;
      width = 2.5;
    }
    cockpitLength = 1.2;
  }

  // Calculate exact coordinate relative to the shifted grid
  // For standard classes, rearZ is lengthwise.
  // For maxi-bus class, rearX is lengthwise, and width is along Z.
  let rearZ = -length / 2 - cockpitLength / 2;
  const leftX = -width / 2;
  const rightX = width / 2;

  const rearX = -length / 2;
  const leftZ = -width / 2;
  const rightZ = width / 2;

  // Specific overrides for chassis that have hoods or distinct exterior dimensions
  if (activeChassis === 'standard-highroof') {
    length = 3.12; // Cargo Length
    width = 1.9; // Cargo Width
    rearZ = -2.7; // Exterior length of 5.4m, centered at 0
  }

  // 1. Compact Class (VW T3/T4)
  if (activeChassis === 'compact-classic') {
    return [
      {
        id: "t3-westfalia",
        name: "Classic Westfalia Layout",
        description: "The timeless layout featuring a rock-and-roll bed at the rear and a full kitchen/storage block along the left wall.",
        modules: [
          { id: "t3-w-bed", typeId: "rock-roll-bed", name: "Rock-and-Roll Bed", dimensions: [1.1, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#f87171", weightKg: 30, position: [rearX + 0.9, 0.25, leftZ + 0.55], rotation: 0, isBedMode: true },
          { id: "t3-w-kitchen", typeId: "kitchen-galley", name: "Side Kitchen Block", dimensions: [1.2, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.05, 0.425, rightZ - 0.35], rotation: 0 },
          { id: "t3-w-fridge", typeId: "chest-fridge", name: "Top-Loading Fridge", dimensions: [0.6, 0.5, 0.45], layer: 'furniture', defaultY: 0.25, color: "#cbd5e1", weightKg: 15, position: [rearX + 2.95, 0.25, rightZ - 0.35], rotation: 0 },
          { id: "t3-w-wardrobe", typeId: "tall-wardrobe", name: "Rear Wardrobe Cabinet", dimensions: [0.5, 1.3, 0.45], layer: 'furniture', defaultY: 0.65, color: "#4b5563", weightKg: 20, position: [rearX + 0.55, 0.65, rightZ - 0.35], rotation: 0 },
          { id: "t3-w-tank", typeId: "water-tank", name: "40L Underbody Tank", dimensions: [0.8, 0.2, 0.5], layer: 'underbody', defaultY: -0.2, color: "#0ea5e9", waterLiters: 40, weightKg: 45, position: [0, -0.2, 0], rotation: 0 },
          { id: "t3-w-battery", typeId: "battery-bank", name: "100Ah AGM Battery", dimensions: [0.3, 0.2, 0.2], layer: 'underbed', defaultY: 0.1, color: "#facc15", solarWattage: 100, weightKg: 25, position: [rearX + 0.9, 0.1, leftZ + 0.55], rotation: 0 }
        ]
      },
      {
        id: "t3-overland-pro",
        name: "Professional Gear Hauler",
        description: "Empty center floor with a fold-away sofa and modular storage. Built for carrying bikes, boards, or heavy equipment during the day.",
        modules: [
          { id: "t3-pro-sofa", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [1.1, 0.5, 0.6], layer: 'furniture', defaultY: 0.25, color: "#e2e8f0", weightKg: 35, position: [rearX + 0.9, 0.25, leftZ + 0.55], rotation: Math.PI / 2, isBedMode: false },
          { id: "t3-pro-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.5, 0.7, 0.35], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 8, position: [rearX + 1.4, 0.35, 0], rotation: Math.PI / 2 },
          { id: "t3-pro-tank", typeId: "water-tank", name: "120L Heavy Water Tank", dimensions: [0.6, 0.4, 0.6], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.9, 0.2, leftZ + 0.55], rotation: 0 },
          { id: "t3-pro-battery", typeId: "battery-bank", name: "200Ah Lithium Battery", dimensions: [0.4, 0.3, 0.4], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.9, 0.2, leftZ + 0.55], rotation: Math.PI / 2 },
          { id: "t3-pro-heater", typeId: "diesel-heater", name: "Diesel Air Heater", dimensions: [0.4, 0.3, 0.3], layer: 'underbed', defaultY: 0.15, color: "#1e293b", weightKg: 5, position: [rearX + 1.45, 0.15, rightZ - 0.35], rotation: Math.PI / 2 },
          { id: "t3-pro-awning", typeId: "side-awning", name: "Side Roll-Out Awning", dimensions: [3.0, 0.15, 0.15], layer: 'roof', defaultY: 1.95, color: "#94a3b8", weightKg: 20, position: [rearX + 1.5, 1.95, rightZ + 0.05], rotation: Math.PI / 2 },
          { id: "t3-pro-solar", typeId: "solar-array", name: "400W Off-Grid Solar Array", dimensions: [1.0, 0.05, 1.5], layer: 'roof', defaultY: 1.95, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 1.8, 1.95, 0], rotation: Math.PI / 2 },
          { id: "t3-pro-fan", typeId: "maxxair-fan", name: "Maxxair Roof Vent", dimensions: [0.4, 0.1, 0.4], layer: 'roof', defaultY: 1.95, color: "#1f2937", weightKg: 5, position: [rearX + 1.0, 1.95, 0], rotation: Math.PI / 2 }
        ]
      }
    ];
  }

  // 2. Heavy Bus Class (SNVI School Bus or UK Double-Decker Bus)
  if (activeChassis === 'maxi-bus') {
    if (activeModelId === 'uk-double-decker') {
      return [
        {
          id: "uk-penthouse",
          name: "Luxury Penthouse Suite",
          description: "Premium double-deck build featuring a lower deck gourmet kitchen, cozy dining booth, and private wet bath. The upper deck boasts a sky lounge and a private master bedroom.",
          modules: [
            // Lower Deck (Ground floor - Y = 0)
            // Bedroom/Bathroom at the Rear (left side of grid, small X values)
            { id: "uk-penth-wardrobe", typeId: "tall-wardrobe", name: "Tall Wardrobe Closet", dimensions: [0.6, 1.8, 0.8], layer: 'furniture', defaultY: 0.9, color: "#4b5563", weightKg: 25, position: [rearX + 1.5, 0.9, leftZ + 0.5], rotation: Math.PI },
            { id: "uk-penth-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.9, 1.9, 0.9], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 35, position: [rearX + 3.5, 0.95, rightZ - 0.55], rotation: -Math.PI / 2 },
            { id: "uk-penth-toilet", typeId: "cassette-toilet", name: "Cassette Toilet", dimensions: [0.7, 0.8, 0.6], layer: 'furniture', defaultY: 0.4, color: "#f3f4f6", weightKg: 15, position: [rearX + 3.5, 0.4, leftZ + 0.4], rotation: Math.PI / 2 },
            { id: "uk-penth-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 1.5, 0.2, 0], rotation: Math.PI / 2 },
            { id: "uk-penth-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 400, weightKg: 25, position: [rearX + 2.2, 0.15, -0.3], rotation: Math.PI / 2 },
            
            // Living/Kitchen at the Front (right side of grid, large X values)
            { id: "uk-penth-kitchen", typeId: "kitchen-galley", name: "Gourmet Kitchen Block", dimensions: [1.8, 0.85, 0.6], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 45, position: [rearX + 6.0, 0.425, rightZ - 0.4], rotation: 0 },
            { id: "uk-penth-cooktop", typeId: "cooktop", name: "Induction Cooktop", dimensions: [0.6, 0.08, 0.4], layer: 'furniture', defaultY: 0.89, color: "#0F172A", weightKg: 5, position: [rearX + 6.0, 0.89, rightZ - 0.4], rotation: 0 },
            { id: "uk-penth-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.6, 1.4, 0.6], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 28, position: [rearX + 7.5, 0.7, rightZ - 0.4], rotation: 0 },
            { id: "uk-penth-bench1", typeId: "dinette-seating", name: "Dining Bench Left", dimensions: [1.0, 0.5, 1.0], layer: 'furniture', defaultY: 0.25, color: "#374151", weightKg: 20, position: [rearX + 6.0, 0.25, leftZ + 0.65], rotation: -Math.PI / 2 },
            { id: "uk-penth-bench2", typeId: "dinette-seating", name: "Dining Bench Right", dimensions: [1.0, 0.5, 1.0], layer: 'furniture', defaultY: 0.25, color: "#374151", weightKg: 20, position: [rearX + 7.2, 0.25, leftZ + 0.65], rotation: Math.PI / 2 },
            { id: "uk-penth-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.8], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 6.6, 0.35, leftZ + 0.65], rotation: Math.PI / 2 },
            
            // Upper Deck (First Floor - raised by Y = 1.8m)
            { id: "uk-penth-bed", typeId: "bed-fixed", name: "Luxury Sky Bedroom", dimensions: [1.9, 0.6, 1.6], layer: 'furniture', defaultY: 2.1, color: "#d97706", weightKg: 45, position: [rearX + 1.5, 2.1, 0], rotation: Math.PI / 2 },
            { id: "uk-penth-locker", typeId: "overhead-locker", name: "Ceiling Storage Locker", dimensions: [1.9, 0.35, 0.4], layer: 'overhead', defaultY: 3.4, color: "#9ca3af", weightKg: 18, position: [rearX + 0.5, 3.4, 0], rotation: Math.PI / 2 },
            { id: "uk-penth-skysofa1", typeId: "sofa-bed", name: "Sky Lounge Sofa Left", dimensions: [1.6, 0.5, 0.7], layer: 'furniture', defaultY: 2.05, color: "#d97706", weightKg: 35, position: [rearX + 6.5, 2.05, leftZ + 0.6], rotation: Math.PI },
            { id: "uk-penth-skysofa2", typeId: "sofa-bed", name: "Sky Lounge Sofa Right", dimensions: [1.6, 0.5, 0.7], layer: 'furniture', defaultY: 2.05, color: "#d97706", weightKg: 35, position: [rearX + 6.5, 2.05, rightZ - 0.6], rotation: 0 },
            { id: "uk-penth-skytable", typeId: "lagun-table", name: "Sky Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 2.15, color: "#b45309", weightKg: 8, position: [rearX + 6.5, 2.15, 0], rotation: 0 }
          ]
        },
        {
          id: "uk-tourer",
          name: "Family Expedition Tourer",
          description: "Double-decker travel coach built to comfortably sleep and seat 6+ people. Ground floor focuses on dining, gourmet cooking and bathrooms, while the upper floor has multiple bunk modules and storage closets.",
          modules: [
            // Lower Deck (Ground floor - Y = 0)
            // Rear area (Bathroom & storage)
            { id: "uk-tour-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.8, 0.2, 0], rotation: Math.PI / 2 },
            { id: "uk-tour-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.8, 1.9, 0.8], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 1.8, 0.95, leftZ + 0.5], rotation: Math.PI / 2 },
            { id: "uk-tour-toilet", typeId: "cassette-toilet", name: "Cassette Toilet", dimensions: [0.7, 0.8, 0.6], layer: 'furniture', defaultY: 0.4, color: "#f3f4f6", weightKg: 15, position: [rearX + 1.8, 0.4, rightZ - 0.5], rotation: -Math.PI / 2 },
            
            // Mid-Front (Kitchen & Living)
            { id: "uk-tour-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [1.6, 0.85, 0.6], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 4.5, 0.425, rightZ - 0.4], rotation: 0 },
            { id: "uk-tour-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.6, 1.4, 0.6], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 28, position: [rearX + 3.3, 0.7, rightZ - 0.4], rotation: 0 },
            { id: "uk-tour-sofa1", typeId: "sofa-bed", name: "Travel Sofa Left", dimensions: [1.6, 0.5, 0.7], layer: 'furniture', defaultY: 0.25, color: "#1e3a8a", weightKg: 35, position: [rearX + 7.0, 0.25, leftZ + 0.5], rotation: Math.PI },
            { id: "uk-tour-sofa2", typeId: "sofa-bed", name: "Travel Sofa Right", dimensions: [1.6, 0.5, 0.7], layer: 'furniture', defaultY: 0.25, color: "#1e3a8a", weightKg: 35, position: [rearX + 7.0, 0.25, rightZ - 0.5], rotation: 0 },
            
            // Upper Deck (First Floor - raised by Y = 1.8m)
            { id: "uk-tour-bed1", typeId: "bed-fixed", name: "Bunk Bed Rear", dimensions: [1.8, 0.6, 1.4], layer: 'furniture', defaultY: 2.1, color: "#1e3a8a", weightKg: 40, position: [rearX + 1.5, 2.1, 0], rotation: Math.PI / 2 },
            { id: "uk-tour-bed2", typeId: "bed-fixed", name: "Bunk Bed Middle", dimensions: [1.8, 0.6, 1.4], layer: 'furniture', defaultY: 2.1, color: "#1e3a8a", weightKg: 40, position: [rearX + 3.5, 2.1, 0], rotation: Math.PI / 2 },
            { id: "uk-tour-wardrobe", typeId: "tall-wardrobe", name: "Tall Wardrobe Closet", dimensions: [0.6, 1.8, 0.6], layer: 'furniture', defaultY: 2.7, color: "#4b5563", weightKg: 25, position: [rearX + 5.5, 2.7, leftZ + 0.4], rotation: Math.PI },
            { id: "uk-tour-bench1", typeId: "dinette-seating", name: "Sky Study Bench 1", dimensions: [1.0, 0.5, 0.8], layer: 'furniture', defaultY: 2.05, color: "#1e3a8a", weightKg: 20, position: [rearX + 7.0, 2.05, rightZ - 0.6], rotation: Math.PI },
            { id: "uk-tour-bench2", typeId: "dinette-seating", name: "Sky Study Bench 2", dimensions: [1.0, 0.5, 0.8], layer: 'furniture', defaultY: 2.05, color: "#1e3a8a", weightKg: 20, position: [rearX + 8.2, 2.05, rightZ - 0.6], rotation: 0 }
          ]
        }
      ];
    } else {
      // Default to SNVI 100 V8 School Bus
      return [
        {
          id: "snvi-loft",
          name: "Luxury Mobile Loft",
          description: "High-end open-plan layout for the SNVI bus. Features a giant master bedroom at the rear, private mid-bus shower and toilet compartments, and a spacious front lounge kitchen area.",
          modules: [
            // Rear area (Bedroom)
            { id: "snvi-loft-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.8], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 1.6, 0.3, 0], rotation: Math.PI / 2 },
            { id: "snvi-loft-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 1.6, 0.2, 0.4], rotation: Math.PI / 2 },
            { id: "snvi-loft-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 400, weightKg: 25, position: [rearX + 1.6, 0.15, -0.4], rotation: 0 },
            { id: "snvi-loft-wardrobe", typeId: "tall-wardrobe", name: "Tall Wardrobe Closet", dimensions: [0.6, 1.9, 0.8], layer: 'furniture', defaultY: 0.95, color: "#4b5563", weightKg: 25, position: [rearX + 3.2, 0.95, leftZ + 0.5], rotation: Math.PI },
            
            // Mid area (Shower & Toilet)
            { id: "snvi-loft-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.9, 1.9, 0.9], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 35, position: [rearX + 4.8, 0.95, rightZ - 0.55], rotation: -Math.PI / 2 },
            { id: "snvi-loft-toilet", typeId: "cassette-toilet", name: "Cassette Toilet", dimensions: [0.7, 0.8, 0.6], layer: 'furniture', defaultY: 0.4, color: "#f3f4f6", weightKg: 15, position: [rearX + 4.8, 0.4, leftZ + 0.45], rotation: Math.PI / 2 },
            
            // Front area (Lounge & Kitchen)
            { id: "snvi-loft-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [1.8, 0.85, 0.6], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 7.5, 0.425, rightZ - 0.45], rotation: 0 },
            { id: "snvi-loft-cooktop", typeId: "cooktop", name: "Induction Cooktop", dimensions: [0.6, 0.08, 0.4], layer: 'furniture', defaultY: 0.89, color: "#0F172A", weightKg: 5, position: [rearX + 7.5, 0.89, rightZ - 0.45], rotation: 0 },
            { id: "snvi-loft-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.6, 1.4, 0.6], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 28, position: [rearX + 8.8, 0.7, rightZ - 0.45], rotation: 0 },
            { id: "snvi-loft-sofa", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [1.8, 0.5, 0.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 7.8, 0.25, leftZ + 0.5], rotation: Math.PI },
            { id: "snvi-loft-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 8, position: [rearX + 7.8, 0.35, 0], rotation: 0 }
          ]
        },
        {
          id: "snvi-expedition",
          name: "Off-Grid Expedition Rig",
          description: "Heavy-duty adventure rig featuring a rear dinette lounge that converts into a king bed, built-in dual fresh water tanks, complete battery bank power hub, front wet bath, and heavy-duty kitchen galley.",
          modules: [
            // Rear area (Convertible Dinette Lounge)
            { id: "snvi-exp-bench1", typeId: "dinette-seating", name: "Lounge Bench Left", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#374151", weightKg: 20, position: [rearX + 1.8, 0.25, leftZ + 0.4], rotation: Math.PI },
            { id: "snvi-exp-bench2", typeId: "dinette-seating", name: "Lounge Bench Right", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#374151", weightKg: 20, position: [rearX + 1.8, 0.25, rightZ - 0.4], rotation: 0 },
            { id: "snvi-exp-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 1.8, 0.35, 0], rotation: 0 },
            
            // Mid-Rear (Water tanks, batteries, storage)
            { id: "snvi-exp-tank1", typeId: "water-tank", name: "120L Water Tank 1", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 3.8, 0.2, leftZ + 0.5], rotation: Math.PI / 2 },
            { id: "snvi-exp-tank2", typeId: "water-tank", name: "120L Water Tank 2", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 4.7, 0.2, leftZ + 0.5], rotation: Math.PI / 2 },
            { id: "snvi-exp-battery", typeId: "battery-bank", name: "Lithium Battery bank", dimensions: [0.5, 0.4, 0.6], layer: 'underbed', defaultY: 0.2, color: "#eab308", solarWattage: 400, weightKg: 35, position: [rearX + 3.8, 0.2, rightZ - 0.5], rotation: 0 },
            { id: "snvi-exp-heater", typeId: "diesel-heater", name: "Diesel Air Heater", dimensions: [0.4, 0.3, 0.3], layer: 'underbed', defaultY: 0.15, color: "#1e293b", weightKg: 5, position: [rearX + 4.7, 0.15, rightZ - 0.5], rotation: 0 },
            
            // Mid-Front (Bathroom & Wardrobe)
            { id: "snvi-exp-wardrobe", typeId: "tall-wardrobe", name: "Tall Wardrobe Closet", dimensions: [0.6, 1.9, 0.6], layer: 'furniture', defaultY: 0.95, color: "#4b5563", weightKg: 25, position: [rearX + 5.7, 0.95, rightZ - 0.4], rotation: 0 },
            { id: "snvi-exp-toilet", typeId: "cassette-toilet", name: "Cassette Toilet", dimensions: [0.7, 0.8, 0.6], layer: 'furniture', defaultY: 0.4, color: "#f3f4f6", weightKg: 15, position: [rearX + 6.2, 0.4, leftZ + 0.4], rotation: Math.PI / 2 },
            { id: "snvi-exp-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.9, 1.9, 0.9], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 7.5, 0.95, leftZ + 0.55], rotation: Math.PI / 2 },
            
            // Front (Kitchen & Living)
            { id: "snvi-exp-kitchen", typeId: "kitchen-galley", name: "Gourmet Kitchen Block", dimensions: [1.6, 0.85, 0.6], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 9.0, 0.425, rightZ - 0.4], rotation: 0 },
            
            // Roof items
            { id: "snvi-exp-solar1", typeId: "solar-array", name: "400W Solar panel 1", dimensions: [1.0, 0.05, 1.5], layer: 'roof', defaultY: 3.25, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 3.5, 3.25, 0], rotation: Math.PI / 2 },
            { id: "snvi-exp-solar2", typeId: "solar-array", name: "400W Solar panel 2", dimensions: [1.0, 0.05, 1.5], layer: 'roof', defaultY: 3.25, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 5.5, 3.25, 0], rotation: Math.PI / 2 },
            { id: "snvi-exp-solar3", typeId: "solar-array", name: "400W Solar panel 3", dimensions: [1.0, 0.05, 1.5], layer: 'roof', defaultY: 3.25, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 7.5, 3.25, 0], rotation: Math.PI / 2 },
            { id: "snvi-exp-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 3.3, color: "#f8fafc", weightKg: 30, position: [rearX + 1.8, 3.3, 0], rotation: Math.PI / 2 }
          ]
        }
      ];
    }
  }

  // 3. Medium Class (Sprinter 144", Transit L3H2, Renault Master L2H2)
  if (activeModelId === 'sprinter-144') {
    return [
      {
        id: "sprinter-couples",
        name: "Sprinter Couples Explorer",
        description: "Classic layout with a fixed rear bed, a small indoor shower/toilet cabin, and a kitchen block along the sliding door.",
        modules: [
          { id: "sp-c-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.4], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 0.7, 0.3, 0], rotation: Math.PI / 2 },
          { id: "sp-c-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.7, 0.2, -0.4], rotation: 0 },
          { id: "sp-c-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.7, 0.15, 0.4], rotation: Math.PI / 2 },
          { id: "sp-c-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.7, 1.9, 0.7], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 1.75, 0.95, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "sp-c-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.55, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "sp-c-solar", typeId: "solar-array", name: "400W Solar Array", dimensions: [1.0, 0.1, 1.5], layer: 'roof', defaultY: 2.35, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "sp-c-locker", typeId: "overhead-locker", name: "Ceiling Storage Locker", dimensions: [1.4, 0.3, 0.4], layer: 'overhead', defaultY: 1.95, color: "#9ca3af", weightKg: 15, position: [rearX + 1.4, 1.95, leftZ + 0.25], rotation: 0 }
        ]
      },
      {
        id: "sprinter-nomad",
        name: "Sprinter Digital Nomad",
        description: "Convertible rear U-shaped lounge that turns into a massive bed, offering a huge daytime workspace.",
        modules: [
          { id: "sp-n-sofa-l", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "sp-n-sofa-r", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, rightZ - 0.4], rotation: -Math.PI / 2 },
          { id: "sp-n-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 0.9, 0.35, 0], rotation: 0 },
          { id: "sp-n-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.25, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "sp-n-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.5, 1.4, 0.5], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 18, position: [rearX + 2.95, 0.7, leftZ + 0.35], rotation: Math.PI / 2 },
          { id: "sp-n-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 2.35, color: "#f8fafc", weightKg: 30, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "sp-n-fan", typeId: "maxxair-fan", name: "Maxxair Roof Vent", dimensions: [0.4, 0.1, 0.4], layer: 'roof', defaultY: 2.35, color: "#1f2937", weightKg: 5, position: [rearX + 2.5, 2.35, 0], rotation: Math.PI / 2 }
        ]
      }
    ];
  }

  if (activeModelId === 'transit-148') {
    return [
      {
        id: "transit-couples",
        name: "Transit Couples Explorer",
        description: "Classic layout with a fixed rear bed, a small indoor shower/toilet cabin, and a kitchen block along the sliding door.",
        modules: [
          { id: "tr-c-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.4], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 0.7, 0.3, 0], rotation: Math.PI / 2 },
          { id: "tr-c-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.7, 0.2, -0.4], rotation: 0 },
          { id: "tr-c-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.7, 0.15, 0.4], rotation: Math.PI / 2 },
          { id: "tr-c-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.7, 1.9, 0.7], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 1.75, 0.95, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "tr-c-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.55, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "tr-c-solar", typeId: "solar-array", name: "400W Solar Array", dimensions: [1.0, 0.1, 1.5], layer: 'roof', defaultY: 2.35, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "tr-c-locker", typeId: "overhead-locker", name: "Ceiling Storage Locker", dimensions: [1.4, 0.3, 0.4], layer: 'overhead', defaultY: 1.95, color: "#9ca3af", weightKg: 15, position: [rearX + 1.4, 1.95, leftZ + 0.25], rotation: 0 }
        ]
      },
      {
        id: "transit-nomad",
        name: "Transit Digital Nomad",
        description: "Convertible rear U-shaped lounge that turns into a massive bed, offering a huge daytime workspace.",
        modules: [
          { id: "tr-n-sofa-l", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "tr-n-sofa-r", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, rightZ - 0.4], rotation: -Math.PI / 2 },
          { id: "tr-n-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 0.9, 0.35, 0], rotation: 0 },
          { id: "tr-n-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.25, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "tr-n-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.5, 1.4, 0.5], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 18, position: [rearX + 2.95, 0.7, leftZ + 0.35], rotation: Math.PI / 2 },
          { id: "tr-n-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 2.35, color: "#f8fafc", weightKg: 30, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "tr-n-fan", typeId: "maxxair-fan", name: "Maxxair Roof Vent", dimensions: [0.4, 0.1, 0.4], layer: 'roof', defaultY: 2.35, color: "#1f2937", weightKg: 5, position: [rearX + 2.5, 2.35, 0], rotation: Math.PI / 2 }
        ]
      }
    ];
  }

  if (activeModelId === 'promaster-136') {
    return [
      {
        id: "master-couples",
        name: "Renault Master Couples Explorer",
        description: "Classic layout with a fixed rear bed, a small indoor shower/toilet cabin, and a kitchen block along the sliding door.",
        modules: [
          { id: "ms-c-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.4], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 0.7, 0.3, 0], rotation: Math.PI / 2 },
          { id: "ms-c-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.7, 0.2, -0.4], rotation: 0 },
          { id: "ms-c-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.7, 0.15, 0.4], rotation: Math.PI / 2 },
          { id: "ms-c-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.7, 1.9, 0.7], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 1.75, 0.95, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "ms-c-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.55, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "ms-c-solar", typeId: "solar-array", name: "400W Solar Array", dimensions: [1.0, 0.1, 1.5], layer: 'roof', defaultY: 2.35, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "ms-c-locker", typeId: "overhead-locker", name: "Ceiling Storage Locker", dimensions: [1.4, 0.3, 0.4], layer: 'overhead', defaultY: 1.95, color: "#9ca3af", weightKg: 15, position: [rearX + 1.4, 1.95, leftZ + 0.25], rotation: 0 }
        ]
      },
      {
        id: "master-nomad",
        name: "Renault Master Digital Nomad",
        description: "Convertible rear U-shaped lounge that turns into a massive bed, offering a huge daytime workspace.",
        modules: [
          { id: "ms-n-sofa-l", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, leftZ + 0.4], rotation: Math.PI / 2 },
          { id: "ms-n-sofa-r", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, rightZ - 0.4], rotation: -Math.PI / 2 },
          { id: "ms-n-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 0.9, 0.35, 0], rotation: 0 },
          { id: "ms-n-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.25, 0.425, leftZ + 0.35], rotation: 0 },
          { id: "ms-n-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.5, 1.4, 0.5], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 18, position: [rearX + 2.95, 0.7, leftZ + 0.35], rotation: Math.PI / 2 },
          { id: "ms-n-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 2.35, color: "#f8fafc", weightKg: 30, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
          { id: "ms-n-fan", typeId: "maxxair-fan", name: "Maxxair Roof Vent", dimensions: [0.4, 0.1, 0.4], layer: 'roof', defaultY: 2.35, color: "#1f2937", weightKg: 5, position: [rearX + 2.5, 2.35, 0], rotation: Math.PI / 2 }
        ]
      }
    ];
  }

  // Fallback for other models (e.g. minibus-canvas)
  return [
    {
      id: "nomad",
      name: "The Nomad",
      description: "Fixed rear bed with a full shower and compact kitchen on a single wall, maximizing open space.",
      modules: [
        { id: "nomad-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.4], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 0.7, 0.3, 0], rotation: Math.PI / 2 },
        { id: "nomad-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.7, 0.2, -0.4], rotation: 0 },
        { id: "nomad-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.7, 0.15, 0.4], rotation: Math.PI / 2 },
        { id: "nomad-shower", typeId: "shower-cabin", name: "Indoor Shower Cabin", dimensions: [0.7, 1.9, 0.7], layer: 'furniture', defaultY: 0.95, color: "#bae6fd", weightKg: 30, position: [rearX + 1.75, 0.95, leftZ + 0.4], rotation: Math.PI / 2 },
        { id: "nomad-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.55, 0.425, leftZ + 0.35], rotation: 0 },
        { id: "nomad-solar", typeId: "solar-array", name: "400W Solar Array", dimensions: [1.0, 0.1, 1.5], layer: 'roof', defaultY: 2.35, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
        { id: "nomad-locker", typeId: "overhead-locker", name: "Ceiling Storage Locker", dimensions: [1.4, 0.3, 0.4], layer: 'overhead', defaultY: 1.95, color: "#9ca3af", weightKg: 15, position: [rearX + 1.4, 1.95, leftZ + 0.25], rotation: 0 }
      ]
    },
    {
      id: "lounge",
      name: "The Lounge",
      description: "Spacious dual facing sofas that convert into a giant bed.",
      modules: [
        { id: "lounge-sofa-l", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, leftZ + 0.4], rotation: Math.PI / 2 },
        { id: "lounge-sofa-r", typeId: "sofa-bed", name: "Folding Sofa Bed", dimensions: [0.6, 0.5, 1.8], layer: 'furniture', defaultY: 0.25, color: "#d97706", weightKg: 35, position: [rearX + 0.9, 0.25, rightZ - 0.4], rotation: -Math.PI / 2 },
        { id: "lounge-table", typeId: "lagun-table", name: "Lagun Swivel Table", dimensions: [0.6, 0.7, 0.4], layer: 'furniture', defaultY: 0.35, color: "#b45309", weightKg: 10, position: [rearX + 0.9, 0.35, 0], rotation: 0 },
        { id: "lounge-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 2.25, 0.425, leftZ + 0.35], rotation: 0 },
        { id: "lounge-fridge", typeId: "upright-fridge", name: "12V Upright Fridge", dimensions: [0.5, 1.4, 0.5], layer: 'furniture', defaultY: 0.7, color: "#d1d5db", weightKg: 18, position: [rearX + 2.95, 0.7, leftZ + 0.35], rotation: Math.PI / 2 },
        { id: "lounge-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 2.35, color: "#f8fafc", weightKg: 30, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
        { id: "lounge-fan", typeId: "maxxair-fan", name: "Maxxair Roof Vent", dimensions: [0.4, 0.1, 0.4], layer: 'roof', defaultY: 2.35, color: "#1f2937", weightKg: 5, position: [rearX + 2.5, 2.35, 0], rotation: Math.PI / 2 }
      ]
    },
    {
      id: "explorer",
      name: "The Explorer",
      description: "Gear-focused layout with a fixed rear bed, a long kitchen block, and a tall wardrobe, leaving massive open floor space.",
      modules: [
        { id: "expl-bed", typeId: "bed-fixed", name: "Fixed Rear Bed", dimensions: [1.9, 0.6, 1.4], layer: 'furniture', defaultY: 0.3, color: "#d97706", weightKg: 40, position: [rearX + 0.7, 0.3, 0], rotation: Math.PI / 2 },
        { id: "expl-tank", typeId: "water-tank", name: "120L Water Tank", dimensions: [0.6, 0.4, 0.8], layer: 'underbed', defaultY: 0.2, color: "#0ea5e9", waterLiters: 120, weightKg: 130, position: [rearX + 0.7, 0.2, -0.4], rotation: 0 },
        { id: "expl-battery", typeId: "battery-bank", name: "Lithium Battery Bank", dimensions: [0.4, 0.3, 0.5], layer: 'underbed', defaultY: 0.15, color: "#eab308", solarWattage: 200, weightKg: 25, position: [rearX + 0.7, 0.15, 0.4], rotation: Math.PI / 2 },
        { id: "expl-kitchen", typeId: "kitchen-galley", name: "Compact Kitchen Block", dimensions: [0.9, 0.85, 0.45], layer: 'furniture', defaultY: 0.425, color: "#9ca3af", weightKg: 35, position: [rearX + 1.85, 0.425, leftZ + 0.35], rotation: 0 },
        { id: "expl-wardrobe", typeId: "tall-wardrobe", name: "Tall Wardrobe Closet", dimensions: [0.5, 1.9, 0.45], layer: 'furniture', defaultY: 0.95, color: "#4b5563", weightKg: 25, position: [rearX + 2.55, 0.95, leftZ + 0.35], rotation: 0 },
        { id: "expl-ac", typeId: "roof-ac", name: "Roof AC Unit", dimensions: [0.7, 0.2, 0.7], layer: 'roof', defaultY: 2.35, color: "#f8fafc", weightKg: 30, position: [rearX + 1.5, 2.35, 0], rotation: Math.PI / 2 },
        { id: "expl-solar", typeId: "solar-array", name: "400W Solar Array", dimensions: [1.0, 0.1, 1.5], layer: 'roof', defaultY: 2.35, color: "#374151", solarWattage: 400, weightKg: 20, position: [rearX + 2.5, 2.35, 0], rotation: Math.PI / 2 }
      ]
    }
  ];
};
