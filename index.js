const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjhllfd.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        const taskCollection = client.db('taskManagement').collection('myTask');
        const mediaTaskCollection = client.db('taskManagement').collection('mediaTask');
        
        app.post('/mytasks', async (req, res) => {
            const myTasks = req.body;
            const result = await taskCollection.insertOne(myTasks);
            res.send(result);
        });

        app.post('/mediatasks', async (req, res) => {
            const media = req.body;
            const result = await mediaTaskCollection.insertOne(media);
            res.send(result);
        })
    }
    finally{

    }
}
run().catch(err => console.error(err));

app.get('/', async (req, res) => {
    res.send('Task Management server is running');
})

app.listen(port, () => console.log(`Task Management running on ${port}`))