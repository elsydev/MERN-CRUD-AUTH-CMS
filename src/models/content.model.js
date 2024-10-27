import mongoose from "mongoose";
const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contentImage: {
      public_id: {
        type: String,
        
      },
      url: {
        type: String,
        
      },
    },

  },

  {
    timestamps: true,
  }
);
const Content = mongoose.model("Content", contentSchema);

export default Content;
