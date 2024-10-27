import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import Themes from "../models/themes.model.js";
import bcrypt from "bcryptjs";

export const getThemes = catchAsyncErrors(async (req, res, next) => {
  const themes = await Themes.find();
  if (!themes || themes.length === 0)
    return res.json({ message: "No hay Temas registrados" }).status(400);
  res.status(200).json(themes);
});

export const createTheme = async (req, res) => {
  try {
    const themeName = req.body.themeName;

    console.log("En backend", themeName);
    const { imagen, video, documento } = req.body;
    console.log("En Backend", req.body);
    const creator = req.user._id;

    const existingTheme = await Themes.findOne({ themeName });
    if (existingTheme) {
      return res
        .json({ message: "Ya existe un tema registrado con ese nombre" })
        .status(400);
    }
    const newTheme = new Themes({
      themeName,
      creator,
      permissions: {
        imagen: imagen,
        video: video,
        documento: documento,
      },
    });
    const savedTheme = await newTheme.save();

    res.json({ message: "Nueva Temática creada con exito" }).status(200);
  } catch (error) {
    console.log(error);
  }
};

export const getTheme = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  console.log(id);
  const theme = await Themes.findById(id);
  if (!theme) {
    res.status(400).json({ message: "La temática no existe" });
   
  }

  res.json(theme);
});

export const updateTheme = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { imagen, video, documento } = req.body;
  const themeName = req.body.themeName;

  const theme = await Themes.findById(id);

  if (!theme || theme.length === 0) {
    return next(new ErrorHandler("La categoria no existe", 400));
  }
  if (theme.creator.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler("Acción no válida, no es el creador de la temática", 401)
    );
  }
  theme.themeName = req.body.themeName || theme.themeName;
  theme.permissions =
    {
      imagen: imagen,
      video: video,
      documento: documento,
    } || theme.permissions;

  const themeSaved = await theme.save();
  res.json(themeSaved);
});
export const deleteTheme = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const theme = await Themes.findById(id);
  if (!theme || theme.length === 0) {
    return next(new ErrorHandler("La temática no existe", 400));
  }
  if (theme.creator.toString() !== req.user._id.toString()) {
    return next(
      new ErrorHandler(
        "Acción no válida, no es el creador de la categoría",
        401
      )
    );
  }
  await theme.deleteOne();
  res.json({ message: "La temática eliminada" }).status(200);
});
