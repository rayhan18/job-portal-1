import userModel from "../models/userModel.js"

export const registerController = async (req,res,next)=>{

    const {name,email,password} = req.body
    if(!name){
        //return res.status(400).send({success:false,message:'please provide name'})
        next("name is require")
    }
    if(!email){
       // return res.status(400).send({success:false,message:'please provide email'})
       next("email is require")
    }
    if(!password){
       // return res.status(400).send({success:false,message:'please provide v'})
       next("password is require")
    }
    const existingUser = await userModel.findOne({email})
         if(existingUser){
            // return res.status(200).send({
            //     success:false,
            //     message: 'Email already Registered '
            //})
            next('Email already Registered ')
         }
         const user = await userModel.create({name,email,password})
         const token = user.createJWT()
         res.status(201).send({
            success:true,
            message:'User created successfully',
            user:{
               name:user.name,
               email:user.email,
             
            },
            token:token
         })
 
}

export const loginController = async (req,res,next)=>{
  const {email,password}=req.body
  //validation
  if(!email || !password){
   next('please provide all fields')
  }
  //find user by email
  const user = await userModel.findOne({email})
  if(!user){
   next(`Invalid user name or password`)
  }
 // compare password
   const isMatch = await user.comparePassword(password)
   if(!isMatch){
      next(`Invalid user name or password`)
   }
   user.password = undefined  // for no need showing password
   const token = user.createJWT()
   res.status(200).json({
      success:true,
      message:"Login successfully",
      user,
      token,
   })
}