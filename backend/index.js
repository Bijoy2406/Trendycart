const Joi = require('joi');
const passwordComplexity = require('joi-password-complexity');
const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const bcrypt = require("bcrypt");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
require('dotenv').config();

const app = express();
const port = 4001;

// Validation functions
const signUpBodyValidation = (body) => {
    const schema = Joi.object({
        name: Joi.string().required().label("User Name"),
        email: Joi.string().email().required().label("Email"),
        password: passwordComplexity().required().label("Password"),
    });
    return schema.validate(body);
};

const logInBodyValidation = (body) => {
    const schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
    });
    return schema.validate(body);
};

const refreshTokenBodyValidation = (body) => {
    const schema = Joi.object({
        refreshToken: Joi.string().required().label("Refresh Token"),
    });
    return schema.validate(body);
};

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose.connect("mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
});

// Cloudinary Configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Routes
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
        success: true,
        image_url: req.file.path
    });
});

const productSchema = new mongoose.Schema({
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

const Product = mongoose.model("Product", productSchema);

app.post('/addproduct', async (req, res) => {
    try {
        const products = await Product.find({});
        const id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const newProduct = new Product({
            id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
        });

        await newProduct.save();

        console.log("Product saved successfully");
        res.json({
            success: true,
            message: "Product added successfully",
            product: newProduct
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
        const result = await Product.findOneAndDelete({ id: req.body.id });
        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        console.log("Product removed successfully");
        res.json({
            success: true,
            message: "Product removed successfully",
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
        const products = await Product.find({});
        console.log("All products fetched.");
        res.json(products);
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
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    cartData: {
        type: Object,
        default: {}
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "boss"],
        default: ["user"]
    },
    data: {
        type: Date,
        default: Date.now
    }
});

const userTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d',
    },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

app.post("/signup", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }

        const existingUser = await Users.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: true, message: "User with given email already exists" });
        }

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        const cart = {};
        for (let i = 0; i < 300; i++) {
            cart[i] = 0;
        }

        const user = new Users({
            name: req.body.name,
            email: req.body.email,
            password: hashPassword,
            cartData: cart,
        });

        await user.save();

        const data = { user: { id: user._id } };

        res.status(201).json({ error: false, message: "Account created successfully", data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

app.post("/login", async (req, res) => {
    try {
        const { error } = logInBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message });
        }

        const user = await Users.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        const verifiedPassword = await bcrypt.compare(req.body.password, user.password);
        if (!verifiedPassword) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in successfully",
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: true, message: "Internal Server Error" });
    }
});

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_PRIVATE_KEY, { expiresIn: "14m" });
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_PRIVATE_KEY, { expiresIn: "30d" });

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return { accessToken, refreshToken };
    } catch (err) {
        console.error("Error generating tokens:", err);
        throw err;
    }
};

app.get('/newcollections', async (req, res) => {
    try {
        const products = await Product.find({});
        const newCollection = products.slice(-8);
        console.log("New collection fetched");
        res.json(newCollection);
    } catch (error) {
        console.error("Error fetching new collection:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching new collection",
        });
    }
});

app.get('/popularinwomen', async (req, res) => {
    try {
        const products = await Product.find({ category: "women" });
        const popularInWomen = products.slice(0, 4);
        console.log("Popular in women fetched");
        res.json(popularInWomen);
    } catch (error) {
        console.error("Error fetching popular in women:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching popular in women",
        });
    }
});

const fetchUser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).json({ error: "No Token Provided" });
    }
    try {
        const data = jwt.verify(token, process.env.ACCESS_TOKEN_PRIVATE_KEY);
        req.user = data;
        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid Token" });
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findById(req.user._id);
        userData.cartData[req.body.itemId] = (userData.cartData[req.body.itemId] || 0) + 1;
        await userData.save();
        res.json({ success: true, message: "Item added to cart" });
    } catch (error) {
        console.error("Error adding to cart:", error);
        res.status(500).json({
            success: false,
            message: "Error adding to cart",
        });
    }
});

app.post('/removefromcart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findById(req.user._id);
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
            if (userData.cartData[req.body.itemId] === 0) {
                delete userData.cartData[req.body.itemId];
            }
        }
        await userData.save();
        res.json({ success: true, message: "Item removed from cart" });
    } catch (error) {
        console.error("Error removing from cart:", error);
        res.status(500).json({
            success: false,
            message: "Error removing from cart",
        });
    }
});

app.post('/rateproduct', fetchUser, async (req, res) => {
    const { productId, rating } = req.body;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
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

app.get('/userrating', fetchUser, async (req, res) => {
    const { productId } = req.query;
    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }
        const userRating = product.ratings.find(r => r.user.equals(req.user._id));
        res.json({ success: true, rating: userRating ? userRating.rating : 0 });
    } catch (error) {
        console.error('Error fetching user rating:', error);
        res.status(500).json({ success: false, message: 'Error fetching user rating' });
    }
});

app.post('/getcart', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findById(req.user._id);
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart data' });
    }
});

app.get('/profile', fetchUser, async (req, res) => {
    try {
        const userData = await Users.findById(req.user._id);
        res.json(userData);
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ success: false, message: 'Error fetching profile' });
    }
});

app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});
