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
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Task ID format" });
    }

    const { title, description, category } = req.body;
    const updateData = {};
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (category) updateData.category = category;

    try {
        const result = await taskCollection.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Task not found or no changes made" });
        }

        res.json({ message: "Task updated", modifiedCount: result.modifiedCount });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task" });
    }
});



app.put("/tasks/reorder", async (req, res) => {
    const { category, tasks } = req.body;

    try {
        for (const task of tasks) {
            if (!ObjectId.isValid(task._id)) {
                return res.status(400).json({ error: "Invalid Task ID format" });
            }
            await taskCollection.updateOne(
                { _id: new ObjectId(task._id) },
                { $set: { order: task.order } }
            );
        }

        res.status(200).json({ message: "Task order updated successfully" });
    } catch (error) {
        res.status(500).json({ error: "Failed to update task order" });
    }
});

  
  app.delete("/tasks/:id", async (req, res) => {
    await taskCollection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Task deleted" });
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
