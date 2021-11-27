const express = require('express')
const { MongoClient } = require('mongodb');
const app = express()
const cors = require('cors');
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gegfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// console.log(uri)
async function run() {
    try {
        await client.connect();
        const database = client.db("watch_Shop");
        const productsCollection = database.collection("products");
        const handleAddToCartCollection = database.collection("handleAddToCarts");
        const reviewsConllention = database.collection("reviews");
        const usersCollection = database.collection("users");


        app.get('/handleAddToCarts', async (req, res) => {
            const email = req.query;
            const query = { email: email };
            // console.log(email)
            const cursor = handleAddToCartCollection.find({});
            const handleAddToCart = await cursor.toArray();
            // console.log(handleAddToCart)
            res.json(handleAddToCart);
        });
        app.delete('/handleAddToCarts/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: id };
            const result = await handleAddToCartCollection.deleteOne(query)
            // console.log(result)
            // console.log('deleting user', id);
            res.json(result)
        })

        app.get('/reviews', async (req, res) => {
            const cursor = reviewsConllention.find({})
            const result = await cursor.toArray();
            res.json(result)
        })
        app.get('/products', async (req, res) => {
            const cursor = productsCollection.find({})
            const result = await cursor.toArray();
            res.json(result)
        })

        app.post("/products", async (req, res) => {

            const newProduct = req.body;
            const result = await productsCollection.insertOne(newProduct);
            res.json(result)

            // res.json(message, "hellop")

        })
        app.post("/reviews", async (req, res) => {

            const newProddactAdd = req.body;
            const result = await reviewsConllention.insertOne(newProddactAdd);
            // console.log(result)
            res.json(result)

            // res.json(message, "hellop")

        })
        app.post("/handleAddToCarts", async (req, res) => {
            const handleAddToCart = req.body;
            const result = await handleAddToCartCollection.insertOne(handleAddToCart)

            // console.log(result)
            res.json(result)

        });
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            let isAdmin = false;
            if (user?.role === 'admin') {
                isAdmin = true;
            }
            console.log(isAdmin)
            res.json({ admin: isAdmin });
        })

        app.post('/users', async (req, res) => {
            const user = req.body;
            // console.log(user)
            const result = await usersCollection.insertOne(user)
            // console.log(result)
            res.json(result);
        });
        app.put('/users', async (req, res) => {
            const user = req.body;
            const filter = { email: user.email };
            const options = { upsert: true };
            const updateDoc = { $set: user };
            const result = await usersCollection.updateOne(filter, updateDoc, options);
            res.json(result)
        })

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
            console.log("put", user)
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc)
            res.json(result);
        })


    }
    finally {
        // await client.close();
        // console.log('database connected susscessfully')

    }
}
run(console.dir)


app.get('/', (req, res) => {
    res.send('Hello World! ')
})

app.listen(port, () => {
    console.log(`Example off simple watch  ${port}`)
})