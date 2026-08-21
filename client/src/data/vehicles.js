import baseChassis from './baseChassis.json';

export const vehicleClasses = [
  {
    id: 'compact-classic',
    name: 'Compact Class',
    description: 'Perfect for weekend getaways and agile driving.',
    imagePlaceholder: '🚐',
    models: baseChassis
      .filter(c => c.class === 'compact-classic')
      .map(c => ({
        id: c.id,
        name: c.name,
        details: c.details || '',
        specs: c.specs || {}
      }))
  },
  {
    id: 'standard-highroof',
    name: 'Standard Class',
    description: 'The golden mean for full-time vanlife and comfort.',
    imagePlaceholder: '🚐',
    models: baseChassis
      .filter(c => c.class === 'standard-highroof')
      .map(c => ({
        id: c.id,
        name: c.name,
        details: c.details || '',
        specs: c.specs || {}
      }))
  },
  {
    id: 'minibus-canvas',
    name: 'Maxi Class',
    description: 'Maximum space for large families or luxury builds.',
    imagePlaceholder: '🚌',
    models: baseChassis
      .filter(c => c.class === 'minibus-canvas')
      .map(c => ({
        id: c.id,
        name: c.name,
        details: c.details || '',
        specs: c.specs || {}
      }))
  }
];

export const getVehicleModelById = (modelId) => {
  for (const vClass of vehicleClasses) {
    const model = vClass.models.find(m => m.id === modelId);
    if (model) return { class: vClass, model };
  }
  return null;
};
