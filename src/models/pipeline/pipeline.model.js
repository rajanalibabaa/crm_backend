import mongoose from "mongoose";
import { getDBConnection } from "../../middleware/db.connection.js";


const pipelineSchema = new mongoose.Schema(
  {
    pipelineName: { type: String, required: true, unique: true },
    data: [
      {
        type: mongoose.Schema.Types.Mixed, 
      },
    ],
    uuid:{
      type:String
    }
  },
  { timestamps: true }
);

export const getPipelineModel = async (dbName) => {
  const conn = await getDBConnection(dbName);
  return conn.model("PipelineCollection", pipelineSchema);
};