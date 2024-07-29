// server.js
const port = 4001;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect("mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART", {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Cloudinary Storage Configuration
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'some-folder-name',
        format: async (req, file) => path.extname(file.originalname).substring(1),
        public_id: (req, file) => `${file.fieldname}_${Date.now()}`
    },
});
const upload = multer({ storage: storage });

// Product Schema and Model
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
    ratings: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        rating: { type: Number, required: true }
    }],
    averageRating: { type: Number, default: 0 }
});

// User Schema and Model
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
        default: {}
    },
    data: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model('User', UserSchema);

// Generate tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign({ email: user.email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
    return { accessToken, refreshToken };
};

// Middleware to authenticate access token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Middleware to fetch user
const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "No Token Provided" });
    }
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).send({ error: "Invalid Token" });
    }
};

// Routes
app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Upload Route
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: req.file.path
    });
});

// Add Product Route
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id;

        if (products.length > 0) {
            let last_product_array = products.slice(-1);
            let last_product = last_product_array[0];
            id = last_product.id + 1;
        } else {
            id = 1;
        }

        const newProduct = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await newProduct.save();
        console.log("Saved");
        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error saving product:", error);
        res.status(500).json({
            success: false,
            message: "Error saving product",
        });
    }
});

// Remove Product Route
app.post('/remove', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
});

// Fetch All Products Route
app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All products fetched.");
    res.send(products);
});

// User Signup Route
app.post('/signup', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const tokens = generateTokens(user);
        res.json({ success: true, ...tokens });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// User Login Route
app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ success: false, message: "Invalid password" });

        const tokens = generateTokens(user);
        res.json({ success: true, ...tokens });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

// Refresh Token Route
app.post('/token', (req, res) => {
    const { refreshToken } = req.body;
    if (refreshToken == null) return res.sendStatus(401);

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);

        const tokens = generateTokens(user);
        res.json({ ...tokens });
    });
});

// Get New Collections Route
app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
});

// Get Popular Products in Women Category Route
app.get('/polpularinwoman', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let popular_in_woman = products.slice(0, 4);
    console.log("Popular in women fetched");
    res.send(popular_in_woman);
});

// Add to Cart Route
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Add to cart", req.body.itemId);
    let userData = await User.findOne({ _id: req.user._id });
    if (!userData.cartData[req.body.itemId]) {
        userData.cartData[req.body.itemId] = 0;
    }
    userData.cartData[req.body.itemId] += 1;
    await User.findOneAndUpdate({ _id: req.user._id }, { cartData: userData.cartData });
    res.send("Added");
});

// Remove from Cart Route
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("Remove from cart", req.body.itemId);
    let userData = await User.findOne({ _id: req.user._id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
        if (userData.cartData[req.body.itemId] === 0) {
            delete userData.cartData[req.body.itemId];
        }
    }
    await User.findOneAndUpdate({ _id: req.user._id }, { cartData: userData.cartData });
    res.send("Removed");
});

// Rate Product Route
app.post('/rateproduct', fetchUser, async (req, res) => {
    const { productId, rating } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const userRatingIndex = product.ratings.findIndex(r => r.user.equals(req.user._id));
        if (userRatingIndex !== -1) {
            product.ratings[userRatingIndex].rating = rating;
        } else {
            product.ratings.push({ user: req.user._id, rating });
        }
        const totalRatings = product.ratings.length;
        const sumOfRatings = product.ratings.reduce((acc, curr) => acc + curr.rating, 0);
        product.averageRating = totalRatings > 0 ? sumOfRatings / totalRatings : 0;
        await product.save();
        res.json({ success: true, averageRating: product.averageRating });
    } catch (error) {
        console.error('Error saving rating:', error);
        res.status(500).json({ success: false, message: 'Error saving rating' });
    }
});

// Get User Rating Route
app.get('/userrating', fetchUser, async (req, res) => {
    const { productId } = req.query;
    try {
        const product = await Product.findById(productId);
        if (!product) return res.status(404).json({ success: false, message: "Product not found" });

        const userRating = product.ratings.find(r => r.user.equals(req.user._id));
        res.json({ success: true, rating: userRating ? userRating.rating : 0 });
    } catch (error) {
        console.error('Error fetching user rating:', error);
        res.status(500).json({ success: false, message: 'Error fetching user rating' });
    }
});

// Get Cart Data Route
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Get Cart");
    let userData = await User.findOne({ _id: req.user._id });
    res.json(userData.cartData);
});

// Get User Profile Route
app.get('/profile', fetchUser, async (req, res) => {
    console.log("Get Profile");
    let userData = await User.findOne({ _id: req.user._id });
    res.json(userData);
});

// Start Server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
