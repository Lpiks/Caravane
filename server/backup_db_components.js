require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Component = require('./src/models/Component');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB!');
    
    const dbComponents = await Component.find().lean();
    console.log(`Fetched ${dbComponents.length} components from MongoDB.`);
    
    // Clean up Mongoose internal fields (_id, __v, createdAt, updatedAt)
    const cleaned = dbComponents.map(c => {
      const { _id, __v, createdAt, updatedAt, ...rest } = c;
      if (rest.parts) {
        rest.parts = rest.parts.map(p => {
          const { _id, ...pRest } = p;
          return pRest;
        });
      }
      return rest;
    });

    const outputPath = path.join(__dirname, '../client/src/data/baseComponents.json');
    fs.writeFileSync(outputPath, JSON.stringify(cleaned, null, 2), 'utf8');
    console.log(`Successfully backed up components to ${outputPath}`);
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
