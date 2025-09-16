import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
      dbName: "BPPKHIVE DIGITAL LIBRARY"
    }).then(()=>{
      console.log(`Database connected sucessfully`);
    }).catch(err=>{
      console.log(`Error connecting to database`, err)
    });
};
