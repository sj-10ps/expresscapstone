const mongoose=require('mongoose')

const cartSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shopproduct'
    },
    count:Number,
    date:{
        type:Date,
        default:Date.now
    }
})

const cart=mongoose.model('cart',cartSchema)

module.exports=cart