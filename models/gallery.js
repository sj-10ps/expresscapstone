const mongoose=require('mongoose')

const gallerySchema=new mongoose.Schema({
    images:[String],
    created:{
        type:Date,
        default:Date.now()
    }
})


const gallery=mongoose.model('gallery',gallerySchema)

module.exports=gallery