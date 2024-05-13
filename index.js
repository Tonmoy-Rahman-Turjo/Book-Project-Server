const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT ||5000;
app.use(cors())
app.use(express.json())


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
  try {
      const bookWorld = client.db('book').collection('books')
      const categoryBook = client.db('book').collection('booksCategory')
      const borrow = client.db('book').collection('borrows')
    app.post('/addbook', async(req, res)=>{
        const addbook = req.body;
          const result =  await bookWorld.insertOne(addbook)
          res.send(result)
    })
    app.get('/allbook', async(req, res)=>{
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
              name:updated.name, 
              cost:updated.cost,
               
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