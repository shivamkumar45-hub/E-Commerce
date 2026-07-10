import handleAsync from "../Middleware/handleAsync.js";
import User from "../Models/userModel.js";
import HandleError from "../utils/handleError.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import {v2 as cloudinary} from 'cloudinary'
import crypto from "crypto";

export const registerUser = handleAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!req.files || !req.files.avatar) {
    return next(new HandleError("Avatar file is required", 400));
  } 
  const avatarFile = req.files.avatar;
  const myCloud=await cloudinary.uploader.upload(avatarFile.tempFilePath,{
    folder:'avatars',
    width:150,
    crop:'scale'
  })
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url:myCloud.secure_url,
    },
  });
  sendToken(user, 201, res);
});

// Login
export const LoginUser = handleAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new HandleError("email or password cannot be blank", 400));
  }
  const Ruser = await User.findOne({ email }).select("+password");
  if (!Ruser) {
    return next(new HandleError("Invalid email or Password", 404));
  }
  const ispasswordValid = await Ruser.verifyPassword(password);
  if (!ispasswordValid) {
    return next(new HandleError("Invalid email or Password", 404));
  }
  sendToken(Ruser, 201, res);
});

// logout
export const LogOutUser = handleAsync(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "successfully logged out",
  });
});

// FORGOT Password
export const requestPasswordReset = handleAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new HandleError("user doesn't exist", 400));
  }
  let resetToken;
  try {
    resetToken = user.generatePasswordResetToken();
    await user.save({ validateBeforeSave: false });
  } catch (error) {
    return next(
      new HandleError("could not save reset token please try again later", 500)
    );
  }
  const resetPasswordURL = `${req.protocol}://${req.get('host')}/reset/${resetToken}`;
  const message = `use the given link to reset your password \n\n ${resetPasswordURL} \n\n if you have not requested this email then please ignore it`;
  try {
    // send email
    await sendEmail({
      email: user.email,
      subject: "password recovery email",
      message,
    });
    res.status(201).json({
      success: true,
      message: `reset link sent to your ${user.email} email`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new HandleError("email could not be sent", 500));
  }
});

// RESET Password
export const resetPassword = handleAsync(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(
      new HandleError(
        "reset password token is invalid or has been expired",
        400
      )
    );
  }
  const { password, confirmPassword } = req.body;
  if (password !== confirmPassword) {
    return next(new HandleError("password doesn't match", 400));
  }
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendToken(user, 200, res);
});

// get user details
export const getUserDetails = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    user,
  });
});

// update password
export const updatePassword = handleAsync(async (req, res, next) => {
  const {oldPassword,newPassword,confirmPassword}=req.body;
  const user=await User.findById(req.user.id).select("+password");
  const checkPasswordMatch=await user.verifyPassword(oldPassword);
  if(!checkPasswordMatch){
    return next(new HandleError("old password is not correct",400));
  }
  if(newPassword!=confirmPassword){
    return next(new HandleError("password does not match",400));
  }
  user.password=newPassword;
  await user.save();
  sendToken(user,200,res);
})

// Updateing user profile
export const updateProfile = handleAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const updateUserDetail = { name, email };
  if (req.files && req.files.avatar) {
    const user = await User.findById(req.user.id);
    await cloudinary.uploader.destroy(user.avatar.public_id);
    const avatarFile = req.files.avatar;
    const myCloud = await cloudinary.uploader.upload(avatarFile.tempFilePath, {
      folder: "avatars",
      width: 150,
      crop: "scale"
    });
    updateUserDetail.avatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url
    };
  }
  const updatedUser = await User.findByIdAndUpdate(
    req.user.id,
    updateUserDetail,
    {
      new: true,
      runValidators: true
    }
  );
  res.status(200).json({
    success: true,
    message: "Profile updated Successfully",
    user: updatedUser
  });
});


// gettting user details--Admin
export const getAllUsersList=handleAsync(async(req,res,next)=>{
  const users=await User.find();
  res.status(200).json({
    success:true,
    users
  })
})

// getting single User information
export const getSingleUserDetails=handleAsync(async(req,res,next)=>{
  const user=await User.findById(req.params.id);
  if(!user){
    return next(new HandleError(`user not found with this id ${req.params.id}`,404));
  }
  res.status(200).json({
    success:true,
    user
  })
})

// Updating user role --Admin
export const updateUserRole=handleAsync(async(req,res,next)=>{
  const {role} = req.body;
  const updateUserrole={
    role
  }
  const user=await User.findByIdAndUpdate(req.params.id,updateUserrole,{
    new:true,
    runValidators:true
  })
  if(!user){
    return next(new HandleError(`user not found with this id ${req.params.id}`,404));
  }
  res.status(200).json({
    success:true,
    user
  })
})

// Delete user --Admin (WITH Cloudinary cleanup)
export const deleteUser = handleAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new HandleError(`user not found with this id ${req.params.id}`, 404)
    );
  }

  // 🔥 Delete avatar from Cloudinary
  if (user.avatar && user.avatar.public_id) {
    await cloudinary.uploader.destroy(user.avatar.public_id);
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted Successfully",
  });
});
