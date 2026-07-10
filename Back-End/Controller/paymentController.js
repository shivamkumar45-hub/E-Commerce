import handleAsync from '../Middleware/handleAsync.js';
import {instance} from '../server.js';
import crypto from 'crypto';

export const processPayment=handleAsync(async(req,res,next)=>{
  const options={
    amount:Number(req.body.amount*100),
    currency:"INR",
  }
  const order=await instance.orders.create(options);
  res.status(200).json({
    success:true,
    order
  })
})

// Send Api Key
export const sendApiKey=handleAsync(async(req,res,next)=>{
  res.status(200).json({
    key:process.env.RAZORPAY_API_KEY
  })
})

// Payment Verification
export const paymentVerification=handleAsync(async(req,res,next)=>{
   const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body;  
   const body=razorpay_order_id+"|"+razorpay_payment_id;
   const expectedSignature=crypto.createHmac('sha256',process.env.RAZORPAY_API_SECRET).update(body.toString()).digest('hex');
     const isAuthentic=expectedSignature===razorpay_signature;
     
     if(isAuthentic){
       return res.status(200).json({
        success:true,
        message:'Payment verified successfully',
        reference:razorpay_payment_id
      })
     }else{
      return res.status(400).json({
        success:false,
        message:'Payment verification failed'
      })
     }
})