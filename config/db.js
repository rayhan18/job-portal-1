import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGO_URL)
        console.log(`connected mongodb`)
    } catch (error) {
        console.log(`mongodb error${error}`)
    }
}
export default connectDB