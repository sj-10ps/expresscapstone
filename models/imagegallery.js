const mongoose=require('mongoose')

const imageSchema=new mongoose.Schema({
    thumbnail:String,
    images:[String],
    created:{
        type:Date,
        default:Date.now
    }

})


const imagegallery=mongoose.model('imagegallery',imageSchema)

module.exports=imagegallery