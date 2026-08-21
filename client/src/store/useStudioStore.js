import { create } from 'zustand';
import useChassisStore from './useChassisStore';
import useComponentStore from './useComponentStore';

const useStudioStore = create((set, get) => ({
  activeChassis: 'standard-highroof',
  activeModelId: null,
  hasChosenVehicle: false,
  driveSide: 'LHD', // LHD (Europe) or RHD (UK)
  placedModules: [],
  activeModuleId: null,

  setDriveSide: (side) => set((state) => {
    if (state.driveSide === side) return {};

    return {
      driveSide: side,
      placedModules: state.placedModules.map(mod => {
        // Now that the chassis rotation is fixed, width is ALWAYS the Z-axis.
        const position = [mod.position[0], mod.position[1], -mod.position[2]];
        return {
          ...mod,
          position,
          rotation: -mod.rotation || 0
        };
      })
    };
  }),
  setActiveModule: (id) => set({ activeModuleId: id }),

  // Visibility Toggles
  showRoof: true,
  showOverhead: true,
  showUnderbed: true,
  ghostBedTop: false,

  setVehicle: (chassisId, modelId) => set({
    activeChassis: chassisId,
    activeModelId: modelId,
    hasChosenVehicle: true,
    placedModules: []
  }),

  setHasChosenVehicle: (value) => set({ hasChosenVehicle: value }),

  setChassis: (chassisId) => set({
    activeChassis: chassisId,
    placedModules: []
  }),

  toggleLayerVisibility: (layerKey) => set((state) => ({
    [layerKey]: !state[layerKey]
  })),

  addModule3D: (moduleData) => set((state) => {
    // 1. Get active van's height and width dynamically from the chassis store
    const activeModelId = state.activeModelId;
    const chassisList = useChassisStore.getState().chassis || [];
    const activeVan = chassisList.find(c => c.id === activeModelId);
    const vanHeight = activeVan ? (activeVan.defaultH / 100) : 2.0; // fallback to 2.0m
    const vanWidth = activeVan ? (activeVan.defaultW / 100) : 1.8;   // fallback to 1.8m

    // 2. Determine default Y coordinate based on component layer metadata
    let placementY = moduleData.defaultY || 0;
    const compHeight = moduleData.dimensions?.[1] || 0.20;

    if (moduleData.layer === 'overhead') {
      // Placement under the roof
      placementY = vanHeight - (compHeight / 2);
    } else if (moduleData.layer === 'roof') {
      // Placement on top of the roof
      placementY = vanHeight + (compHeight / 2);
    }

    // 3. Determine default X coordinate based on component placementX metadata
    let placementX = 0;
    if (moduleData.placementX === 'door-side') {
      const sideMultiplier = state.driveSide === 'LHD' ? 1 : -1;
      placementX = (vanWidth / 2) * sideMultiplier;
    } else if (moduleData.placementX === 'driver-side') {
      const sideMultiplier = state.driveSide === 'LHD' ? -1 : 1;
      placementX = (vanWidth / 2) * sideMultiplier;
    }

    const isMaxiBus = state.activeChassis === 'maxi-bus';
    const position = isMaxiBus
      ? [0, placementY, placementX] // Sideways offset is Z, lengthwise is X
      : [placementX, placementY, 0]; // Sideways offset is X, lengthwise is Z

    const newModule = {
      ...moduleData,
      id: `${moduleData.typeId}-${Date.now()}`,
      position,
      rotation: isMaxiBus ? Math.PI / 2 : 0, // Default rotation faces wall for bus
      color: undefined // Start with database default colors, do not inherit sidebar dot color
    };
    return { placedModules: [...state.placedModules, newModule] };
  }),

  updateModulePosition: (id, newPosition) => set((state) => ({
    placedModules: state.placedModules.map(mod =>
      mod.id === id ? { ...mod, position: newPosition } : mod
    )
  })),

  updateModuleColor: (id, newColor) => set((state) => ({
    placedModules: state.placedModules.map(mod =>
      mod.id === id ? { ...mod, color: newColor } : mod
    )
  })),

  rotateModule: (id) => set((state) => ({
    placedModules: state.placedModules.map(mod => {
      if (mod.id === id) {
        const currentRotation = mod.rotation || 0;
        return { ...mod, rotation: (currentRotation + Math.PI / 2) % (Math.PI * 2) };
      }
      return mod;
    })
  })),

  removeModule: (id) => set((state) => ({
    placedModules: state.placedModules.filter(mod => mod.id !== id),
    activeModuleId: state.activeModuleId === id ? null : state.activeModuleId
  })),

  clearStudio: () => set({ placedModules: [], activeModuleId: null }),

  loadTemplate: (modules) => set((state) => {
    const dbComponents = useComponentStore.getState().components || [];

    const processedModules = modules.map(tplMod => {
      const dbComp = dbComponents.find(c => c.id === tplMod.typeId);
      
      if (!dbComp) {
        return {
          ...tplMod,
          id: `${tplMod.typeId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
        };
      }

      // Calculate dimensions from DB component including chassis overrides
      const override = dbComp.chassisOverrides?.[state.activeChassis] || {};
      const l = (override.l || dbComp.defaultL || 100) / 100;
      const w = (override.w || dbComp.defaultW || 100) / 100;
      const h = (override.h || dbComp.defaultH || 100) / 100;

      // Find majority color of parts or default
      let partColor = "#4b5563";
      if (dbComp.parts && dbComp.parts.length > 0) {
        const colorCounts = {};
        dbComp.parts.forEach(p => {
          if (p.color) colorCounts[p.color] = (colorCounts[p.color] || 0) + 1;
        });
        let maxColor = null;
        let maxCount = 0;
        dbComp.parts.forEach(p => {
          if (p.color) {
            const count = colorCounts[p.color];
            if (count > maxCount) {
              maxCount = count;
              maxColor = p.color;
            }
          }
        });
        partColor = maxColor || dbComp.parts[0].color || "#4b5563";
      }
      const finalColor = dbComp.color || partColor;

      // Merge database specs and parts array for absolute fidelity
      return {
        ...tplMod,
        id: `${tplMod.typeId}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name: dbComp.name,
        category: dbComp.category,
        dimensions: [l, h, w],
        layer: dbComp.layer || 'furniture',
        defaultY: h / 2,
        color: tplMod.color || finalColor,
        weightKg: dbComp.weightKg || 20,
        parts: dbComp.parts,
        defaultL: dbComp.defaultL,
        defaultW: dbComp.defaultW,
        defaultH: dbComp.defaultH,
        chassisOverrides: dbComp.chassisOverrides,
        states: dbComp.states || ['default'],
        position: tplMod.position,
        rotation: tplMod.rotation || 0,
        isBedMode: tplMod.isBedMode || false,
        isOpen: tplMod.isOpen || false,
        waterLiters: dbComp.waterLiters || tplMod.waterLiters,
        solarWattage: dbComp.solarWattage || tplMod.solarWattage,
        batteryAh: dbComp.batteryAh || tplMod.batteryAh,
        sleepCapacity: dbComp.sleepCapacity || tplMod.sleepCapacity,
        seatCapacity: dbComp.seatCapacity || tplMod.seatCapacity
      };
    });

    return { placedModules: processedModules, activeModuleId: null };
  }),

  toggleModuleState: (id, key) => set((state) => ({
    placedModules: state.placedModules.map(mod =>
      mod.id === id ? { ...mod, [key]: !mod[key] } : mod
    )
  })),

  getTotals: () => {
    const { placedModules } = get();
    const totals = placedModules.reduce((acc, mod) => {
      acc.solar += (mod.solarWattage || 0);
      acc.water += (mod.waterLiters || 0);
      acc.weight += (mod.weightKg || 0);
      acc.battery += (mod.batteryAh || 0);
      acc.sleeps += (mod.sleepCapacity || 0);
      acc.seats += (mod.seatCapacity || 0);

      // If any component has winterization/insulation rating, track it
      if (mod.isWinterized) acc.isWinterized = true;

      return acc;
    }, { solar: 0, water: 0, weight: 0, battery: 0, sleeps: 0, seats: 0, isWinterized: false });

    // Grey water is typically 60% of fresh water capacity
    totals.greyWater = Math.round(totals.water * 0.6);

    // Winterization string
    totals.winterizationLevel = totals.isWinterized ? "4-Season" : "3-Season";

    // Build Complexity Score Calculation
    // Base is Low. >3 modules is Medium. >8 modules OR plumbing + electrical + >5 modules is Advanced.
    let complexity = "Low";
    const modCount = placedModules.length;
    const hasPlumbing = totals.water > 0;
    const hasElectrical = totals.solar > 0 || totals.battery > 0;

    if (modCount > 3) complexity = "Medium";
    if (modCount >= 8 || (hasPlumbing && hasElectrical && modCount > 5)) {
      complexity = "Advanced";
    }

    totals.complexity = complexity;

    return totals;
  }
}));

export default useStudioStore;
