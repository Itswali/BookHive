import  { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { User } from "../models/userModel.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import { sendToken } from "../utils/sendToken.js";


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
    const verificationCode = await newUser.generateVerificationCode();
    await newUser.save();
    sendVerificationCode(verificationCode, email, res);
  }catch (error) {
    next(error);
  }
});

export const verifyOTP = catchAsyncErrors(async (req, res, next) => {
  const {email, otp} =req.body;
  if (!email || !otp) {
    return next(new ErrorHandler("Email or otp is missing.", 400));
  };
  try {
    const userAllEntries = await User.find({
      email,
      accountVerified: false,
    }).sort({ createdAt: -1 });

    if (!userAllEntries) {
      return next(new ErrorHandler("User not found.", 404));
    }

    let user;
    if (userAllEntries.length > 1) {
      user = userAllEntries[0];
      await User.deleteMany({
        _id: { $ne: user._id },
        email,
        accountVerified: false,
      });
    } else {
      user = userAllEntries[0];
    }

    if( user.verificationCode !== Number(otp)) {
      return next( new ErrorHandler("Invalid Otp.", 400));
    }

    const currentTime = Date.now();

    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();

    if ( currentTime > verificationCodeExpire) {
      return next(new ErrorHandler("OTP expired.", 400))
    }

    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;

    await user.save({validateModifiedOnly: true});

    sendToken(user, 200, "Account Verified.", res);

  } catch (error) {
    return next(new ErrorHandler("Internal server error.", 500));

  }
})

export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password.", 400));
  }
  const user = await User.findOne({ email, accountVerified: true }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or account not verified.", 401));
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid password.", 401));
  }
  sendToken(user, 200, `Welcome back, ${user.name}`, res);
});


export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200).cookie("token", "", {
    expires: new Date(Date.now()),
    httpOnly: true,
  }).json({
    success: true,
    message: "Logged out successfully.",
  });
});


export const getUser =  catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  req.status(200).json({
    sucess: true,
    user,
  })
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user= await user.findOne({
    email: req.body.email,
    accountVerified: true,
  });
  if(!user) {
    return next(new ErrorHandler("User not found.", 404));
  }
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false});
  const resetPasswordUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  const message = generateFOrgotPasswordTemplate(resetPasswordUrl);

  try {
    await sendEmail({
      email: user.email,
      subject: "BookHive Password Recovery",
      message,
    });
    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({ validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500));
  }
});
