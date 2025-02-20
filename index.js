const express = require("express");
const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5000;


app.use(express.json()); // Middleware to parse JSON

// Sample in-memory database
app.get('/', (req,res)=> {
    res.json('server is running')
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
