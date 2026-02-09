import dotenv from 'dotenv';
import { MongoConnection } from './infrastructure/persistence/mongodb/connection/MongoConnection';
import { createApp } from './infrastructure/api/app';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/transport-db';

async function main() {
  try {
    // Connect to MongoDB
    const mongoConnection = MongoConnection.getInstance();
    await mongoConnection.connect(MONGODB_URI, 'transport-db');

    // Create and start Express app
    const app = createApp();
    
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🚗 API Conductores: http://localhost:${PORT}/api/conductores`);
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n⏳ Cerrando servidor...');
      await mongoConnection.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

main();
