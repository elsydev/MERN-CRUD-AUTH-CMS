import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import { uploadImage } from "../libs/cloudinary.js";
import jwt from "jsonwebtoken";
import generarId from "../libs/generarId.js";
import { AuthEmail, passwordEmail } from "../emails/AuthEmails.js";


export const register = async (req, res, next) => {
  try {
    const { email, password, username, role } = req.body;
    console.log("Esto es req body:  ", req.body);
    console.log("Esto es req.files", req.files.profileImage);
    let image;
    if (!req.files || Object.keys(req.files).length === 0) {
      return next(
        new ErrorHandler("La imagen del perfil del usuario es requerida", 400)
      );
    }
    const { profileImage } = req.files;

    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];

    if (!allowedFormats.includes(profileImage.mimetype)) {
      return next(new ErrorHandler("Formato de archivo no soportado", 400));
    }
    const cloudinaryResponse = await uploadImage(profileImage.tempFilePath);
    image = {
      url: cloudinaryResponse.secure_url,
      public_id: cloudinaryResponse.public_id,
    };
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      //return next(new ErrorHandler("Ya existe un usuario con este correo electronico",400));
      return res.status(400).json(["Este correo ya se encuentra registrado"]);
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role,
      profileImage: {
        url: image.url,
        public_id: image.public_id,
      },
    });
    const savedUser = await newUser.save();
    savedUser.token = generarId();
    savedUser.confirmed = false;
    await savedUser.save();
    AuthEmail({ email: savedUser.email, token: savedUser.token });
    /*     const token=await createAccessToken({id:savedUser._id})
   res.cookie("token",token,{
       sameSite:'none',
       secure:true
       
   }) */
    res.json({
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
      profileImage: savedUser.profileImage,
      confirmed: savedUser.confirmed,
      token: savedUser.token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
    //return next (new ErrorHandler("Error al registrar al usuario",500))
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email }).select("+password");
    if (!existingUser) {
      res.status(400).json({ message: "El email no está registrado" });
      //return next (new ErrorHandler("El email no está registrado",400))
    }
    if (!existingUser.confirmed) {
      return res
        .status(500)
        .json({
          message:
            "Usuario no confirmado, por favor revise el email enviado a su cuenta de usuario",
        });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      res.status(400).json({ message: "El password es incorrecto" });
    }

    const token = await createAccessToken({ id: existingUser._id });
    res.cookie("token", token, {
      sameSite: "none",
      secure: true,
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      //maxAge: 1000 * 60 * 60 * 24,
      priority: "high",
      path: "/",
      /* 
       
        httpOnly:true  */
    });

    res
      .json({
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
        role: existingUser.role,
        profileImage: existingUser.profileImage,
        confirmed: existingUser.confirmed,
        message: "Login Exitoso",
      })
      .status(201);
  } catch (error) {
    return next(new ErrorHandler("Error al entrar a la aplicación", 500));
  }
};

export const confirmar = async (req, res) => {
  try {
    const { token } = req.body;
    console.log("En backend confirmando token:", token);

    const userToConfirm = await User.findOne({ token });
    if (!userToConfirm) {
      return res.status(403).json({ message: "El token no es válido" });
    }
    userToConfirm.confirmed = true;
    userToConfirm.token = "";
    const user = await userToConfirm.save();
    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};
export const logout = async (req, res) => {
  res
    .status(200)
    .cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
    })
    .json({
      success: true,
      message: "Logout Successfully.",
    });
  /* res.cookie("token", "", {
      httpOnly: true,
      secure: true,
      expires: new Date(0),
    });
    return res.sendStatus(200); */
};

export const profile = async (req, res) => {
  console.log(req.user);
  const userFound = await User.findById(req.user._id);
  if (!userFound) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }
  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    profileImage: userFound.profileImage,
    role: userFound.role,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
  //return res.json({message:"profile"})
};
export const verifyToken = async (req, res) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }
  jwt.verify(token, process.env.SECRET_JWT_WORD, async (err, user) => {
    if (err) return res.status(401).json({ message: "No Autorizado" });
    const userFound = await User.findById(user.id);
    if (!userFound) {
      return res.status(401).json({ message: "No Autorizado" });
    }
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      profileImage: userFound.profileImage,
      role: userFound.role,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  });
};

export const requirePassword = async (req, res) => {
  const { email } = req.body;
  const userFound = await User.findOne({ email });

  if (!userFound) {
    return res.status(400).json({ message: "Usuario no encontrado" });
  }
  if (!userFound.confirmed) {
    return res
      .status(500)
      .json({
        message:
          "Usuario no confirmado, revise su email y siga las instrucciones",
      });
  }
  try {
    userFound.token = generarId();
    await userFound.save();
    passwordEmail({ email: userFound.email, token: userFound.token });
    res
      .status(200)
      .json({
        message:
          "Solicitud de cambio de password recibida, instrucciones enviadas al correo",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

export const validateToken = async (req, res) => {
  const { token } = req.body;
  try {
    const userFound = await User.findOne({ token });

    if (!userFound) {
      return res.status(400).json({ message: "token no encontrado" });
    }
    res.status(200).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      token: userFound.token,
    });
  } catch (error) {
    console.log(error);
  }
};

export const updatePasswordWithToken = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword } = req.body;
    console.log("Esto viene en req.body", req.body);
    console.log("Desde UpdatePasswordWithTOken", newPassword);
    if (newPassword === null || newPassword === undefined)
      return res.status(400).json({ message: "password inválido" });
    if (token === null || token === undefined)
      return res.status(400).json({ message: "token inválido" });
    const user = await User.findOne({ token });
    if (!user) {
      return res.status(400).json({ message: "token no válido" });
    }
    const passwordHash = await bcrypt.hash(newPassword, 10);
    user.password = passwordHash;
    user.token = "";
    await user.save();
    res.json({ msg: "Password Modificado Correctamente" });
  } catch (error) {
    console.log(error);
  }

  /*  const { token } = req.params;
  const { password } = req.body;
  console.log("Desde UpdatePasswordWithTOken",password)
if(password===null || password===undefined) return res.status(400).json({message:"password inválido"})
  const user = await User.findOne({ token });
if(!user){
    return res.status(400).json({message:"token no válido"})
}
  if (user) {
    const passwordHash =await bcrypt.hash(password,10)
    user.password = passwordHash;
    user.token = "";
    try {
      await user.save();
      res.json({ msg: "Password Modificado Correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no válido");
    return res.status(404).json({ msg: error.message });
  } */
};
