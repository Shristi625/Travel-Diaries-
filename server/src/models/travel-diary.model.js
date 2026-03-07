import mongoose from "mongoose";

const travelDiarySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    travelDate: {
      type: Date,
    },
    coverImage: {
      type: String,
    },
    images: [{
      type: String,
    }],
    story: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "published",
    },
  },
  {
    timestamps: true,
  }
);

const TravelDiary = mongoose.model("TravelDiary", travelDiarySchema);

export default TravelDiary;
