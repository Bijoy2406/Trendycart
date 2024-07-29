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

mongoose.connect("mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB', err);
});

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
            let last_product = products[products.length - 1];
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
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Removed");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({
            success: false,
            message: "Error removing product",
        });
    }
});

app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All products fetched.");
        res.send(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching products",
        });
    }
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
    date: {
        type: Date,
        default: Date.now,
    },
});

app.post('/signup', async (req, res) => {
    try {
        let check = await Users.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "Existing user found with same email" });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);

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

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username,
            },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_LIFETIME || '1h' }
        );

        res.cookie("token", token, {
            maxAge: (process.env.JWT_LIFETIME || 3600) * 1000, // Lifetime in milliseconds
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        res.json({ success: true, token });
    } catch (error) {
        console.error("Error signing up:", error);
        res.status(500).json({
            success: false,
            message: "Error signing up",
        });
    }
});

app.post('/login', async (req, res) => {
    try {
        let user = await Users.findOne({ email: req.body.email });
        if (user) {
            const passCompare = await bcrypt.compare(req.body.password, user.password);
            if (passCompare) {
                const token = jwt.sign(
                    {
                        id: user.id,
                        username: user.username,
                    },
                    process.env.JWT_SECRET,
                    { expiresIn: process.env.JWT_LIFETIME || '1h' }
                );

                res.cookie("token", token, {
                    maxAge: (process.env.JWT_LIFETIME || 3600) * 1000, // Lifetime in milliseconds
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    path: "/",
                });

                res.json({ success: true, token });
            } else {
                res.json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.json({ success: false, errors: "Wrong email" });
        }
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({
            success: false,
            message: "Error logging in",
        });
    }
});

app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        console.log("New collection fetched");
        res.send(newcollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching new collections",
        });
    }
});

app.get('/popularinwoman', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" });
        let popular_in_woman = products.slice(0, 4);
        console.log("Popular in woman fetched");
        res.send(popular_in_woman);
    } catch (error) {
        console.error("Error fetching popular products in woman category:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching popular products in woman category",
        });
    }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "No Token Provided" });
    } else {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            req.user = data;
            next();
        } catch (error) {
            res.status(401).send({ errors: "Invalid Token" });
        }
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        console.log("Addtocart", req.body.itemId);
        let userData = await Users.findById(req.user.id);
        let userCart = userData.cartData;
        console.log(userCart, "userCart");
        let updatedCart = {
            ...userCart,
            [req.body.itemId]: req.body.noOfProducts
        };
        console.log("UpdatedCart", updatedCart);
        await Users.findByIdAndUpdate(req.user.id, { cartData: updatedCart });
        res.send({ updatedCart });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
        });
    }
});

app.post('/removecart', fetchUser, async (req, res) => {
    try {
        console.log("Removecart", req.body.itemId);
        let userData = await Users.findById(req.user.id);
        let userCart = userData.cartData;
        let updatedCart = {
            ...userCart,
            [req.body.itemId]: req.body.noOfProducts
        };
        console.log("UpdatedCart", updatedCart);
        await Users.findByIdAndUpdate(req.user.id, { cartData: updatedCart });
        res.send({ updatedCart });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({
            success: false,
            message: "Error removing from cart",
        });
    }
});

app.get('/fetchuser', fetchUser, async (req, res) => {
    try {
        let userdata = await Users.findById(req.user.id);
        res.send(userdata);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching user data",
        });
    }
});

app.listen(port, () => {
    console.log(`App is listening on port ${port}`);
});
