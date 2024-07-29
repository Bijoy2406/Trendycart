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

mongoose.connect("mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

app.get("/", (req, res) => {
    res.send("Express App is running");
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'some-folder-name',
        format: async (req, file) => path.extname(file.originalname).substring(1),
        public_id: (req, file) => `${file.fieldname}_${Date.now()}`

    },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: req.file.path
    });
});

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
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
        rating: { type: Number, required: true }
    }],
    averageRating: { type: Number, default: 0 }
});

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

app.post('/remove', async (req, res) => {
    await Product.findOneAndDelete({ id: req.body.id });
    console.log("Removed");
    res.json({
        success: true,
        name: req.body.name
    });
});

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All product fetched.");
    res.send(products);
});

const Users = mongoose.model('Users', {
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
    },
    data: {
        type: Date,
        default: Date.now,
    },
});

import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Users from '../models/User.js';
import { signUpBodyValidation } from '../utils/validationSchema.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
    try {
        // Validate request body
        const { error } = signUpBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ success: false, errors: error.details[0].message });
        }

        // Normalize email and username (convert to lowercase and trim)
        const normalizedEmail = req.body.email.trim().toLowerCase();
        const normalizedUsername = req.body.username.trim().toLowerCase();

        // Check if username is already in use
        const checkUsername = await Users.findOne({ name: normalizedUsername });
        if (checkUsername) {
            return res.status(400).json({ success: false, errors: "Username already in use" });
        }

        // Check if email is already in use
        const checkEmail = await Users.findOne({ email: normalizedEmail });
        if (checkEmail) {
            return res.status(400).json({ success: false, errors: "Email already in use" });
        }

        // Create cart data with default values
        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create new user
        const user = new Users({
            name: normalizedUsername,
            email: normalizedEmail,
            password: hashedPassword,
            cartData: cart,
        });

        // Save user to database
        await user.save();

        // Generate JWT token
        const data = {
            user: {
                id: user._id,
            }
        };
        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });

    } catch (error) {
        // Handle specific errors if necessary
        if (error.code === 11000) {  // Duplicate key error
            return res.status(400).json({ success: false, errors: "Email already in use" });
        }

        // General error
        console.error("Sign-up error:", error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

export default router;


app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            const data = {
                user: {
                    id: user.id
                }
            };
            const token = jwt.sign(data, 'secret_ecom');
            res.json({ success: true, token });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email" });
    }
});

app.get('/newcollections', async (req, res) => {
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("New collection fetched");
    res.send(newcollection);
});

app.get('/polpularinwoman', async (req, res) => {
    let products = await Product.find({ category: "women" });
    let polpular_in_woman = products.slice(0, 4);
    console.log("Popular in woman fetched");
    res.send(polpular_in_woman);
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "No Token Provided" });
    } else {
        try {
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Invalid Token" });
        }
    }
};



app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Addtocart", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});
// Rate product endpoint
app.post('/rateproduct', fetchUser, async (req, res) => {
    const { productId, rating } = req.body;
    try {
        const product = await Product.findById(productId);
        const userRatingIndex = product.ratings.findIndex(r => r.user.equals(req.user.id));
        if (userRatingIndex !== -1) {
            product.ratings[userRatingIndex].rating = rating;
        } else {
            product.ratings.push({ user: req.user.id, rating });
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

// Get user rating endpoint
app.get('/userrating', fetchUser, async (req, res) => {
    const { productId } = req.query;
    try {
        const product = await Product.findById(productId);
        const userRating = product.ratings.find(r => r.user.equals(req.user.id));
        res.json({ success: true, rating: userRating ? userRating.rating : 0 });
    } catch (error) {
        console.error('Error fetching user rating:', error);
        res.status(500).json({ success: false, message: 'Error fetching user rating' });
    }
});

app.post('/getcartitems', fetchUser, async (req, res) => {
    const user = await Users.findOne({ _id: req.user.id });
    let cartItems = {};
    for (const [key, value] of Object.entries(user.cartData)) {
        if (value > 0) {
            cartItems[key] = value;
        }
    }
    res.json(cartItems);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


app.post('/addtocart', fetchUser, async (req, res) => {
    console.log("Addtocart", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    userData.cartData[req.body.itemId] += 1;
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Added");
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({ _id: req.user.id });
    if (userData.cartData[req.body.itemId] > 0) {
        userData.cartData[req.body.itemId] -= 1;
    }
    await Users.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
    res.send("Removed");
});
// Rate product endpoint
app.post('/rateproduct', fetchUser, async (req, res) => {
    const { productId, rating } = req.body;
    try {
        const product = await Product.findById(productId);
        const userRatingIndex = product.ratings.findIndex(r => r.user.equals(req.user.id));
        if (userRatingIndex !== -1) {
            product.ratings[userRatingIndex].rating = rating;
        } else {
            product.ratings.push({ user: req.user.id, rating });
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

// Get user rating endpoint
app.get('/userrating', fetchUser, async (req, res) => {
    const { productId } = req.query;
    try {
        const product = await Product.findById(productId);
        const userRating = product.ratings.find(r => r.user.equals(req.user.id));
        res.json({ success: true, rating: userRating ? userRating.rating : 0 });
    } catch (error) {
        console.error('Error fetching user rating:', error);
        res.status(500).json({ success: false, message: 'Error fetching user rating' });
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    console.log("GetCart");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData.cartData);
});

app.get('/profile', fetchUser, async (req, res) => {
    console.log("Get Profile");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData);
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
