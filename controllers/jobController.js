//import { compare } from "bcryptjs"
import mongoose from "mongoose"
import jobModel from "../models/jobModel.js"
import moment from "moment/moment.js"
import { query } from "express"

export const createJobController  = async (req,res,next)=>{
    const {company,position} = req.body
    if(!company || !position){
        next('please provide all field')
    }
    req.body.createdBy = req.user.userId 
    const job = await jobModel.create(req.body)
    res.status(201).json({job})
}

export const getJobController = async (req,res,next)=>{
  const { statues,workType,search,sort} = req.query
  //condition for searching filters
   const queryObject ={
    createdBy : req.user.userId
   }
   // logic filter
   if(statues && statues !== 'all'){
    queryObject.statues = statues
   }
   if (workType && workType !== "all") {
    queryObject.workType = workType;
  }
  if (search) {
    queryObject.position = { $regex: search, $options: "i" };
  }

   let queryResult = jobModel.find(queryObject)
   //sorting
   if(sort === 'latest'){
    queryResult = queryResult.sort('-createdAt')
   }
   if(sort === 'oldest'){
    queryResult = queryResult.sort('-createdAt')
   }
   if(sort === 'a-z'){
    queryResult = queryResult.sort('position')
   }
   if(sort === 'z-a'){
    queryResult = queryResult.sort('-position')
   }
   //pagination
   const page = Number(req.query.page) || 1
   const limit = Number(req.query.limit)|| 10
   const skip = (page - 1)* limit
   queryResult = queryResult.skip(skip).limit(limit)
   //job count
   const totalJobs = await jobModel.countDocuments(queryResult)
   const numOfPage = Math.ceil(totalJobs/ limit)
  const jobs =await queryResult
  //const jobs = await jobModel.find({createdBy:req.user.userId})
  res.status(200).json({
    //totalJobs : jobs.length,
    totalJobs,
    jobs,
    numOfPage
  })
}

export const updateJObController =async (req,res,next)=>{
    const {id} = req.params
    const { company, position}= req.body
    if(!company || !position){
        next(" please provide all fields")
    }
      const job = await jobModel.findOne({_id:id})
      if(!job){
        next(`not jobs found with thhis id ${id}`)
      }
      if(!req.user.userId === job.createdBy.toString()){
          next('your not authorized to update this job')
        return 
      }
      const updateJob = await jobModel.findByIdAndUpdate({_id:id}, req.body,{
        new:true,
        runValidators:true

      })
      res.status(200).json({updateJob})
}

export const  deleteJobController= async(req,res,next) =>{
  const {id} =req.params
  const job = await jobModel.findOne({_id:id})
  if(!job){
    next(`no job found with this id${id}`)
  }
  if(!req.user.userId === job.createdBy.toString()){
    next('your not authorize to delete this job')
    return
  }
 await job.deleteOne()
 res.status(200).json({message:"Successfully delete job"})
}

export const jobStatusController = async (req,res)=>{
   const stats =await  jobModel.aggregate([ 
   //search by user job
    {
     $match:{
       createdBy: new mongoose.Types.ObjectId(req.user.userId)
     },
     
    },
    {
      $group:{
        _id:'$statues', 
        count:{$sum:1},
       },
    }

    ])
    //default stats
    const defaultStats = {
      pending: stats.pending || 0,
      reject: stats.reject || 0,
      interview: stats.interview || 0

    }
    //monthly yearly stats
    let monthlyApplication = await jobModel.aggregate([
      {
        $match:{
          createdBy: new mongoose.Types.ObjectId(req.user.userId)
        }
      },
      {
        $group:{
          _id:{
            year:{$year: '$createdAt'},
            month:{$month: '$createdAt'}
          },
          count:{$sum:1}
        }
      }
    ])
    monthlyApplication = monthlyApplication.map(item=>{
      const {_id:{year,month},count} = item
      const date =moment().month(month - 1).year(year).format('MMM y')
      return {date,count}
    }).reverse()
   res.status(200).json({totalJobs: stats.length,stats ,defaultStats,monthlyApplication})
}