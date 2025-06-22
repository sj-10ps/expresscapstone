    const express=require('express')
const router=express.Router()
const userModel=require("../models/user")
const productModel=require("../models/shopproducts")
const galleryModel=require('../models/gallery')
const imageModel=require('../models/imagegallery')
const complaintModel=require('../models/complaint')
const cartModel=require('../models/cart')
const orderModel=require('../models/order')
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

router.use(express.static('media/product'))



router.get('/',async(req,res)=>{
     const data=await userModel.findOne({username:req.session.uname,password:req.session.pword})


     res.render('userhome',{data:data})
})


router.get('/editprofile/:id',async(req,res)=>{
    const id=req.params.id
    //req.session.id=id
    const data=await userModel.findOne({_id:id})
    res.render('editprofile',{data:data})
})


router.post('/editpost/:id',async(req,res)=>{
    const id=req.params.id
    const name=req.body.name
    const age=req.body.age
    const gender=req.body.gender
    const email=req.body.email
    const dob=req.body.dob
    const uname=req.body.uname
    const unamepresence=userModel.findOne({username:uname})
    if(unamepresence){
        res.redirect('/user/editprofile')
    }else{
          await userModel.findOneAndUpdate({_id:id},{$set:{name:name,age:age,gender:gender,email:email,username:uname,date:dob}})
          res.redirect('/user/')
    }
    
    
  

})

router.get('/deleteprofile/:id',async(req,res)=>{
    const id=req.params.id
    const status=await userModel.findOneAndDelete({_id:id})
    if (status){
        res.redirect('/user/')
    }
})

router.get('/changepw',(req,res)=>{
    const id=req.session.id
    const data=userModel.findOne({_id:id})
   res.render("changepw",{err:""})
})

router.post('/changepwpost',(req,res)=>{
     const id=req.session.id
     const pass1=req.body.pass1
     const pass2=req.body.pass2
     if(pass1==pass2){
        userModel.findOneAndUpdate({_id:id},{$set:{password:pass1}})
        res.redirect('/user/')

     } else{
        const err="password mismatch"
        res.render("changepw",{err:err})

     }
    

     
})

router.get('/addproduct',(req,res)=>{
    res.render('addproduct')
})

router.post('/addproductpost',upload.single('image'),async (req,res)=>{
 const product=req.body.product
 const price=req.body.price
 const description=req.body.description
 const image=req.file.filename

 const productitem={
 product:product,
 price:price,
 description:description,
 image:image
 }

 const saveproduct=new productModel(productitem)
 await saveproduct.save()
 res.redirect('/user/addproduct')

})


router.get('/viewproduct',async (req,res)=>{
    const data=await productModel.find({}).populate('seller')

    res.render('viewproduct',{data:data})
})


router.get('/editproduct/:id',async (req,res)=>{
    const id=req.params.id
    const data=await productModel.findOne({_id:id})

    res.render('editproduct',{data:data})
})

router.post('/editproductpost/:id',upload.single('image'),async (req,res)=>{
    const id=req.params.id
    const product=req.body.product
    const price=req.body.price
    const description=req.body.description
    const image=req.file.filename
    

    await productModel.findOneAndUpdate({_id:id},{$set:{
        product:product,
        price:price,
        description:description,
        image:image
    }})
    res.redirect('/user/viewproduct')
})

router.get('/gallery',(req,res)=>{
    res.render('gallery')
})


router.post('/gallerypost',upload.array('image',4),async (req,res)=>{
const images=req.files.map(file=> file.filename)
const savegallery=new galleryModel({
    images:images
})
await savegallery.save()
res.redirect('/user/gallery')
})


router.get('/viewgallery',async (req,res)=>{
    const data=await galleryModel.find({})
    res.render('viewgallery',{data:data})
})


router.get('/uploadvideo',(req,res)=>{
    res.render('uploadvideo')
})

router.post('/videopost',upload.fields([{name:'thumb',maxCount:1},{name:'images',maxCount:4}]),async (req,res)=>{
    const thumb=req.files['thumb'] ? req.files['thumb'][0].filename:null
    const images=req.files['images'] ? req.files['images'].map((item)=>item.filename) :[]

    const save=new imageModel({
        thumbnail:thumb,
        images:images
    })
    await save.save()
    res.redirect('/user/uploadvideo')
})

router.get('/viewimg',async (req,res)=>{
    const data=await imageModel.find({})
    res.render('viewimg',{data:data})
})


router.get('/complaint/:productid',(req,res)=>{
    const productid=req.params.productid
    res.render('complaint',{productid:productid})
})

router.post('/complaintpost',async (req,res)=>{
    const productid=req.body.productid
    const complaint=req.body.complaint
    const user=req.session.userid
    const complaintdata={
        complaint:complaint,
        user:user,
        product:productid,
     
    }
    const savedata=await new complaintModel(complaintdata)
   savedata.save()
   
   res.redirect('/user/viewproduct')

})


router.get('/viewreply',async(req,res)=>{

    const data= await complaintModel.find({user:req.session.userid}).populate({path:'product',populate:{path:'seller'}})
    console.log(data)
    res.render('viewreply',{data:data})
})


router.post('/addtocart/:id',async(req,res)=>{
    const productid=req.params.id
    const userid=req.session.userid
    const count=req.body.count

    const cartdata={
        product:productid,
        user:userid,
        count:count
    }

    const savedata=new cartModel(cartdata)
    savedata.save()
    res.redirect('/user/viewproduct')
    
})


router.get('/viewcart',async (req,res)=>{
    const userid=req.session.userid
    

    const data=await cartModel.find({user:userid}).populate({path:'product',populate:{path:'seller'}})
     
    res.render('viewcart',{data:data})
}) 

router.get('/removecart/:id',async (req,res)=>{
    const itemid=req.params.id
    await cartModel.findOneAndDelete({_id:itemid})
    res.redirect('/user/viewcart')
})


router.post('/placeorder',async (req,res)=>{
    const userid=req.session.userid
    
    
    const data=await cartModel.find({user:userid}).populate('product')
     for (const cartitem of data) {
     const datatosave = new orderModel({
      product: cartitem.product._id,
      user: userid,
      count: cartitem.count,
      price: Number(cartitem.count * cartitem.product.price)
    });

    await datatosave.save(); 
    await cartModel.deleteMany({user:userid})
    
  }


     
     res.redirect('/user/viewcart')
})


router.post('/order',(req,res)=>{
const id=req.body.id
const count=req.body.count
const orderdata={
    product:id,
    user:req.session.userid,
    count:count,
    
   
}

const savedata=new orderModel(orderdata)
savedata.save()
res.redirect('/user/viewproduct')

})

module.exports=router