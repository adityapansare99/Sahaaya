import app from "./app.js";
import connectdb from "./db/index.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env"
});

const PORT = 8000 || process.env.PORT;

connectdb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log("Failed to connect to database", err);
  });
