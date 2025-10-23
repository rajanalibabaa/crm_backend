import express from "express";
import { registerCompany} from "../../controllers/dynamicdbCreation/dynamicdbCreationControllers.js";
import { loginCompanyUser } from "../../controllers/dynamicdbCreation/dynamicdbCreationLogin.js";

const dynamicdbCreationRoutes = express.Router();

dynamicdbCreationRoutes.post("/register-company", registerCompany);
dynamicdbCreationRoutes.post("/login", loginCompanyUser);

export default dynamicdbCreationRoutes;
