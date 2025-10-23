import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mainRouter from "./src/routes/index.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api',mainRouter)

app.get("/", (req, res) => {
  res.send("✅ Server is running fine!");
});

export default app;
