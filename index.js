//initialize express.js
const express = require('express');
const mongoose = require('mongoose');

//import form other files (.js is not mandatory as an extension)
const authRouter = require("./routes/auth");
const adminRouter = require('./routes/admin');
const productRouter = require('./routes/product');
const userRouter = require('./routes/user');

//INIT process
const app = express();      
const PORT = process.env.PORT || 3000;
const DB = "mongodb+srv://sasanka:sasanka321@cluster0.d6gu8r4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

//set middleware (Mostly format the data or update the data as per client request)
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//set up mongoDB connection
mongoose.connect(DB).then(
    () => {
        console.log("Connection successful");
    }
).catch((e) => {
    console.log(e);
});

//we have to use specific models to validate users details

//get, post, put, delete, update - CRUD operations (server)
//creating an a
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Connected successfully on port ${PORT}`);
})