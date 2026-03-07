import TravelDiary from "../models/travel-diary.model.js";
import {
  successResponse,
  APIError,
  uploadToCloudinary,
} from "../utils/index.util.js";

export const createDiaryController = async (req, res, next) => {
  try {
    const { title, location, travelDate, story, isPublic, status } = req.body;
    
    // For drafts, we can relax requirements. For published, we keep them.
    const isDraft = status === "draft";
    
    if (!isDraft && (!req.files || req.files.length === 0)) {
      return next(new APIError(400, "At least one image is required for publishing"));
    }

    // Upload all images to Cloudinary
    const uploadedImages = await Promise.all(
      req.files.map((file) =>
        uploadToCloudinary(file.buffer, "travel-diaries")
      )
    );

    const imageUrls = uploadedImages.map((img) => img.url);

    const date = new Date(travelDate);
    if (isNaN(date.getTime())) {
      return next(new APIError(400, "Invalid travel date"));
    }
    const newDiary = await TravelDiary.create({
      userId: req.user.userId,
      title,
      location,
      travelDate: travelDate ? date : undefined,
      story,
      coverImage: imageUrls.length > 0 ? imageUrls[0] : undefined,
      images: imageUrls,
      isPublic: Boolean(isPublic),
      status: status || "published",
    });

    successResponse(res, 201, "Diary created successfully", newDiary);
  } catch (err) {
    next(err);
  }
};

export const getMyDiariesController = async (req, res, next) => {
  try {
    let diaries;
    if (req.user.role === "admin") {
      diaries = await TravelDiary.find();
    } else {
      diaries = await TravelDiary.find({ userId: req.user.userId });
    }

    successResponse(res, 200, "Diaries fetched successfully", diaries);
  } catch (err) {
    next(err);
  }
};

export const getDiaryByIdController = async (req, res, next) => {
  try {
    const diary = await TravelDiary.findById(req.params.id).populate({ path: 'userId', select: 'displayName avatar' });
    if (!diary) return next(new APIError(404, "Diary not found"));

    // Check if user is owner, admin, or if the diary is public
    const ownerId = diary.userId._id ? diary.userId._id.toString() : diary.userId.toString();
    const isOwner = ownerId === req.user.userId;
    const isAdmin = req.user.role === "admin";
    const isPublic = diary.isPublic === true;

    if (!isOwner && !isAdmin && !isPublic) {
      return next(new APIError(403, "Access denied"));
    }

    successResponse(res, 200, "Diary fetched successfully", diary);
  } catch (err) {
    next(err);
  }
};

export const updateDiaryController = async (req, res, next) => {
  try {
    const diary = await TravelDiary.findById(req.params.id);
    if (!diary) return next(new APIError(404, "Diary not found"));

    if (
      req.user.role !== "admin" &&
      diary.userId.toString() !== req.user.userId
    )
      return next(new APIError(403, "Access denied"));

    // allow updating isPublic explicitly
    const { isPublic } = req.body;
    Object.assign(diary, req.body);
    if (typeof isPublic !== 'undefined') diary.isPublic = Boolean(isPublic);
    await diary.save();

    successResponse(res, 200, "Diary updated successfully", diary);
  } catch (err) {
    next(err);
  }
};

export const deleteDiaryController = async (req, res, next) => {
  try {
    const diary = await TravelDiary.findById(req.params.id);
    if (!diary) return next(new APIError(404, "Diary not found"));

    if (
      req.user.role !== "admin" &&
      diary.userId.toString() !== req.user.userId
    )
      return next(new APIError(403, "Access denied"));

    await TravelDiary.deleteOne({ _id: req.params.id });
    successResponse(res, 200, "Diary deleted successfully");
  } catch (err) {
    next(err);
  }
};

export const getPublicDiariesController = async (req, res, next) => {
  try {
    const diaries = await TravelDiary.find({ isPublic: true }).populate({ path: 'userId', select: 'displayName avatar' }).sort({ createdAt: -1 });
    successResponse(res, 200, 'Public diaries fetched successfully', diaries);
  } catch (err) {
    next(err);
  }
};
