const express = require("express");
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config()
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const res = require("express/lib/response");

app.use(cors())
app.use(express.json()) 

// tryinggggg 


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.nnlxe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notestaker").collection("notes");
    app.get('/notes', async (req, res) => {
      const query = {}
      const cursor = notesCollection.find(query);
      const result = await cursor.toArray();
      res.send(result)
    })
    app.post('/note', async (req, res) => {
      const note = req.body
      const result = await notesCollection.insertOne(note);
      res.send(result)
    })

    app.put('/notes/:id', async (req, res) => {

      const id = req.params.id
      const data = req.body
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          userName: data?.userName,
          textData: data?.textData
        },
      };
      const result = await notesCollection.updateOne(filter, updateDoc, options);
      res.send(result)
    })

    app.delete('/notes/:id', async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) };
      const result = await notesCollection.deleteOne(query);
      res.send(result)
    })


  }
  finally {
  }
}
run().catch(console.dir);


app.get('/', (req, res) => { res.send('heyyyyyy bro i am back') })
app.listen(port, () => { console.log('listen to port', port) })

