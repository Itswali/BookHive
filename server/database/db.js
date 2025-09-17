import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect(process.env.MONGO_URI, {
      dbName: "BOOKHIVE_DIGITAL_LIBRARY"
    }).then(()=>{
      console.log(`Database connected sucessfully`);
    }).catch(err=>{
      console.log(`Error connecting to database`, err)
    });
};
