const mongoose=require('mongoose')

const sellerSchema=new mongoose.Schema({
    name:String,
    place:String,
    username:String,
    password:String
})


const seller=mongoose.model('seller',sellerSchema)

module.exports=seller