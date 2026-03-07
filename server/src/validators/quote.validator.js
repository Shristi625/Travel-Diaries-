import { body, param } from "express-validator";

export const validateQuote = [
  body("text")
    .notEmpty()
    .withMessage("Quote text is required")
    .isLength({ min: 5, max: 500 })
    .withMessage("Quote must be between 5 and 500 characters"),
  body("author")
    .optional()
    .isString()
    .withMessage("Author must be a string")
    .isLength({ max: 50 })
    .withMessage("Author name is too long"),
  body("category")
    .optional()
    .isIn(["Travel", "Life", "Adventure", "Nature", "Wisdom", "Motivation", "Philosophy"])
    .withMessage("Invalid category"),
];

export const validateQuoteId = [
  param("id").isMongoId().withMessage("Invalid quote ID"),
];
