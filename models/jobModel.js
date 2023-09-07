import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
   company:{
    type:String,
    required:[true, 'company name is require']
   },
   position:{
    type:String,
    required:[true, 'job position is required']
   },
   statues:{
    type: String,
    enum:["pending", "reject", "interview"],
    default:'pending'
   },
   workType:{
    type:String,
    enum:['full-time', 'part-time','internship','contaract'],
    default:'full-time'
   },
   workLocation:{
    type:String,
    default: 'malaz',
    required:[true,'work location is required']
   },
   createdBy:{
    type:mongoose.Types.ObjectId,
    ref:'User'
   }
},{timestamps:true})

export default mongoose.model("Job", jobSchema)