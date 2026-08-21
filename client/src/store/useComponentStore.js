import { create } from 'zustand';
import axios from 'axios';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const useComponentStore = create((set, get) => ({
  components: [],
  isLoading: false,
  isLoaded: false,
  error: null,

  // Fetch all components from the backend
  fetchComponents: async (force = false) => {
    // Return cached components if already loaded, unless forced
    if (get().isLoaded && !force) return get().components;

    set({ isLoading: true, error: null });
    try {
      // Assuming backend runs on 5000 or proxy is configured
      const response = await axios.get(`${API_BASE}/api/components`);
      set({ 
        components: response.data, 
        isLoading: false, 
        isLoaded: true 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching components:', error);
      set({ 
        error: error.message || 'Failed to fetch components', 
        isLoading: false 
      });
      return [];
    }
  },

  // Update a single component in the local cache
  updateComponentInCache: (updatedComponent) => {
    set((state) => {
      const index = state.components.findIndex(c => c.id === updatedComponent.id);
      if (index !== -1) {
        const newComponents = [...state.components];
        newComponents[index] = updatedComponent;
        return { components: newComponents };
      } else {
        return { components: [...state.components, updatedComponent] };
      }
    });
  },

  // Delete a component from the local cache
  removeComponentFromCache: (id) => {
    set((state) => ({
      components: state.components.filter(c => c.id !== id)
    }));
  }
}));

export default useComponentStore;
