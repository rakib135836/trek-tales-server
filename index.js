const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;
// 1
// middleWire
app.use(cors());


// 2
// app.use(cors (
//   {
//   origin:["http://localhost:5173/"],
//   credentials:true
//   }
//   ))


// 3
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "http://localhost:5173");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });


// 4

// const  corsOptions={
//   origin:"*",
//   methods:["GET","PUT","PATCH","DELETE","OPTIONS"],
//   allowedHeaders:["Content-Type"],
// }

// app.use(cors(corsOptions));
// app.options("*",cors(corsOptions));

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
  

    const spotCollection = client.db('spotDB').collection('spot');

// new collection for country section 
   const countryCollection =client.db('countryDB').collection('country')


// getting countries


    app.get('/countries',async(req,res)=>{
      const cursor=countryCollection.find();
      const result=await cursor.toArray();
      res.send(result);
    })


    app.get('/new-spot', async (req, res) => {
      const cursor = spotCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

    // email query

    app.get('/spots-by-email/:email', async (req, res) => {

      console.log(req.params.email)
      const result = await spotCollection.find({ email: req.params.email }).toArray();
      res.send(result)
    });


    // id query for update

    app.get('/new-spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.findOne(query);
      res.send(result);
    })

    app.post('/new-spot', async (req, res) => {
      const newTouristSpot = req.body;
      console.log(newTouristSpot);
      const result = await spotCollection.insertOne(newTouristSpot);
      res.send(result);
    })


   
    


    app.put('/new-spot/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const options = { upsert: true };
      const updatedSpot=req.body;
      const spot = {
        $set: {
          image: updatedSpot.image,
          spotName: updatedSpot.spotName,
          countryName: updatedSpot.countryName,
          location: updatedSpot.location,
          shortDescription: updatedSpot.shortDescription,
           averageCost: updatedSpot.averageCost,
          seasonality: updatedSpot.seasonality,
          travelTime: updatedSpot.travelTime,
          visitors: updatedSpot.visitors,
        }
      }

      const result=await spotCollection.updateOne( filter,spot,options)
      res.send(result)

    })

    app.delete('/new-spot/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await spotCollection.deleteOne(query);
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