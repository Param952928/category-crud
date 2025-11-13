import mongoose from 'mongoose';

export async function connectDB(uri: string) {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(uri);
  mongoose.set('strictQuery', true);
  console.log('MongoDB connected');
}

export async function disconnectDB() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
