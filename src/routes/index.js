import express from "express";
import dynamicdbCreationRoutes from "./dynamicdbCreation/dynamicdbCreationRoutes.js";
import { pipelineRouter } from "./pipeline/pipeline.model.js";

const mainRouter = express.Router();

mainRouter.use('/crm',dynamicdbCreationRoutes);
mainRouter.use('/crm',pipelineRouter);


export default mainRouter;