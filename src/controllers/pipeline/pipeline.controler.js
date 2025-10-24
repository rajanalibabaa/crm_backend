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
    const { addStages, deleteStages, updateStagesName, deleteTag } = req.body;
    const dbname = req.query?.dbname;


    if (!id) {
      return res.json(new ApiResponse(400, null, "Pipeline ID is required"));
    }

    const PipelineCollection = await getPipelineModel(dbname);
    const pipeline = await PipelineCollection.findOne({ uuid: id });

    if (!pipeline) {
      return res.json(new ApiResponse(404, null, "Pipeline does not exist"));
    }

    async function addStagesFunction(pipeline) {
      let newdata = pipeline?.data || [];

      addStages.forEach(({ insertIndex, data }) => {
        if (typeof insertIndex === "number" && data) {
          const safeIndex = Math.min(Math.max(insertIndex, 0), newdata.length);
          newdata.splice(safeIndex, 0, data);
        }
      });

      pipeline.data = newdata;
      await pipeline.save();

      return pipeline;
    }

    async function deleteStagesFunction(pipeline) {
      let newdata = pipeline.data || [];

      const deleteIndexes = Array.isArray(deleteStages)
        ? deleteStages.map((i) => Number(i))
        : [Number(deleteStages)];

      newdata = newdata.filter((_, index) => !deleteIndexes.includes(index));

      pipeline.data = newdata;
      await pipeline.save();

      return pipeline;
    }

    async function updateStagesNameFunction(pipeline) {
      let newdata = pipeline?.data || [];
      

      // console.log("newdata",newdata[updateStagesName?.insertIndex])
      const index = updateStagesName?.insertIndex;
      const tagIndex = updateStagesName.data?.updateTagName?.insertIndex
    //   if (newdata[index]) {

    //     if (updateStagesName.data?.Stage !== "") {
    //       newdata[index] = {
    //         ...newdata[index],
    //         ...updateStagesName.data.Stage,
    //       };
    //     }
      
      
    // }

      if (updateStagesName.data?.Stage && newdata[index].Stage !== undefined ) {
        newdata[index].Stage = updateStagesName.data.Stage;
      }
      if (
        updateStagesName.data?.updateTagName &&
        Array.isArray(newdata[index].tags) &&
        newdata[index].tags[tagIndex] !== undefined
      ) {
        newdata[index].tags[tagIndex] = updateStagesName.data.updateTagName.tag;
      }
      

      if (updateStagesName.data?.tags && Array.isArray(newdata[index].tags)) {
        newdata[index].tags.push(...updateStagesName.data.tags);
      }
    // console.log("newdata ",newdata)
      pipeline.data = newdata;
      await pipeline.save();

      return pipeline;
    }

    async function deleteTagFunction(pipeline) {
      let newdata = pipeline.data || [];

      const stageIndex = deleteTag?.Stage;
      const tagIndex = deleteTag?.tag;

      if (
        newdata[stageIndex] &&
        Array.isArray(newdata[stageIndex].tags) &&
        newdata[stageIndex].tags[tagIndex] !== undefined
      ) {

        // console.log("newdata[stageIndex].tags :",newdata[stageIndex].tags)
        
        newdata[stageIndex].tags = newdata[stageIndex].tags.filter(
          (_, i) => i !== tagIndex
        );

      }

      pipeline.data = newdata;
      await pipeline.save(); 

      return pipeline;
    }


    if (addStages && addStages.length > 0) {
      const updatedPipeline = await addStagesFunction(pipeline);
      return res.json(
        new ApiResponse(200, updatedPipeline, "Multiple stages inserted successfully")
      );
    }

    if (deleteTag) {
      const updatedPipeline = await deleteTagFunction(pipeline);
      return res.json(
        new ApiResponse(200, updatedPipeline, "Multiple stages deleted successfully")
      );
    }

    if (deleteStages) {
      const updatedPipeline = await deleteStagesFunction(pipeline);
      return res.json(
        new ApiResponse(200, updatedPipeline, "Multiple stages deleted successfully")
      );
    }
    
    if (updateStagesName) {
      const updatedPipeline = await updateStagesNameFunction(pipeline);
      return res.json(
        new ApiResponse(200, updatedPipeline, "Multiple stages deleted successfully")
      );
    }

    return res.json(new ApiResponse(400, null, "No valid action provided"));

  } catch (error) {
    console.error("Error updating pipeline:", error);
    return res.json(new ApiResponse(500, null, "Failed to update pipeline"));
  }
};


