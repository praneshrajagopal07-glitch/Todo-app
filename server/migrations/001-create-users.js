// Migration: Create Users collection indexes
const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  await db.collection('users').createIndex({ email: 1 }, { unique: true });
  await db.collection('users').createIndex({ firebaseUid: 1 });
  console.log('Users indexes created');
  await mongoose.disconnect();
};
run().catch(console.error);
