import Quote from "../models/quote.model.js";
import { successResponse, APIError } from "../utils/index.util.js";

export const getQuotesController = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ isPublic: true })
      .populate("userId", "displayName fullName avatar")
      .sort({ createdAt: -1 });
    successResponse(res, 200, "Quotes fetched successfully", quotes);
  } catch (err) {
    next(err);
  }
};

export const createQuoteController = async (req, res, next) => {
  try {
    const { text, author, category, image } = req.body;
    
    if (!text) {
      return next(new APIError(400, "Quote text is required"));
    }

    const travelImages = [
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format",
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format",
      "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format"
    ];

    const randomImage = travelImages[Math.floor(Math.random() * travelImages.length)];

    const newQuote = await Quote.create({
      userId: req.user.userId,
      text,
      author: author || "Anonymous",
      category: category || "Travel",
      image: image || randomImage,
    });

    successResponse(res, 201, "Quote shared successfully!", newQuote);
  } catch (err) {
    next(err);
  }
};

export const deleteQuoteController = async (req, res, next) => {
  try {
    const quote = await Quote.findById(req.params.id);
    if (!quote) return next(new APIError(404, "Quote not found"));

    if (
      req.user.role !== "admin" &&
      quote.userId.toString() !== req.user.userId
    ) {
      return next(new APIError(403, "Access denied"));
    }

    await Quote.deleteOne({ _id: req.params.id });
    successResponse(res, 200, "Quote removed successfully");
  } catch (err) {
    next(err);
  }
};
