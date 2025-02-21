const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

// task-manager
// task321


app.use(express.json()); // Middleware to parse JSON
app.use(cors());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.c3mzl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");

    const taskcollection = client.db('taskManage').collection('task')



const taskCollection = client.db("taskManage").collection("tasks");

// ✅ API to Add Task
app.post("/tasks", async (req, res) => {
    const { title, description, category } = req.body;
    const newTask = { title, description, category, timestamp: new Date() };
    const result = await taskCollection.insertOne(newTask);
    res.json({ message: "Task added!", taskId: result.insertedId });
});

// ✅ API to Get Tasks
app.get("/tasks", async (req, res) => {
    const tasks = await taskCollection.find().toArray();
    res.json(tasks);
});


app.put("/tasks/:id", async (req, res) => {
    const { id } = req.params;
    const { category } = req.body;

    const result = await taskCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { category } }
    );

    res.json({ message: "Task updated", modifiedCount: result.modifiedCount });
});




  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


// Sample in-memory database
app.get('/', (req,res)=> {
    res.json('server is running')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
