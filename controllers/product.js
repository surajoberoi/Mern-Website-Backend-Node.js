const Product = require("../models/product");
const formidable = require("formidable");       // module for parsing form data, especiallt file uploads.
const _ = require("lodash"); // This is how we require lodash
const fs = require("fs"); //File system


exports.getProductById = (req, res,next,id) => {
    Product.findById(id)
    .populate("category")                   //understand working !
    .exec((err, product)=>{
        if(err){
            return res.status(400).json({
                error:"Product not found"
            })
        }
        req.product = product;
        next();
    })
}


exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  // to include the extensions of the original files or not

    form.parse(req, (err, fields, file) =>{         // parses an incoming Node.js request containing form data.
                                                    // if callback is provided, all fields and files are collected and pass to the callback
        if(err){
            res.status(400).json({
                error:"Problem with Image"
            });
        }

            //Destructure the fields
            const {name, description, price, category, stock} = fields  //These are all the fields which we will send while creating the product

            if(
                !name || !description || !price || !category || !stock
            ){
                return res.status(400).json({
                    error:"Please include all fields"
                });
            }


                

         let product = new Product(fields) // making object of class/ model product and A product is created based on the fields in the parameters (fields)


        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File size too big"
                })
            }

            /*These two lines are storing the photo in the DB
                Including the file in the product

            */
            product.photo.data = fs.readFileSync(file.photo.path)   // retrieving complete path of product photo
            product.photo.contentType = file.photo.type     // mentioning the content type for the DB
        }


        //Save In DB
        product.save((err, product)=>{
            if(err){
                res.status(400).json({
                    error:"Saving tshirt in DB failed"
                })
            }
            res.json(product);
        })

    })
}


exports.getProduct = (req, res) => {
    req.product.photo = "undefined";
    return res.json(req.product)
}

//middleware
exports.photo = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("Content-Type",req.product.photo.contentType)
        return res.send(req.product.photo.data)
    }
    next();
}

//delete controllers
exports.deleteProduct = (req,res) =>{
    let product = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete the product"
            })
        }
        res.json({
            message:"Deletion successful",
            deletedProduct
        })
    })
}

//update controllers
exports.updateProduct = (req,res) =>{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;  // to include the extensions of the original files or not

    form.parse(req, (err, fields, file) =>{         // parses an incoming Node.js request containing form data.
                                                    // if callback is provided, all fields and files are collected and pass to the callback
        if(err){
            res.status(400).json({
                error:"Problem with Image"
            });
        }
                

         let product = req.product // making object of class/ model product and A product is created based on the fields in the parameters (fields)
         product = _.extend(product, fields)    // updating the fields in the product

        if(file.photo){
            if(file.photo.size > 3000000){
                return res.status(400).json({
                    error:"File size too big"
                })
            }

            /*These two lines are storing the photo in the DB
                Including the file in the product

            */
            product.photo.data = fs.readFileSync(file.photo.path)   // retrieving complete path of product photo
            product.photo.contentType = file.photo.type     // mentioning the content type for the DB
        }


        //Save In DB
        product.save((err, product)=>{
            if(err){
                res.status(400).json({
                    error:"Updation of product failed"
                })
            }
            res.json(product);
        });
    });
};


// list all products
exports.getAllproducts = (req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8;   // number of products shown by default = 8
    let sortBy = req.query.sortby ? req.query.sortby : "_id";        // products will be sorted on the bases of their ID by default
    Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err,products)=>{
        if(err){
            return res.status(400).json({
                error:"No product Found"
            })
        }
        res.json(products)
    })
}

// List all categories
exports.getAllUniqueCategories = (req,res)=>{
    Product.distinct("category",{},(err,category)=>{
        if(err){
            return res.status(400).json({
                error:"No category found"
            })
        }
        res.json(category)
    })
}



// check when this method is executed
exports.updateStock = (req, res, next)=> {
    
    //looping thorugh all the products in the cart using the "Map" function and will be stored in "prod"
    let myOperations = req.body.order.products.map(prod => {
        return {
            updateOne:{
                filter:{_id:prod._id},
                update: {$inc: {stock: -prod.count, sold: +prod.count }}  //.count will be thrown from the frontend

            }
        }
    })

    Product.bulkWrite(myOperations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                error:"Bulk operations Failed"
            })
        }
        next()
    })
}