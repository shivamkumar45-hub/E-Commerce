import mongoose from "mongoose";
 export const connectDB=()=>{
    if (!process.env.db_URI) {
      console.error("MongoDB connection error: db_URI environment variable is not defined.");
      return;
    }
    mongoose.connect(process.env.db_URI).then((data)=>{
      console.log(`Mongodb connected with server: ${data.connection.host}`);
    }).catch((err)=>{
      console.error("MongoDB connection error:", err.message);
    })
 }