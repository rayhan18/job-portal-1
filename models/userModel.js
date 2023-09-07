
import mongoose from "mongoose";
import validator from "validator";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const userSchema = new mongoose.Schema({
 name:{
    type:String,
    require:[true , 'name is require']
 },
 email:{
    type:String,
    require:[true, 'email is require'],
    unique:true,
    validate:validator.isEmail
 },
 password:{
    type:String,
    require:[true, 'password is require'],
   select:true
 },
 location:{
    type:String,
    default: 'saudi Arab'
 }
}, {timestamps:true})

//hash password middleware
userSchema.pre('save',async function(){
   if(!this.isModified) return
 const salt = await bcrypt.genSalt(10);
 this.password = await bcrypt.hash(this.password,salt)
})
//compare password
userSchema.methods.comparePassword =async function(userPassword){
   const isMatch = await bcrypt.compare(userPassword, this.password)
   return isMatch
}


// json web token 
 userSchema.methods.createJWT = function(){
   return jwt.sign({userId:this._id}, process.env.JWT_SECRET, {expiresIn: '1d'})
 }
export default mongoose.model('User',userSchema)