const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const mongodburl=process.env.MONGOURL

const fun=async ()=>{
 const con=await mongoose.connect(mongodburl)
 console.log("connected db")
}

module.exports=fun