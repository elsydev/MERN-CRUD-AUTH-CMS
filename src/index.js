import app from "./app.js";
import conectarDB from "./db.js";
import dotenv from "dotenv";

dotenv.config();

app.listen(3000);

console.log("Server listening on port 3000");

conectarDB();
