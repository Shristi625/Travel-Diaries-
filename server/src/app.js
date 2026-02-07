import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes/index.route.js";
import { globalRateLimiter } from "./middlewares/rate-limiting.middleware.js";
import globalErrorHandler from "./middlewares/global-error-handler.middleware.js";
//import passport from "./config/passport.config.js";
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

// Don't parse multipart/form-data with express.json() - let multer handle it
app.use(express.json());
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

app.use(globalRateLimiter);
app.use(routes);
//app.use(passport.initialize());
app.use(globalErrorHandler);

export default app;
