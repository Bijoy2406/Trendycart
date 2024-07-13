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

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.get("/", (req, res) => {
    res.send("Express App is running");
});

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Multer to use Cloudinary for storage
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'some-folder-name',
        format: async (req, file) => path.extname(file.originalname).substring(1), // supports promises as well
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

app.get('/allproducts', async (req, res) => {
    let products = await Product.find({});
    console.log("All product fetched.");
    res.send(products);
});

const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartData: Object,
    refreshToken: String,
    date: { type: Date, default: Date.now }
});

const RefreshTokenSchema = new mongoose.Schema({
    userId: mongoose.Schema.Types.ObjectId,
    token: String,
    expiryDate: Date
});

const Users = mongoose.model('Users', UserSchema);
const RefreshTokens = mongoose.model('RefreshTokens', RefreshTokenSchema);

const generateToken = (user) => {
    const data = {
        user: {
            id: user.id
        }
    };
    const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

    return token;
};

const generateRefreshToken = async (user) => {
    const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_SECRET, { expiresIn: '7d' });
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 7);

    const newRefreshToken = new RefreshTokens({
        userId: user.id,
        token: refreshToken,
        expiryDate: expiryDate
    });
    await newRefreshToken.save();
    return refreshToken;
};

// Creating endpoint for registering the user
app.post('/signup', async (req, res) => {
    try {
        // Check if the username is already in use
        let checkUsername = await Users.findOne({ name: req.body.username });
        if (checkUsername) {
            return res.status(400).json({ success: false, errors: "Username already in use" });
        }

        // Check if the email is already in use
        let checkEmail = await Users.findOne({ email: req.body.email });
        if (checkEmail) {
            return res.status(400).json({ success: false, errors: "Email already in use" });
        }

        let cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);

        // Create a new user
        const user = new Users({
            name: req.body.username,
            email: req.body.email,
            password: hashedPassword,
            cartData: cart,
        });

        // Save the new user
        await user.save();

        // Generate access and refresh tokens
        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

        const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

        // Save the refresh token in the database
        user.refreshToken = refreshToken;
        await user.save();

        // Respond with the tokens
        res.json({ success: true, token, refreshToken });
    } catch (error) {
        if (error.code === 11000) {
            // Duplicate key error (should only occur for email)
            return res.status(400).json({ success: false, errors: "Email already in use" });
        }
        // Other errors
        return res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// User login
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

            const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

            const refreshToken = jwt.sign(data, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });

            user.refreshToken = refreshToken;
            await user.save();

            res.json({ success: true, token, refreshToken });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email" });
    }
});

// Refresh token endpoint
app.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(401).json({ success: false, errors: "Refresh token required" });
    }

    try {
        const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Users.findById(userData.user.id);

        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ success: false, errors: "Invalid refresh token" });
        }

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ success: true, token });
    } catch (error) {
        res.status(403).json({ success: false, errors: "Invalid refresh token" });
    }
});

// Logout endpoint to invalidate refresh tokens
app.post('/logout', async (req, res) => {
    const { refreshToken } = req.body;

    try {
        const userData = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Users.findById(userData.user.id);

        if (user) {
            user.refreshToken = null;
            await user.save();
            res.json({ success: true });
        } else {
            res.status(403).json({ success: false, errors: "Invalid refresh token" });
        }
    } catch (error) {
        res.status(403).json({ success: false, errors: "Invalid refresh token" });
    }
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port ${port}`));
