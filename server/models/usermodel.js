import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  verifyOtp: { type: String, default: "" },
  verifyOtpExpired: { type: Number, default: 0 },
  isAccountVerified: { type: Boolean, default: false },
  resetOtp: { type: String, default: "" },
  resetOtpExpired: { type: Number, default: 0 },
});

const UserModels = mongoose.models.User || mongoose.model("User", userSchema);
export default UserModels;
