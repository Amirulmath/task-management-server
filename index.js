const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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

        app.get('/mytasks', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const myTasks = await taskCollection.find(query).toArray();
            res.send(myTasks);
        });

        app.get('/alltasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });
        
        app.post('/alltasks', async (req, res) => {
            const tasks = req.body;
            const result = await taskCollection.insertOne(tasks);
            res.send(result);
        });

        app.delete('/alltasks/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await taskCollection.deleteOne(query);
            res.send(result);
        });

        app.get('/mymedia', async (req, res) => {
            const email = req.query.email;
            const query = { email: email };
            const mediaTask = await mediaTaskCollection.find(query).toArray();
            res.send(mediaTask);
        });

        app.get('/mediatasks', async (req, res) => {
            const query = {};
            const cursor = mediaTaskCollection.find(query);
            const media = await cursor.toArray();
            res.send(media);
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