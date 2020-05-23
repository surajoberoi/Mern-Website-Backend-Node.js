require('dotenv').config()

const mongoose = require("mongoose");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");


//mongoose.connect("mongodb://localhost:27017/test",{useNewUrlParser: true});

//DB CONNECTION
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex:true  // uses mongoose inbulit indexing feature
}).then(() => {
    console.log("DB CONNECTED")
});

// MIDDLEWARE
app.use(bodyParser.json()); // understand working
app.use(cookieParser()); // understand working
app.use(cors()); // understand working


// Routes
const authRoutes = require("./routes/authentication")
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category")
const productRoutes = require("./routes/product")
const orderRoutes = require("./routes/order")
const stripeRoutes = require("./routes/StripePayment")

app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);



// PORT
const port = process.env.PORT || 8000;

// SERVER 
app.listen(port,() => {
    console.log(`app is running at ${port}`);
});



// body parser : it parses the incoming request bodies before they are handled
// cookie parser : if we want to obtain information or set information into a cookie then we use this.
// cors : "cross origin resouorce sharing", allows  restricted resources on a web page to be requested from another domain.

//JSON webtoken?
//JWT?


