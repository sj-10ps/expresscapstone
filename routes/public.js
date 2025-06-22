

const express=require('express')



const usermodel=require('../models/user')
const router=express.Router()
const sellermodel=require('../models/seller')


router.use(express.static('media/product'))

router.get('/',(req,res)=>{

    const uname=req.session.uname
    
    res.render('home',{uname:uname})
})



router.get('/registration',(req,res)=>{
    res.render('registration')
})


router.post('/logpost',async (req,res)=>{
    const uname=req.body.uname
    const pword=req.body.pword

    req.session.uname=uname
    req.session.pword=pword

    const data=await usermodel.findOne({username:uname,password:pword})
    
    if(data){
        req.session.userid=data._id
        res.redirect('/user/')
    }else{
        res.redirect('/')
    }
       
   
})

router.post('/regpost',async (req,res)=>{
    const name=req.body.name
    const age=req.body.age
    const dob=req.body.dob
    const gender=req.body.gender
    const email=req.body.email
    const uname=req.body.uname
    const pword=req.body.pword

     const item={
        name:name,
        age:age,
        date:dob,
        email:email,
        gender:gender,
        username:uname,
        password:pword
    }

    const presence=usermodel.findOne({username:uname})
    

    

   
    
    if(presence){
        res.redirect('/registration')
    }else{
    const saveuser=new usermodel(item)

   
    await saveuser.save()

 
    res.redirect('/')
    }
    
})


router.get('/shop_reg',(req,res)=>{
    res.render('shopreg')
})

router.post('/shopregpost',async (req,res)=>{
    const name=req.body.name
    const place=req.body.place

    const uname=req.body.uname

    const pword=req.body.pword

    const data={
        name:name,
        place:place,
        username:uname,
        password:pword
    }

    const savedata=new sellermodel(data)
    await savedata.save()

    
    res.redirect('/shoplogin')
})

router.get('/shoplogin',(req,res)=>{
    res.render('shoplogin')
})

router.post('/shoplogpost',async(req,res)=>{
    const uname=req.body.uname
    const pword=req.body.pword
    
    const data=await sellermodel.findOne({username:uname,password:pword})

    req.session.shopid=data._id

    if (data){
        console.log( req.session.shopid);
        
        res.redirect('/shophome')
    }
       
})

router.get('/shophome',(req,res)=>{
    res.render('shophome')
})






module.exports=router


