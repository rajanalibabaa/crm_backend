import { Router } from "express";
import { createPipeline, deletePipeline, getAllPipeline, getByPipelineId, updatePipelineId } from "../../controllers/pipeline/pipeline.controler.js";
export const pipelineRouter = Router()

pipelineRouter.post("/v1/createPipeline",createPipeline)
pipelineRouter.get("/v1/getallpipeline",getAllPipeline)
pipelineRouter.get("/v1/getbypipelineid/:id",getByPipelineId)
pipelineRouter.delete("/v1/deletepipeline/:id",deletePipeline)
pipelineRouter.patch("/v1/updatepipelineid/:id",updatePipelineId)