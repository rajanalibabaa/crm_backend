import mongoose from "mongoose";
import { getDBConnection } from "../../middleware/db.connection.js";

const stageSchema = new mongoose.Schema(
  {
    Stage: { type: String, required: true }, 
    tags: {
      type: [String], 
      default: [], 
    },
  },
  { _id: false } 
);

const pipelineSchema = new mongoose.Schema(
  {
    pipelineName: { type: String, required: true, unique: true },
    data: {
      type: [stageSchema], 
      required: true,
    },
    uuid: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

export const getPipelineModel = async (dbName) => {
  const conn = await getDBConnection(dbName);
  return conn.model("PipelineCollection", pipelineSchema);
};
