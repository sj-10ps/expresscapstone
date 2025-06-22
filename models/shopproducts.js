const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    product:String,
    price:Number,
    description:String,
    image:String,
    seller:{
        type:mongoose.Schema.Types.ObjectId,ref:'seller'
    }
})

const shopproduct=mongoose.model('shopproduct',productSchema)

module.exports=shopproduct