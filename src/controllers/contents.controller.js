import User from "../models/user.model.js";
import Content from "../models/content.model.js";
import Category from "../models/category.model.js";
import { uploadImage } from "../libs/cloudinary.js";
import Themes from "../models/themes.model.js";

export const createContent = async (req, res) => {
  let image, documents, videoUrl;
  try {
    const { title, description, categoryId, themeId } = req.body;
    const userId = req.user._id;
    const userFound = await User.findById(userId);
    if (userFound.role === "Lector") {
      return res.status(401).json({
        message: "No cuenta con permisos para la creaci´pon de contenido",
      });
    }
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: "Debe incluir el archivo" });
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      res.status(400).json({ message: "La categoria no existe" });
      //return next(new ErrorHandler("La categoria no existe",400));
    }

    const theme = await Themes.findById(themeId);

    if (!theme) {
      res.status(400).json({ message: "La temática no existe" });
    }
    const { imagen, video, documento } = theme.permissions;
    if (video) {
      console.log(video);
    }

    if (imagen) {
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

      if (!allowedFormats.includes(coverImage.mimetype)) {
        return next(new ErrorHandler("Formato de archivo no soportado", 400));
      }
      const cloudinaryResponse = await uploadImage(coverImage.tempFilePath);
      image = {
        url: cloudinaryResponse.secure_url,
        public_id: cloudinaryResponse.public_id,
      };
    }

    if (documento) {
      console.log(documento);
    }
    const newContent = new Content({
      title,
      description,

      user: req.user.id,
      contentImage: {
        url: image.url,
        public_id: image.public_id,
      },
    });

    const savedContent = await newContent.save();

    res.json(savedContent).status(200);
  } catch (error) {}
};
export const getContents = async (req, res) => {
  const contents = await Content.find({ user: req.user.id }).populate("user");
  res.json(contents);
};
export const getContent = async (req, res) => {
  const foundContent = await Task.findById(req.params.id);
  if (!foundContent)
    return res.status(401).json({ message: "Contenido no encontrado" });

  return res.json(foundContent).staus(200);
};

export const deleteContent = async (req, res) => {
  const content = await Content.findByIdAndDelete(req.params.id);
  if (!content)
    return res.status(401).json({ message: "Contenido no encontrado" });
  return res.sendStatus(204);
};
export const updateContent = async (req, res) => {
  const content = await Content.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  }).populate("user");
  if (!content)
    return res.status(401).json({ message: "Contenido no encontrada" });
  res.json(content);
};
