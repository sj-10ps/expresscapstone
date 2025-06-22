const mongoose=require('mongoose')

const complaintschema=new mongoose.Schema({
    complaint:String,
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    product:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'shopproduct'
    },
    date:{
      type:Date,
      default:Date.now
    },
    reply:{
        type:String,
        default:'pending'
    }
})

const complaint=mongoose.model('complaint',complaintschema)

module.exports=complaint
