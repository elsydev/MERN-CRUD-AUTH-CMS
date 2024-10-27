import mongoose from "mongoose";
const categorySchema = new mongoose.Schema(
  {
    categoryName: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },

    coverImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    permissions: {
      imagen: { type: Boolean, default: false },

      video: { type: Boolean, default: false },

      documento: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);
const Category = mongoose.model("Category", categorySchema);

export default Category;
