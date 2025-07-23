const express = require("express");
const User = require("../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middlewares/auth");

const authRouter = express.Router();

//post method - API Call for Signup
authRouter.post("/api/signup", async (req, res) => {
    try {
         //step 1 - get the data or request from the client
    //const {name, email, password} = req.body;
    const {name, email, password} = req.body;
    //check there exists any user or not 
    const existingUser = await User.findOne({ email });
    if(existingUser) { // if user exists 
        return res.status(400).json({msg: "This user is already exists"});
    }
    const hashedPassword = await bcryptjs.hash(password, 8);
    let user = new User({
        name,
        email, 
        password: hashedPassword
    });
    //step 2 - post the data into database
    user = await user.save();
    //step 3 - return the data to the user
    return res.json(user);
    } catch(e){
        res.status(500).json({error : e.message});
    }
});

// Sign-in route
authRouter.post("/api/signin", async (req, res) => {
    try {
        const { email, password } = req.body;
        //check for valid user
        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({msg: "User with this email does not exist"});
        }
        const isSame = await bcryptjs.compare(password, user.password);
        if(!isSame) {
            return res.status(400).json({msg: "Password entered is incorrect"});
        }
        //temporary private key
        const token = jwt.sign({id: user._id}, "passwordKey");
        res.json({token, ...user._doc});
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// validate user token
authRouter.post("/validToken", async (req, res) => {
    try {
        const token = req.header("x-auth-token");
        if(!token) return res.json(false);
        // verify using json web token (jwt)
        const verified = jwt.verify(token, "passwordKey");
        if(!verified) return res.json(false);

        // check user exists or not
        const user = await User.findById(verified.id);
        if(!user) return res.json(false);
        res.json(true);
    } catch(e) {
        res.status(500).json({error: e.message});
    }
});

// get user data
authRouter.get("/", auth, async (req, res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

//to make variables visible to all other files
module.exports = authRouter;