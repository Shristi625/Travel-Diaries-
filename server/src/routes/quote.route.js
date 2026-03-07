import express from "express";
import { 
  getQuotesController, 
  createQuoteController, 
  deleteQuoteController 
} from "../controllers/quote.controller.js";
import authenticate from "../middlewares/authenticate.middleware.js";
import asyncHandler from "../middlewares/async-handler.middleware.js";
import validateRequest from "../middlewares/validate-request.middleware.js";
import { validateQuote, validateQuoteId } from "../validators/quote.validator.js";

const quoteRouter = express.Router();

// Public routes
quoteRouter.get("/", asyncHandler(getQuotesController));

// Protected routes
quoteRouter.post(
  "/", 
  authenticate(["user", "admin"]), 
  validateQuote, 
  validateRequest, 
  asyncHandler(createQuoteController)
);
quoteRouter.delete(
  "/:id", 
  authenticate(["user", "admin"]), 
  validateQuoteId, 
  validateRequest, 
  asyncHandler(deleteQuoteController)
);

export default quoteRouter;
