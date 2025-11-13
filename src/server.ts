import { config } from 'dotenv';
config();
import app from './app.js';
import { connectDB } from './db/mongoose.js';

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

async function bootstrap() {
  await connectDB(process.env.MONGO_URI || 'mongodb://localhost:27017/anglara');
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

bootstrap().catch((err) => {
  console.error('Failed to start server', err);
  process.exit(1);
});
