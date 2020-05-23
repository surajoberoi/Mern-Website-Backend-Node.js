const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({

    name:{
        type: String,
        trim: true,
        required: true,
        maxlength: 32,
        unique: true
    }

},{timestamps: true} // records time everytime a new entry is made through this schema and save it into DB.
); 

module.exports = mongoose.model("Category", categorySchema)
