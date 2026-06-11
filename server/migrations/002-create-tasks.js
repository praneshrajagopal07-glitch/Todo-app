const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;
  await db.collection('tasks').createIndex({ userId: 1 });
  await db.collection('tasks').createIndex({ status: 1 });
  await db.collection('tasks').createIndex({ dueDate: 1 });
  console.log('Tasks indexes created');
  await mongoose.disconnect();
};
run().catch(console.error);
