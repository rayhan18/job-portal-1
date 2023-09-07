//const express =require("express")
import  Express  from "express"
import 'express-async-errors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import testRoute from './routes/testRouter.js'
import cors from 'cors'
import morgan from "morgan"
import authRoute from './routes/authRoute.js'
import errorMiddleware from "./middelwares/errorMidelware.js"
import userRoute from './routes/userRoute.js'
import jobRoute from './routes/jobRouter.js'
dotenv.config()
connectDB()
const app = Express()

//middeleware
app.use(Express.json())
app.use(cors())
app.use(morgan('dev'))

const port = process.env.PORT
//route api
app.use('/api/v1/test', testRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/jobs', jobRoute)

//validation middelware
app.use(errorMiddleware)
//listen
app.listen(port, ()=>{
    console.log(`node  PROJECT mode ${process.env.PROJECT_MODE} server running port ${port}`)
})