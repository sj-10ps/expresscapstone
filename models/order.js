const mongoose=require('mongoose')

const orderSchema=new mongoose.Schema({
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shopproduct'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    count:Number,
    price:Number,
    Date:{
        type:Date,
        default:Date.now()
    }
})

const order=mongoose.model('order',orderSchema)

module.exports=order