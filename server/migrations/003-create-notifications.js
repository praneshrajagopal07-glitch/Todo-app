const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  await db.collection('notifications').createIndex({ userId: 1 });
  await db.collection('notifications').createIndex({ isRead: 1 });
  console.log('Notifications indexes created');
  await mongoose.disconnect();
};
run().catch(console.error);
