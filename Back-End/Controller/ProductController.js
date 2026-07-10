 import Product from "../Models/ProductModels.js"
import HandleError from "../utils/handleError.js";
import handleAsync from "../Middleware/handleAsync.js";
import ApiFunctionality from "../utils/ApiFunctionality.js";
import {v2 as cloudinary} from 'cloudinary'


 export const createProduct = handleAsync(async (req, res, next) => {
  if (!req.files || !req.files.image) {
    return next(new HandleError("Product images are required", 400));
  }

  let images = [];
  if (Array.isArray(req.files.image)) {
    images = req.files.image;
  } else {
    images.push(req.files.image);
  }

  const imageLinks = [];

  for (const file of images) {
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "products",
    });

    imageLinks.push({
      public_id: result.public_id,
      url: result.secure_url,
    });
  }

  req.body.images = imageLinks;
  req.body.user = req.user.id;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});


 export const getAllProducts=handleAsync(async (req,res,next)=>{
  const resultPerPage=4;
 const apiFeatures= new ApiFunctionality(Product.find(),req.query).search().filter();
  
  // getting filtered query before pagenation
  const filteredQuery = apiFeatures.query.clone();
  const productCount=await filteredQuery.countDocuments();

// total pages for productCount
  const totalPages=Math.ceil(productCount/resultPerPage);
  const page=Number(req.query.page)||1;
  if(page>totalPages&&productCount>0){
    return next(new HandleError("this page doesn't exits",404));
  }
  apiFeatures.pagenation(resultPerPage);
  const products=await apiFeatures.query;
  if(!products||products.length===0){
  return next(new HandleError("product not found",404));
  }

  res.status(200).json({
    message:"All Products",
    products,
    productCount,
    resultPerPage,
    totalPages,
    currentPage:page
  });
})

// 3️⃣Update Product
export const updateProduct = handleAsync(async (req, res, next) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return next(new HandleError("product not found", 404));
  }
  if (req.files && req.files.image) {
    let images = [];

    if (Array.isArray(req.files.image)) {
      images = req.files.image;
    } else {
      images.push(req.files.image);
    }
    for (const img of product.images) {
      await cloudinary.uploader.destroy(img.public_id);
    }
    const imageLinks = [];
    for (const file of images) {
      const result = await cloudinary.uploader.upload(
        file.tempFilePath,
        { folder: "products" }
      );

      imageLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imageLinks; 
  }
  product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    product
  });
});

// 4️⃣delete Product
export const deleteProduct = handleAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new HandleError("product not found", 404));
  }
  for (const img of product.images) {
    await cloudinary.uploader.destroy(img.public_id);
  }
  await Product.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "product deleted",
  });
});


export const getSingleProduct=handleAsync(async(req,res,next)=>{
  const product=await Product.findById(req.params.id);
  if(!product){
    return next(new HandleError("product not found",404));
  }
  res.status(200).json({
    success:true,
    product
  })
})

// CreatingAndUpdating product review
export const createProductReview=handleAsync(async(req,res,next)=>{
  const {rating,comment,productId}=req.body;
  const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
  }
  const product=await Product.findById(productId);
  if(!product){
  return next(new HandleError("product not found",404));
 }
  const reviewExist=product.reviews.find(review=>review.user.toString()===req.user.id.toString());
  if(reviewExist){
    product.reviews.forEach(review=>{
      if(review.user.toString()===req.user.id.toString()){ 
        review.comment=comment;
        review.rating=rating;
      }
    })
  }else{
    product.reviews.push(review);
    
  }
  product.noOfReviwes=product.reviews.length;
  let avg=0;
  product.reviews.forEach(review=>{
    avg+=review.rating;
  })
  product.ratings=avg/product.reviews.length>0?avg/product.reviews.length:0;

  await product.save({validateBeforeSave:false});
  res.status(200).json({
    success:true,
    message:"review added/updated",
    product
  })
})

// Getting product reviews
export const getProductReviews=handleAsync(async(req,res,next)=>{
 const product=await Product.findById(req.query.id);
 if(!product){
  return next(new HandleError("product not found",404));
 }
  res.status(200).json({
    success:true,
    reviews:product.reviews
  })
})
 
// Deleting reviews
export const deleteReview=handleAsync(async(req,res,next)=>{
 const product=await Product.findById(req.query.productId);
 if(!product){
  return next(new HandleError("product not found",404));
 }
 const reviews=product.reviews.filter(review=>review._id.toString()!==req.query.id.toString());
 let avg=0;
  reviews.forEach(review=>{
    avg+=review.rating;
  })
  product.ratings=avg/reviews.length>0?avg/reviews.length:0;
  product.noOfReviwes=reviews.length;
  await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings:product.ratings,
    noOfReviwes:product.noOfReviwes
  },{
    new:true,
    runValidators:true
  });
  res.status(200).json({
    success:true,
    message:"review deleted successfully"
  })
})

// Admin-getting AllProducts
export const getAdminProducts=handleAsync(async(req,res,next)=>{
  const products=await Product.find();
  res.status(200).json({
    success:true,
    products
  })
})