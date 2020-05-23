const Category = require("../models/category");

//middleware : Middlewares are always executed first
exports.getCategoryById = (req, res, next, id) => {

    Category.findById(id).exec((err,cate)=>{
        if(err){
        return res.status(400).json({
            error:"Category not found in DB"
        });
    }
    req.category = cate;
    next();
    });
};

exports.createCategory = (req, res) => {
    const category = new Category(req.body);
    category.save((err,category)=>{                 //saving category in the Db
       if(err) {
           return res.status(400).json({
               error:"Not able to save category in DB"
           });
       }
       res.json({category});        // sending the json response on front end of category
    });
};

//get a single category via middleware "getCategoryById"
exports.getCategory =(req, res) =>{
    return res.json(req.category);
}


exports.getAllCategory = (req, res) => {
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(400).json({
                error:"No categories foubd"
            });
        }
        res.json(categories);
    });
};

exports.updateCategory = (req,res)=>{
    const category = req.category;
    category.name = req.body.name; // grabing the category name from the front-end and changing the value in  the DB
    
    category.save((err,updatedcategory)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to update category"
            });
        }
        res.json(updatedcategory);
    });
}

exports.removeCategory = (req, res) => {
    const category = req.category;
    category.remove((err,category)=>{
        if(err){
            return res.status(400).json({
                error:"Failed to delete this category"
            })
        }
        res.json({
            message: "Succesfully deleted"
        })
    })
}

