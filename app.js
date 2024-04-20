const connectDB= require("./config/db")
const express =require('express')
const app= express()
const PORT =process.env.PORT||3000
const User=require("./models/userModel")
connectDB();
const path = require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/login',async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({username:username, password:password});
    if (!user) {
        return res.status(404).send("User not found");
    }
    res.json({ username: user.username, role: user.role });
});



app.post('/signUp', async (req, res) => {
    const { username, password,  role } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        // Insert the new user if they don't exist
        await User.insertMany([req.body]); // Using an array as insertMany expects an array
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding user', error: error.message });
    }
});
app.listen(PORT, ()=>{
    console.log(`Listening on port ${PORT}`)
})