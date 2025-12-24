import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

// Setup before all tests
export const setupTestDatabase = async () => {
  // Use TEST_MONGODB_URI if provided (Docker), otherwise use in-memory server (local)
  const testMongoUri = process.env.TEST_MONGODB_URI;

  if (testMongoUri) {
    // Connect to external MongoDB (Docker)
    await mongoose.connect(testMongoUri);
  } else {
    // Use in-memory MongoDB for local development
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  }
};

// Cleanup after all tests
export const teardownTestDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

// Clear database between tests
export const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
};
