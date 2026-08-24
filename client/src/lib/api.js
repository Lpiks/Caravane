const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;

export const fetchVehicles = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    
    // We pass any extra filters back to the DB. 
    // For price and sleeps, since price is a string, we'll fetch all matching type 
    // and filter the rest on the frontend if needed, but passing them to backend is fine too.
    
    const res = await fetch(`${API_URL}/vehicles?${params.toString()}`, { 
      cache: 'no-store',
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (!res.ok) {
      throw new Error('Failed to fetch vehicles');
    }
    
    let vehicles = await res.json();
    
    // Frontend filtering for advanced filters
    if (filters.sleeps) {
      vehicles = vehicles.filter(v => (v.specs?.sleeps || 0) >= filters.sleeps);
    }
    if (filters.chassis) {
      vehicles = vehicles.filter(v => v.chassis?.toLowerCase().includes(filters.chassis.toLowerCase()));
    }
    
    return vehicles;
  } catch (err) {
    console.error('API Error:', err);
    return [];
  }
};

export const submitInquiry = async (formData) => {
  try {
    const res = await fetch(`${API_URL}/inquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('Backend Error Response:', errorData);
      throw new Error(errorData.message || 'Failed to submit inquiry');
    }
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
};
