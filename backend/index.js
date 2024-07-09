require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI);

app.get("/", (req, res) => {
    res.send("Express App is running");
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'upload/images');
    },
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });
app.use('/images', express.static('upload/images'));

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
});

const ProductSchema = new mongoose.Schema({
    id: Number,
    name: String,
    image: String,
    category: String,
    new_price: Number,
    old_price: Number,
    date: { type: Date, default: Date.now },
    available: { type: Boolean, default: true }
});

const Product = mongoose.model("Product", ProductSchema);

app.post('/addproduct', async (req, res) => {
    try {
        const { name, image, category, new_price, old_price } = req.body;
        const lastProduct = await Product.findOne().sort({ id: -1 });
        const id = lastProduct ? lastProduct.id + 1 : 1;

        const newProduct = new Product({ id, name, image, category, new_price, old_price });
        await newProduct.save();

        res.json({ success: true, name });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error saving product" });
    }
});

app.post('/remove', async (req, res) => {
    const { id } = req.body;
    await Product.findOneAndDelete({ id });
    res.json({ success: true, id });
});

app.get('/allproducts',async(req,res)=>{
   
    let products = await Product.find({});
    console.log("All product fetched.");
    res.send(products);


})

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now }
});

const Users = mongoose.model('Users', UserSchema);

//creating endpoint for registering the user

app.post('/signup', async(req,res)=>{
    let check = await Users.findOne({email:req.body.email});
    if (check) {
        return res.status(400).json({success:false,errors:"Existing user found with same email"})    
    }
    
    let cart = {};
    for (let i = 0; i < 300; i++) {
        cart[i]=0;       
    }
    const user = new Users({
        name:req.body.username,
        email:req.body.email,
        password:req.body.password,
        cartData:cart,
    })
    await user.save();

    const data ={
        user:{
            id:user.id
        }
    }

    const token = jwt.sign(data, process.env.JWT_SECRET);
    res.json({success:true,token})
})

//user login
app.post('/login',async (req,res)=>{
    let user = await Users.findOne({email:req.body.email});
    if (user) {
        const passCompare = req.body.password === user.password;
        if (passCompare) {
            const data = {
                user:{
                    id:user.id
                }
            }
            const token = jwt.sign(data, process.env.JWT_SECRET);
            res.json({success:true,token})
        }
        else{
            res.json({success:false,errors:"Wrong Password"});
        }
    }
    else{
        res.json({success:false,errors:"Wrong email"})
    }
})

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port ${port}`));
