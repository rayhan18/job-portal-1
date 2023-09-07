//const express =require("express")
import  Express  from "express"
import 'express-async-errors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js"
import testRoute from './routes/testRouter.js'
import cors from 'cors'
import morgan from "morgan"
import helmet from 'helmet'
import xss from "xss-clean";
import swaggerDoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import mongoSanitize from 'express-mongo-sanitize'
import authRoute from './routes/authRoute.js'
import errorMiddleware from "./middelwares/errorMidelware.js"
import userRoute from './routes/userRoute.js'
import jobRoute from './routes/jobRouter.js'

//dotenv config
dotenv.config()
//db connection
connectDB()
// swagger api config
const options ={
    definition:{
        openapi:"3.0.3",
        info:{
           title:'job portal application',
           descrption:' Node expressjs  job portal Application'
        },
        services:{
           url:"http://localhost:8000"
        },
    },
   apis:['./routes/*.js'],
}
const spec = swaggerDoc(options)




const app = Express()

//middeleware
app.use(helmet())
app.use(xss())
app.use(mongoSanitize())
app.use(Express.json())
app.use(cors())
app.use(morgan('dev'))

const port = process.env.PORT
//route api
app.use('/api/v1/test', testRoute)
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/user', userRoute)
app.use('/api/v1/jobs', jobRoute)

//home route root
app.use("/api-doc", swaggerUi.serve, swaggerUi.setup(spec))

//validation middelware
app.use(errorMiddleware)
//listen
app.listen(port, ()=>{
    console.log(`node  PROJECT mode ${process.env.PROJECT_MODE} server running port ${port}`)
})