import Order from '../Models/OrderModel.js';
import Product from '../Models/ProductModels.js';
import User from '../Models/userModel.js';
import HandleError from "../utils/handleError.js";
import handleAsync from "../Middleware/handleAsync.js";

// Create New Order
export const createOrder=handleAsync(async(req,res,next)=>{
  const {shippingInfo,orderItems,paymentInfo,itemsPrice,taxPrice,shippingPrice,totalPrice}=req.body;

  const order=await Order.create({
    shippingInfo,
    orderItems,
    paymentInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paidAt:Date.now(),
    user: req.user._id
  });
  res.status(201).json({
    success:true,
    order
  })
});

// Get Single Order 
export const getSingleOrder=handleAsync(async(req,res,next)=>{
  const order=await Order.findById(req.params.id).populate("user","name email");

  if(!order){
    return next(new HandleError("Order not found with this id",404));
  }
  res.status(200).json({
    success:true,
    order
  })
});

// Get Logged in user Orders
export const AllMyOrders=handleAsync(async(req,res,next)=>{
  const orders=await Order.find({user:req.user._id}); 
  if(!orders){
    return next(new HandleError("You have no orders",404));
  }
  res.status(200).json({
    success:true,
    orders
  })
});

// get all orders -- admin
export const getAllOrders=handleAsync(async(req,res,next)=>{
  const orders=await Order.find(); 
  if(!orders){
    return next(new HandleError("You have no orders",404));
  }
  let totalAmount=0;
  orders.forEach(order=>{
    totalAmount+=order.totalPrice;
  })
  res.status(200).json({
    success:true,
    orders,
    totalAmount
  })
});

// update Order Status -- admin
export const updateOrderStatus=handleAsync(async(req,res,next)=>{
  const order=await Order.findById(req.params.id);

  if(!order){
    return next(new HandleError("Order not found with this id",404));
  }
  if(order.orderStatus==="Delivered"){
    return next(new HandleError("You have already delivered this order",400));
  }
  await Promise.all(order.orderItems.map(item=>updateQuantity(item.product,item.quantity)));
  order.orderStatus=req.body.status;
  if(req.body.status==="Delivered"){
    order.deliveredAt=Date.now();
  }
  await order.save({validateBeforeSave:false});
  res.status(200).json({
    success:true,
    order
  })
})
async function updateQuantity(id,quantity){
  const product=await Product.findById(id);
  if(!product){
   throw new Error("Product not found");
  }
  if(product.stock>0&& product.stock>=quantity){
    product.stock-=quantity;
  } 
  await product.save({validateBeforeSave:false});
}


// delete Order -- admin
export const deleteOrder=handleAsync(async(req,res,next)=>{
  const order=await Order.findById(req.params.id);  
  if(!order){
    return next(new HandleError("Order not found with this id",404));
  }
  if(order.orderStatus!=="Delivered"){
    return next(new HandleError("You can only delete delivered orders",400));
  }
  await Order.deleteOne({_id:req.params.id});
  res.status(200).json({
    success:true,
    message:"Order deleted successfully"
  })
});


