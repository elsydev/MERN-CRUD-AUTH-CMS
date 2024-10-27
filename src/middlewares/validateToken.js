import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import ErrorHandler from "./error.js";

export const authRequired = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.status(401).json({
      message: "No hay Token, autorización denegada",
    });
  }
  /* jwt.verify(token,process.env.SECRET_JWT_WORD,(err,user)=>{
        if(err) return res.status(403).json({message:"Invalid Token"});
        req.user=user;
        console.log("req user desde authRequired",user)
        next();
    }); */
  const decoded = jwt.verify(token, process.env.SECRET_JWT_WORD);
  req.user = await User.findById(decoded.id);

  next();
};


export const isAuthorized = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ErrorHandler("Usuario no autenticado", 401));
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: `${req.user.role} no tiene acceso a este recurso.` });
    }

    next();
  };
};
