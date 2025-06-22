const express=require('express')
const router=express.Router()
const sellermodel=require("../models/seller")
const complaintModel=require("../models/complaint")
const productModel=require("../models/shopproducts")
const orderModel=require("../models/order")


const multer=require('multer')


const storage=multer.diskStorage({
    destination:(req,res,cb)=>{
      cb(null,'media/product')
    },
    filename:(req,res,cb)=>{
        cb(null,Date.now()+".jpg")
    }
})



const upload=multer({storage:storage})

router.get('/shopaddproduct',(req,res)=>{
    res.render('addbyshop')
})

router.post('/addproductpost',upload.single('image'),(req,res)=>{
    const product=req.body.product
    const price=req.body.price
    const description=req.body.description
    const image=req.file.filename
    const seller=req.session.shopid
    console.log(seller)

    const productdata={
       product:product,
       price:price,
       description:description,
       image:image,
       seller:seller
    }

    const saveproduct=new productModel(productdata)
    saveproduct.save()


    res.redirect('/seller/shopaddproduct')
})



router.get('/viewproducts',async (req,res)=>{
    const shopid=req.session.shopid
    const data=await productModel.find({seller:shopid})
    res.render('viewshopproducts',{data:data})
})


router.get('/viewcomplaint',async (req,res)=>{
    const shopid=req.session.shopid
    console.log(shopid)
    const l=[]
    const data=await complaintModel.find().populate({path:'product'}).populate('user')
   

    const datato=data.find(i=>i.product.seller==shopid)
    console.log(data)
    l.push(datato)

    

    res.render('viewcomplaints',{data:l})
})

router.post('/replycomplaint/:id',async (req,res)=>{
    const reply=req.body.reply
    const id=req.params.id
    await complaintModel.findOneAndUpdate({_id:id},{$set:{reply:reply}})
    res.redirect('/seller/viewcomplaint')
})


router.get('/vieworders',async (req,res)=>{
    const shopid=req.session.shopid
    const data=await orderModel.find({}).populate({path:'product',match:{'seller':shopid}}).populate('user')
    console.log(data)

    res.render('vieworders',{data:data})
})


module.exports=router