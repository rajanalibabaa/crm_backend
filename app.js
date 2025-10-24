import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import mainRouter from "./src/routes/index.js";
// import { companyRegistrationRouter } from "./router/company/company.registration.model.js";
// import { pipelineRouter } from "./router/pipeline/pipeline.router.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/api',mainRouter)
// app.use(companyRegistrationRouter)
// app.use(pipelineRouter)

app.get("/", (req, res) => {
  res.send("✅ Server is running fine port new5050!");
});

export default app;
