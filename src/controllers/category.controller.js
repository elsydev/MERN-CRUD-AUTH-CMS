import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Category from "../models/category.model.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../libs/cloudinary.js";

export const getCategories = catchAsyncErrors(async (req, res, next) => {
  const categories = await Category.find();
  if (!categories || categories.length === 0)
    return res.json({ message: "No hay categorias registradas" });
  res.status(200).json(categories);
});
export const createCategory = async (req, res) => {
  try {
    const categoryName = req.body.categoryName;
    const { coverImage } = req.files;
    const { imagen, video, documento } = req.body;

    const creator = req.user._id;
    let image;
    if (!req.files || Object.keys(req.files).length === 0)
      return res.status(400).json({ message: "La imagen es requerida" });

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(coverImage.mimetype)) {
      return next(new ErrorHandler("Formato de archivo no soportado", 400));
    }
    const cloudinaryResponse = await uploadImage(coverImage.tempFilePath);
    image = {
      url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    };
    const existingCategory = await Category.findOne({ categoryName });
    if (existingCategory) {
      return next(
        new ErrorHandler("La categoria ya se encuentra registrada", 400)
      );
    }
    const newCategory = new Category({
      categoryName,
      creator,
      permissions: {
        imagen: imagen,
        video: video,
        documento: documento,
      },
      coverImage: {
        url: image.url,
        public_id: image.public_id,
      },
    });
    const savedCategory = await newCategory.save();

    res.json({ message: "categoria creada con exito" }).status(200);
  } catch (error) {
    console.log(error);
  }
};

export const getCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const category = await Category.findById(id);
  if (!category) {
    res.status(400).json({ message: "La categoria no existe" });
    //return next(new ErrorHandler("La categoria no existe",400));
  }

  res.json(category);
});
export const getCategoryForTheme = catchAsyncErrors(async (req, res, next) => {
  const { name } = req.body;
  console.log(name);
  const category = await Category.findById(name);
  if (!category) {
    res.status(400).json({ message: "La categoria no existe" });
    //return next(new ErrorHandler("La categoria no existe",400));
  }

  res.json({ category });
});
export const updateCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  let image;
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(
      new ErrorHandler("La imagen de la categoria es requerida", 400)
    );
  }
  const { coverImage } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

  if (!allowedFormats.includes(coverImage.mimetype)) {
    return res.status(415).json({ message: "Formato de imagen no admitido" });
  }
  const cloudinaryResponse = await uploadImage(coverImage.tempFilePath);
  image = {
    url: cloudinaryResponse.secure_url,
    public_id: cloudinaryResponse.public_id,
  };
  const category = await Category.findById(id);

  if (!category || category.length === 0) {
    return next(new ErrorHandler("La categoria no existe", 400));
  }
  if (category.creator.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Acción no válida, no es el creador de la categoría",
        401
      )
    );
  }
  category.categoryName = req.body.categoryName || category.categoryName;
  category.coverImage =
    {
      url: image.url,
      public_id: image.public_id,
    } || category.coverImage;

  const categorySaved = await category.save();
  res.json({ categorySaved });
});
export const deleteCategory = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.findById(id);
  if (!category || category.length === 0) {
    return next(new ErrorHandler("La categoria no existe", 400));
  }
  if (category.creator.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Acción no válida, no es el creador de la categoría",
        401
      )
    );
  }
  await category.deleteOne();
  res.json({ message: "La categoria ha sido eliminada" }).status(200);
});
