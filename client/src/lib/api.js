const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const FALLBACK_VEHICLES = [
  {
    _id: '1',
    title: 'Atlas Explorer',
    chassis: 'Mercedes Sprinter 4x4',
    type: 'sale',
    price: '$125,000',
    image: 'https://images.unsplash.com/photo-1523987355523-c7b5b0dd90a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specs: { solarWatts: 600, waterLiters: 150, sleeps: 2, transmission: 'Automatic' }
  },
  {
    _id: '2',
    title: 'Sahara Nomad',
    chassis: 'VW Crafter AWD',
    type: 'rental',
    price: '$250/day',
    image: 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specs: { solarWatts: 400, waterLiters: 100, sleeps: 4, transmission: 'Manual' }
  },
  {
    _id: '3',
    title: 'Dune Cruiser',
    chassis: 'Toyota Land Cruiser 79',
    type: 'sale',
    price: '$85,000',
    image: 'https://images.unsplash.com/photo-1533558701576-23c65e0272fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specs: { solarWatts: 300, waterLiters: 80, sleeps: 2, transmission: 'Manual' }
  },
  {
    _id: '4',
    title: 'Oasis Basecamp',
    chassis: 'Renault Master High-Roof',
    type: 'rental',
    price: '$180/day',
    image: 'https://images.unsplash.com/photo-1513689125086-6c432170e843?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    specs: { solarWatts: 500, waterLiters: 120, sleeps: 3, transmission: 'Automatic' }
  }
];

export const fetchVehicles = async (type = '') => {
  // Simulate network delay for realistic loading state
  await new Promise(resolve => setTimeout(resolve, 500));
  return FALLBACK_VEHICLES.filter(v => type ? v.type === type : true);
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
    if (!res.ok) throw new Error('Failed to submit inquiry');
    return await res.json();
  } catch (err) {
    console.error('API Error:', err);
    throw err;
  }
};
