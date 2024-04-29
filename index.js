const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app=express();
const port=process.env.PORT||5000;

// middleWire
app.use(cors());
app.use(express.json());






// ---------- data base ---------------









const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qtepxet.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
console.log(uri)
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
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const spotCollection=client.db('spotDB').collection('spot');


    app.get('/new-spot',async(req,res)=>{
      const cursor=spotCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })

    // email query

    app.get('/spots-by-email/:email', async (req, res) => {

      console.log(req.params.email)
     const result=await spotCollection.find({email:req.params.email}).toArray ();
     res.send(result)
  });

    app.post('/new-spot',async(req,res)=>{
     const newTouristSpot=req.body;
     console.log(newTouristSpot);
     const result=await spotCollection.insertOne(newTouristSpot);
     res.send(result);
    })

    app.delete('/new-spot/:id',async(req,res)=>{
      const id=req.params.id;
      const query={_id: new ObjectId(id)}
      const result=await spotCollection.deleteOne(query);
      res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);






// -------------------------




app.get('/', (req, res) => {
    res.send('server is runnig')
  })
  
  app.listen(port, () => {
    console.log(`server is running in port: ${port}`)
  })