import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      selected: false,
      minLength: [8, "La contraseña debe contener al menos 8 caracteres"],
      required: true,
    },
    profileImage: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },

    token: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["Creador", "Lector", "Admin"],
      default: "Lector",
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);
const User = mongoose.model("User", userSchema);

export default User;
