'use strict';

const Hapi = require('@hapi/hapi');
const mongoose = require('mongoose');
require('dotenv').config();

const bookRoutes = require('./routes/books');
const userRoutes = require('./routes/users');

const connectDB = async (uri) => {
  const mongoUri = uri || `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_CLUSTER}/${process.env.DB_NAME}?retryWrites=true&w=majority`;
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

const createServer = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
        headers: ['Accept', 'Content-Type', 'Authorization'],
      },
    },
  });

  server.route([
    ...bookRoutes,
    ...userRoutes,
  ]);

  return server;
};

if (require.main === module) {
  (async () => {
    try {
      await connectDB();
      const server = await createServer();
      await server.start();
      console.log(`Server running on ${server.info.uri}`);
    } catch (err) {
      console.error(err);
      process.exit(1);
    }
  })();
}

module.exports = { createServer, connectDB };
