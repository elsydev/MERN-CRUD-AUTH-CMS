import express from "express";
import morgan from "morgan";
import authRouter from "./routes/auth.routes.js";
import contentRouter from "./routes/contents.routes.js";
import categoryRouter from "./routes/category.routes.js";
import themeRouter from "./routes/theme.routes.js";
import { errorMiddleware } from "./middlewares/error.js";
import dotenv from "dotenv";
import fileUpload from "express-fileupload";
import cookieParser from "cookie-parser";
import cors from "cors";
import swaggerUI from "swagger-ui-express"
dotenv.config();

const app = express();
app.use(express.json());
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup())
app.use(cookieParser());
const ACCEPTED_ORIGINS = [
  "http://localhost:8080",
  "http://localhost:7000",
  "http://localhost:1234",
  "http://localhost:3000",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5173/",
];

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true);
      }

      if (!origin) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
  })
);

app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

app.use("/api/auth", authRouter);

app.use("/api/content", contentRouter);
app.use("/api/category", categoryRouter);
app.use("/api/theme", themeRouter);
app.use(errorMiddleware);
export default app;
