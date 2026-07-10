import HandleError from "../utils/handleError.js";
import handleAsync from "./handleAsync.js";
import User from "../Models/userModel.js"
import jwt from "jsonwebtoken"

export const verifyUserAuth=handleAsync(async(req,res,next)=>{
  const {token}=req.cookies;
  if(!token){
    return next(new HandleError("Authentication is missing !please login to Access Resource",401));
  }
  const decodedData=jwt.verify(token,process.env.JWT_SECRET_KEY)
  req.user=await User.findById(decodedData.id);
  next();
})

export const roleBasedAccess=(...roles)=>{
  return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
      return next(new HandleError(`role-${req.user.role} is not allowed to access the resource`));    
    }
    next();
  }
}