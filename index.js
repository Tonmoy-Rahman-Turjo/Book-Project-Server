const express = require('express');
const cors = require('cors');
require('dotenv').config()
const cookiperseer = require('cookie-parser')
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||5000;
// app.use(cors())
app.use(cors({
  origin:[
    'http://localhost:5175', 'https://assingemt-elevent-server-site.vercel.app'
  ],
  credentials: true
}))
app.use(express.json())
app.use(cookiperseer())
const jwt =require('jsonwebtoken')

// console.log(process.env.DB_USER)
// console.log(process.env.DB_USER)
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qe87fgi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;



// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  
const loger= (req, res, next)=>{
  console.log('log: info',req.method, req.url)
  next();
}
const veryfiToken = (req, res, next)=>{
  const token = req?.cookies?.token;
  console.log('token in the midelwer', token)
  if(!token){
    return res.status(401).send({message: 'unuthorize access'})
  }
  jwt.verify(token, process.env.ECCESS_TOKEN_SEC, (err, decoded) =>{
    if(err){
      return res.status(401).send({message: 'unuthorize access'})
    }
    res.user = decoded;
    next()
  })

  next();
}
  try {

      const bookWorld = client.db('book').collection('books')
      const categoryBook = client.db('book').collection('booksCategory')
      const borrow = client.db('book').collection('borrows')

        // app.post("/jwt" , async(req, res)=>{
        //   const user= req.body
        //   // console.log('user for token', user)
        //   const token = jwt.sign(user,process.env.ECCESS_TOKEN_SEC, {expiresIn:'1h'})
        //   res.cookie('token', token,{  httpOnly: true,
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",}).send({success:true})
        //     // res.send({token})

        // })
        // app.post('/addbook', loger,veryfiToken, async(req, res)=>{
        //   console.log('mama cookis', req.user)
        //     const addbook = req.body;
        //       const result =  await bookWorld.insertOne(addbook)
        //       res.send(result)
        // })
        // app.get('/allbook', loger, veryfiToken, async(req, res)=>{
        //   console.log('mama cookis', req.user)
    
          
        //     const lopall = bookWorld.find()
        //     const result = await lopall.toArray()
        //      res.send(result)
        // })
        // app.post('/logout', async (req, res)=>{
        //   const user = req.body;
        //   // console.log('login out user', user)
        //   res.clearCookie('token', {maxAge: 0} ).send({success: true})
        // })

    app.post('/addbook',  async(req, res)=>{
      // console.log('mama cookis', req.user)
        const addbook = req.body;
          const result =  await bookWorld.insertOne(addbook)
          res.send(result)
    })
    app.get('/allbook',async(req, res)=>{
     

      
        const lopall = bookWorld.find()
        const result = await lopall.toArray()
         res.send(result)
    })
    app.get('/category', async(req, res)=>{
      const quary = categoryBook.find()
      const result = await quary.toArray()
      res.send(result)
    })
   app.get('/category/:category', async (req, res)=>{
    const categoryName = req.params.category
    const filter ={
      category: categoryName
    }
    const quary = bookWorld.find(filter)
    const result = await quary.toArray()
    res.send(result)
   })
    app.get('/update/:id', async (req, res) =>{
       const result = await bookWorld.findOne({_id: new ObjectId(req.params.id)})
       res.send(result)
    })
    app.put('/updates/:id', async (req, res)=>{
      
        const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert: true}
      const updated = req.body;
        const data ={
          $set:{
            photourl:updated.photourl,
             author:updated.author,
             category:updated.category, 
              rating:updated.rating, 
              name:updated.name,
               
          }
        }
        const result= await bookWorld.updateOne(filter, data,  options)
        res.send(result)
        // console.log(result)
       
      })
      app.get('/allbook/:id', async (req, res) =>{
        const id = req.params.id;
        console.log(id)
        const quary = {_id: new ObjectId(id)}
        const resutl = await bookWorld.findOne(quary)
        res.send(resutl)
        // console.log(resutl)

      })
      app.post('/borrow', async(req, res)=>{
        const quary = req.body;
        const result= await  borrow.insertOne(quary)
        res.send(result)
      })
      // app.get('/borrows', async (req, res)=>{
      app.get('/borrows/:email', async (req, res)=>{

        const all = borrow.find({email:req.params.email})
        const result = await all.toArray()
        res.send(result)
      })
      app.delete('/delete/:id', async(req, res)=>{
        const resutl = await borrow.deleteOne({_id: new ObjectId(req.params.id)})
        res.send(resutl)
      })
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);







app.get('/', (req, res)=>{
    res.send('book server is runing succesfully')
})
app.listen(port, ()=>{
   console.log(`book server is runing: ${port}`)
})