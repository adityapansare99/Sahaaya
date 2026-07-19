import app from "./app.js";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
import {createServer} from "http";
import { initializeSocket } from "./socket.js";
import startExpiryCleanup from "./utils/expiryCleanup.js";

dotenv.config({
  path: "./.env"
});

const PORT = process.env.PORT || 8000;

const server = createServer(app);
initializeSocket(server);

connectdb()
  .then(() => {
    startExpiryCleanup();
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
