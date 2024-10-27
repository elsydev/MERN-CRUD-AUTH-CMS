import mongoose from "mongoose";
const themesSchema = new mongoose.Schema({
  themeName: { type: String, unique: true, required: true, trim: true },

  permissions: {
    imagen: { type: Boolean, default: false },

    video: { type: Boolean, default: false },

    documento: { type: Boolean, default: false },
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});
const Themes = mongoose.model("Themes", themesSchema);

export default Themes;
