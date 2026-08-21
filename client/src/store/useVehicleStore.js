import { create } from 'zustand';

const useVehicleStore = create((set) => ({
  selectedVehicle: 'vw-t3',
  headlightsOn: false,
  ambientEnvironment: 'sahara-sunset',
  
  setVehicle: (id) => set({ selectedVehicle: id }),
  toggleHeadlights: () => set((state) => ({ headlightsOn: !state.headlightsOn })),
  setEnvironment: (env) => set({ ambientEnvironment: env })
}));

export default useVehicleStore;
