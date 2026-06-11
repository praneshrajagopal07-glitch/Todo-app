const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '../.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  const existing = await db.collection('users').findOne({ email: 'admin@todoapp.com' });
  if (!existing) {
    const hashed = await bcrypt.hash('Admin@123', 10);
    await db.collection('users').insertOne({
      name: 'Admin', email: 'admin@todoapp.com',
      password: hashed, provider: 'local',
      profileImage: '', theme: 'light',
      createdAt: new Date(),
    });
    console.log('Admin user seeded: admin@todoapp.com / Admin@123');
  } else {
    console.log('Admin already exists');
  }
  await mongoose.disconnect();
};
run().catch(console.error);
