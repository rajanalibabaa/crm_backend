import { getPipelineModel } from "../../models/pipeline/pipeline.model.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
import uuid from "../../utils/uuid.js"

export const createPipeline = async (req, res) => {
  try {
    const { pipelineName, data ,dbname} = req.body;

    console.log("Creating pipeline in DB:", dbname);

    const PipelineCollection = await getPipelineModel(dbname);

    if (!pipelineName || !data) {
      return res.json(new ApiResponse(400, null, "pipelineName and data are required"));
    }

    const existing = await PipelineCollection.findOne({ pipelineName });
    if (existing) {
      return res.json(new ApiResponse(409, null, "Pipeline already exists"));
    }

    const generateuuid = uuid()

    const newPipeline = await PipelineCollection.create({ pipelineName, data ,uuid:generateuuid });
    return res.json(new ApiResponse(201, newPipeline, "Pipeline created successfully"));
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to create pipeline"));
  }
};

export const getAllPipeline = async (req, res) => {
  try {
    const dbname = req.query?.dbname
    console.log("Fetching all pipelines from DB:", dbname);
    const PipelineCollection = await getPipelineModel(dbname);

    
    const alldata = await PipelineCollection.find({});
    console.log(alldata.length)
    if (!alldata || alldata.length === 0) {
      return res.json(new ApiResponse(409, null, "Pipeline does not creted yet"));
    }

    return res.json(new ApiResponse(200, alldata, "Pipeline created successfully"));
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to create pipeline"));
  }
};

export const getByPipelineId = async (req, res) => {
  try {
    const id = req.params?.id
    const dbname = req.query?.dbname
    const PipelineCollection = await getPipelineModel(dbname);

    if (!id) {
      return res.json(new ApiResponse(400, null, "Pipeline ID is required"));
    }
    
    const alldata = await PipelineCollection.findOne({uuid:id});
    if (!alldata || alldata.length === 0) {
      return res.json(new ApiResponse(409, null, "Pipeline does not exists"));
    }

    return res.json(new ApiResponse(200, alldata, "Pipeline created successfully"));
  } catch (error) {
    console.error("Error creating pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to create pipeline"));
  }
};

export const deletePipeline = async (req, res) => {
  try {
    const id = req.params?.id;
    const dbname = req.query?.dbname
    const PipelineCollection = await getPipelineModel(dbname);

    if (!id) {
      return res.json(new ApiResponse(400, null, "Pipeline ID is required"));
    }

    const pipeline = await PipelineCollection.findOne({ uuid: id });

    if (!pipeline) {
      return res.json(new ApiResponse(404, null, "Pipeline does not exist"));
    }

    await PipelineCollection.deleteOne({ uuid: id });

    return res.json(new ApiResponse(200, pipeline, "Pipeline deleted successfully"));
  } catch (error) {
    console.error("Error deleting pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to delete pipeline"));
  }
};

export const updatePipelineId = async (req, res) => {
  try {
    const id = req.params?.id; 
    const { addStages } = req.body; 
    const dbname = req.query?.dbname
    const PipelineCollection = await getPipelineModel(dbname);


    // console.log(addStages)

    if (!id) {
      return res.json(new ApiResponse(400, null, "Pipeline ID is required"));
    }

    if (!Array.isArray(addStages) || addStages.length === 0) {
      return res.json(new ApiResponse(400, null, "addStages array is required"));
    }

    
    const pipeline = await PipelineCollection.findOne({ uuid: id });
    if (!pipeline) {
      return res.json(new ApiResponse(404, null, "Pipeline does not exist"));
    }

    let newdata = pipeline.data

     addStages.forEach(({ insertIndex, stage }, i) => {
      
        console.log(insertIndex,stage,pipeline)
                console.log("=======================")

    });

    

    // addStages.forEach(({ insertIndex, stage }, i) => {
    //   const index = typeof insertIndex === "number" ? insertIndex + i : pipeline.data.length;
    //   pipeline.data.splice(index, 0, stage);
    // });

    // await pipeline.save();

    return res.json(
      new ApiResponse(200, pipeline, "Multiple stages inserted successfully")
    );
  } catch (error) {
    console.error("Error updating pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to update pipeline"));
  }
};