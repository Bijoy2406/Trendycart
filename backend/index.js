require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require('bcryptjs');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const port = process.env.PORT || 4001;


app.use(express.json());
app.use(cors());


mongoose.connect(process.env.MONGO_URI);


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'some-folder-name',
        format: async (req, file) => path.extname(file.originalname).substring(1), // supports promises as well
        public_id: (req, file) => `${file.fieldname}_${Date.now()}` // Use template literals for string interpolation
    },
});

const upload = multer({ storage: storage });

// Routes
app.get("/", (req, res) => {
    res.send("Express App is running");
});

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: req.file.path
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

app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
        });
        await user.save();

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET);
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error registering user" });
    }
});
//user login
app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passwordMatch = await bcrypt.compare(req.body.password, user.password);
            if (passwordMatch) {
                const data = {
                    user: {
                        id: user.id
                    }
                };
                const token = jwt.sign(data, process.env.JWT_SECRET);
                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong email" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Error logging in user" });
    }

});


app.post('/addtocart', async (req, res) => {
    try {
        const { itemId } = req.body; // Ensure correct parsing of itemId from JSON body
        console.log(itemId); // Log to check the received itemId
        
        // Handle your logic to add to cart here
        
        res.json({ success: true, message: "Item added to cart successfully" });
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ success: false, message: "Error adding item to cart" });
    }
});


app.listen(port, () => console.log(`Server running on port ${port}`));