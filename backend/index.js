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
const { Schema } = mongoose;
require('dotenv').config();

app.use(express.json());
app.use(cors());

mongoose.connect("mongodb+srv://labibfarhan285:CR7@cluster0.m7lnrxb.mongodb.net/TRANDYCART", {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.log("Error connecting to MongoDB:", err);
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

const productSchema = new Schema({
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
        user: { type: Schema.Types.ObjectId, ref: 'Users' },
        rating: { type: Number, required: true }
    }],
    averageRating: { type: Number, default: 0 }
});

const Product = mongoose.model("Product", productSchema);

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

const userSchema = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    cartData: {
        type: Object,
        default: {}
    },
    roles: {
        type: [String],
        enum: ["user", "admin", "boss"],
        default: ["user"],
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const Users = mongoose.model('Users', userSchema);

const userTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: '30d',  // Token will automatically be removed after 30 days
    },
});

const UserToken = mongoose.model('UserToken', userTokenSchema);

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

        const data = {
            user: {
                id: user.id
            }
        };

        const token = jwt.sign(data, 'secret_ecom');
        res.json({ success: true, token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({
            success: false,
            message: "Error during signup",
        });
    }
});

app.post('/login', async (req, res) => {
    try {
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
                res.status(400).json({ success: false, errors: "Wrong Password" });
            }
        } else {
            res.status(400).json({ success: false, errors: "Wrong email" });
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({
            success: false,
            message: "Error during login",
        });
    }
});

const generateTokens = async (user) => {
    try {
        const payload = { _id: user._id, roles: user.roles };
        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });
        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newCollection = products.slice(-8);
        console.log("New collection fetched");
        res.send(newCollection);
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
        let products = await Product.find({ category: "women" });
        let popularInWomen = products.slice(0, 4);
        console.log("Popular in women fetched");
        res.send(popularInWomen);
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
        return res.status(401).send({ error: "No Token Provided" });
    }
    try {
        const data = jwt.verify(token, 'secret_ecom');
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({ errors: "Invalid Token" });
    }
};

app.post('/addtocart', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
        userData.cartData[req.body.itemId] += 1;
        await userData.save();
        res.send("Added");
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
        let userData = await Users.findById(req.user.id);
        if (userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }
        await userData.save();
        res.send("Removed");
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
    try {
        let userData = await Users.findById(req.user.id);
        res.json(userData.cartData);
    } catch (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart data' });
    }
});

app.get('/profile', fetchUser, async (req, res) => {
    try {
        let userData = await Users.findById(req.user.id);
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
