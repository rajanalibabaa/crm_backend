import mongoose from "mongoose";
import uuid from "../../utils/uuid.js"


const pipelineSchema = new mongoose.Schema(
  {
    pipelineName: { type: String, required: true, unique: true },
    data: [
      {
        type: mongoose.Schema.Types.Mixed, 
      },
    ],
    uuid:{
      type:String,default:uuid()
    }
  },
  { timestamps: true }
);

export const PipelineCollection = mongoose.model("PipelineCollection", pipelineSchema);
