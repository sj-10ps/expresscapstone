const mongoose=require('mongoose')

const productSchema=new mongoose.Schema({
    product:String,
    price:Number,
    description:String,
    image:String
})

const product=mongoose.model('product',productSchema)

module.exports=product