import app from "./app.js";
import connectdb from "./db/index.js";
import dotenv from "dotenv";
import {createServer} from "http";
import { initializeSocket } from "./socket.js";

dotenv.config({
  path: "./.env"
});

const PORT = 8000 || process.env.PORT;

const server = createServer(app);
initializeSocket(server);

connectdb()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
