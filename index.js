const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const user = process.env.DB_USER;
const pass = process.env.DB_PASS;

const uri = `mongodb+srv://${user}:${pass}@cluster0.hdpgq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();

        const database = client.db('camzone');
        const productsCollection = database.collection('products');
        const ordersCollection = database.collection('orders');

        //GET products API
        app.get('/explore', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        })

        //GET products API for home
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.limit(6).toArray();
            res.send(products);
        })

        //POST order API
        app.post('/orders', async (req, res) => {
            const order = req.body;
            console.log('Hit the post API', order);

            const result = await ordersCollection.insertOne(order);
            console.log(result);

            res.json(result);
        })

        //GET orders API
        app.get('/orders', async (req, res) => {
            const cursor = ordersCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders);
        })

        //DELETE order API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Running camzone server...');
})

app.listen(port, () => {
    console.log('Running camzone server on port', port);
})