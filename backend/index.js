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
        public_id: (req, file) => '${file.fieldname}_${Date.now()}'
    },
});

const upload = multer({ storage: storage });

//auth-token
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
        return res.status(401).send({ errors: "Invalid Token" });
    }
};


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
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    cartData: { type: Object },
    data: { type: Date, default: Date.now },
    isAdmin: { type: Boolean, default: false }, // New field for admin role
    isApprovedAdmin: { type: Boolean, default: false } 
});


app.post('/signup', async (req, res) => {
    let checkEmail = await Users.findOne({ email: req.body.email });
    if (checkEmail) {
        return res.status(400).json({ success: false, errors: "Existing user found with same email" });
    }

    let checkUsername = await Users.findOne({ name: req.body.username });
    if (checkUsername) {
        return res.status(400).json({ success: false, errors: "Existing user found with same username" });
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
        isAdmin: req.body.isAdmin || false,
    });

    await user.save();

    const data = {
        user: {
            id: user.id
        }
    };

    const token = jwt.sign(data, 'secret_ecom',{expiresIn:"10m"});
  
    res.json({ success: true, token});
});

// Login Endpoint
app.post('/login', async (req, res) => {
    let user = await Users.findOne({ email: req.body.email });
    if (user) {
        const passCompare = await bcrypt.compare(req.body.password, user.password);
        if (passCompare) {
            if (user.isAdmin && !user.isApprovedAdmin) {
                return res.json({ success: false, errors: "You are not approved as an admin yet." });
            }
            const data = {
                user: {
                    id: user.id,
                    isAdmin: user.isAdmin,
                    isApprovedAdmin: user.isApprovedAdmin,
                }
            };
            const token = jwt.sign(data, 'secret_ecom',{expiresIn:"10m"});
            const refreshtoken = jwt.sign(data, 'secret_recom',{expiresIn:"1d"});
            res.json({ success: true, token,refreshtoken });
        } else {
            res.json({ success: false, errors: "Wrong Password" });
        }
    } else {
        res.json({ success: false, errors: "Wrong email" });
    }
});

const authenticate = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Unauthorized');

    jwt.verify(token, 'secret_ecom', (err, user) => {
        if (err) return res.status(403).send('Forbidden');
        req.user = user;
        next();
    });
};

app.post("/token", (req, res) => {
    const { token: refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ success: false, errors: "No token provided" });

    jwt.verify(refreshToken, 'secret_recom', (err, user) => {
      if (err) return res.status(403).json({ success: false, errors: "Invalid token" });

      const newAccessToken = jwt.sign({
        user: {
          id: user.user.id,
          isAdmin: user.user.isAdmin,
          isApprovedAdmin: user.user.isApprovedAdmin
        }
      }, 'secret_ecom', { expiresIn: "10m" });

      res.json({ success: true, accessToken: newAccessToken });
    });
});

// Admin Approval Endpoint
app.put('/approveadmin/:email', fetchUser, async (req, res) => {
    try {
        const approvingAdmin = await Users.findById(req.user.id);
        if (!approvingAdmin.isAdmin || !approvingAdmin.isApprovedAdmin) {
            return res.status(403).json({ success: false, message: "Not authorized" });
        }

        const { isApprovedAdmin } = req.body;
        if (typeof isApprovedAdmin !== 'boolean') {
            return res.status(400).json({ success: false, message: "Invalid approval status" });
        }

        const user = await Users.findOneAndUpdate(
            { email: req.params.email },
            { isApprovedAdmin },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        res.json({ success: true, message: "Admin approval status updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Error updating admin approval status" });
    }
});






// Get User Role endpoint

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


app.get('/getUserRole', fetchUser, async (req, res) => {
    try {
        const user = await Users.findById(req.user.id);
        res.json({ isAdmin: user.isAdmin });
    } catch (error) {
        res.status(500).send({ error: "Error fetching user role" });
    }
});

app.post('/addtocart',fetchUser,async(req,res)=>{
    console.log("Addtocart",req.body.itemId);
    let userData =await Users.findOne({_id:req.user.id});
    userData.cartData[req.body.itemId] +=1;
    await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
    res.send("Added")

})
app.post('/removefromcart',fetchUser,async (req,res)=>{
  
    console.log("removed",req.body.itemId);
   let userData =await Users.findOne({_id:req.user.id});
   if(userData.cartData[req.body.itemId]>0)
   userData.cartData[req.body.itemId] -=1;
   await Users.findOneAndUpdate({_id:req.user.id},{cartData:userData.cartData});
   res.send("Removed")
  

})
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
    // Modify the existing '/allusers' endpoint
app.get('/allusers', fetchUser, async (req, res) => {
    try {
        const currentUserEmail = req.query.email; // Get the email of the logged-in user from the query parameter
        const users = await Users.find({ email: { $ne: currentUserEmail } }, 'name email isAdmin isApprovedAdmin'); // Exclude the logged-in user
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
});


});

app.get('/allusers', async (req, res) => {
    try {
        const users = await Users.find({}, 'name email isAdmin isApprovedAdmin'); // Include isAdmin field
        res.json({ success: true, users });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ success: false, message: "Error fetching users" });
    }
});



app.post('/getcart',fetchUser,async(req,res)=>{
   
    console.log("GetCart");
    let userData = await Users.findOne({_id:req.user.id});
    res.json(userData.cartData);
})

app.get('/profile', fetchUser, async (req, res) => {
    console.log("Get Profile");
    let userData = await Users.findOne({ _id: req.user.id });
    res.json(userData);
});
app.post('/updateprofile', fetchUser, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const updatedData = {};
        
        if (username) {
            updatedData.name = username;
        }
        
        if (password) {
            updatedData.password = await bcrypt.hash(password, 10);
        }

        const updatedUser = await Users.findByIdAndUpdate(req.user.id, updatedData, { new: true });

        res.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ success: false, message: "Error updating profile" });
    }
});


app.put('/updateproduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, image, category, new_price, old_price } = req.body;

        // Find the product by ID and update it
        const updatedProduct = await Product.findOneAndUpdate(
            { id: parseInt(id) },  // Use parseInt to ensure it's a number
            { name, image, category, new_price, old_price },
            { new: true }  // Return the updated document
        );

        if (updatedProduct) {
            res.json({ success: true, product: updatedProduct });
        } else {
            res.status(404).json({ success: false, message: 'Product not found' });
        }
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ success: false, message: 'Error updating product' });
    }
});


app.listen(port, (error) => {
    if (!error) {
        console.log("Server Running on Port " + port);
    } else {
        console.log("Error: " + error);
    }
});