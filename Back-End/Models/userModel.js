import mongoose from "mongoose";
import validator from "validator";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto';

const userSchema=new mongoose.Schema({
   name:{
    type:String,
    required:[true,"enter your name "],
    maxLength:[25,"length of name should less than 25 character"],
    minLength:[3,"length of name should be greter than 3 character"]
   },
   email:{
    type:String,
    unique:true,
    required:true,
    validate:[validator.isEmail,"please enter valid email"]
   },
   password:{
    type:String,
    required:[true,"please Enter your password"],
    minLength:[8,"password should be greter than 8 characters"],
    select:false
   },
   avatar:{
      public_id:{
          type:String,
          required:true
        },
      url:{
          type:String,
          required:true
        }
   },
   role:{
    type:String,
    default:"user"
   },
   resetPasswordToken:String,
   resetPasswordExpire:Date
},{timestamps:true})
userSchema.pre('save',async function(next){
  // 1st-updating profile(name,email,avatar)---Hashed password will again be hashed ---wrong
  // update password ----rigth
  if(!this.isModified("password")){
    return next();
  }
  this.password=await bcryptjs.hash(this.password,10)
  next();
})

userSchema.methods.getJWTToken=function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{
    expiresIn:process.env.JWT_EXPIRE
  })
}

userSchema.methods.verifyPassword=async function(userEnteredPassword){
  return await bcryptjs.compare(String(userEnteredPassword),this.password);
}

userSchema.methods.generatePasswordResetToken=function(){
  const resetToken=crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire=Date.now()+30*60*1000;
  return resetToken;
}

export default mongoose.model("User",userSchema);