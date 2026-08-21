require('dotenv').config();
const mongoose = require('mongoose');
const Template = require('../src/models/Template');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/kouini-caravane';

async function migrate() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB at:', MONGODB_URI.split('@')[1] || MONGODB_URI);

    // Dynamically import the exact ES module file from your frontend
    const moduleUrl = 'file://' + path.resolve(__dirname, '../../client/src/data/templates.js').replace(/\\/g, '/');
    const { getStudioTemplates } = await import(moduleUrl);

    // Extract all templates by passing the different chassis/model combinations
    const templates = [
      ...getStudioTemplates('compact-classic', 'vw-t3').map(t => ({ ...t, chassisId: 'vw-t3' })),
      ...getStudioTemplates('maxi-bus', 'uk-double-decker').map(t => ({ ...t, chassisId: 'uk-double-decker' })),
      ...getStudioTemplates('maxi-bus', 'snvi-100-v8').map(t => ({ ...t, chassisId: 'snvi-100-v8' })),
      ...getStudioTemplates('standard-highroof', 'sprinter-144').map(t => ({ ...t, chassisId: 'sprinter-144' })),
      ...getStudioTemplates('standard-highroof', 'transit-148').map(t => ({ ...t, chassisId: 'transit-148' })),
      ...getStudioTemplates('standard-highroof', 'promaster-136').map(t => ({ ...t, chassisId: 'promaster-136' })),
      ...getStudioTemplates('unknown', 'unknown').map(t => ({ ...t, chassisId: 'unknown' }))
    ];

    console.log(`Successfully extracted ${templates.length} templates directly from client/src/data/templates.js`);

    const formattedTemplates = templates.map(t => ({
      name: t.name,
      description: t.description,
      chassisId: t.chassisId,
      modules: t.modules
    }));

    await Template.insertMany(formattedTemplates);
    console.log('Successfully inserted all templates into DB!');

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    mongoose.connection.close();
  }
}

migrate();
