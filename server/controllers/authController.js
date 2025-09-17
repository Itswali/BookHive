import  { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";


export const register = catchAsyncErrors  (async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if(!name || !email || !password) {
      return next(new ErrorHandler("Please provide all required fields.", 400));
    }
    const isRegistered = await User.findOne({ email });
    if(isRegistered) {
      return next(new ErrorHandler("User already registered. Please login.", 400));
    }
    const registraionsAttemptsByUser = await User.find({ email, accountVerified: false, });
    if(registraionsAttemptsByUser.length >= 5) {
      return next(new ErrorHandler("Maximum registration attempts exceeded. Please contact support.", 400));
    }
    if (password.length < 8 || password.length > 16) {
      return next(new ErrorHandler("Password must be at least 6 characters long.", 400));
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });
    const verificationCode = await user.generateVerificationCode();
    await user.save();
    sendVerificationCode(verificationCode, email, res);
  }catch (error) {
    next(error);
  }
});
