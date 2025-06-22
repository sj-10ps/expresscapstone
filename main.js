const express=require('express')
const cli=require('cli-color')

const db=require('./db/config')
const port=process.env.PORT|4000

const publicroute=require('./routes/public')
const userroute=require('./routes/user')
const sellerroute=require('./routes/seller')

const app=express()
db()
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))

const session=require('express-session')
app.use(
    session({
        secret:"sj",
        resave:true,
        saveUninitialized:true
    })
)


app.use('/',publicroute)    
app.use('/user',userroute)
app.use('/seller',sellerroute)

app.listen(port,(req,res)=>{
    console.log(cli.red(`http://localhost:${port}`))
})