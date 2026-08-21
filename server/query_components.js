require('dotenv').config();
const mongoose = require('mongoose');
const Component = require('./src/models/Component');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB!');
    
    const locker = await Component.findOne({ id: 'overhead-locker' });
    if (locker) {
      console.log('Locker component:');
      console.log('- ID:', locker.id);
      console.log('- Layer:', locker.layer);
      console.log('- PlacementX:', locker.placementX);
    } else {
      console.log('Locker component NOT found!');
    }

    const awning = await Component.findOne({ id: 'side-awning' });
    if (awning) {
      console.log('Awning component:');
      console.log('- ID:', awning.id);
      console.log('- Layer:', awning.layer);
      console.log('- PlacementX:', awning.placementX);
    } else {
      console.log('Awning component NOT found!');
    }
    
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

run();
