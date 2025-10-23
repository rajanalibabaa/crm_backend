import express from "express";
import dynamicdbCreationRoutes from "./dynamicdbCreation/dynamicdbCreationRoutes.js";

const mainRouter = express.Router();

mainRouter.use('/crm',dynamicdbCreationRoutes);

export default mainRouter;