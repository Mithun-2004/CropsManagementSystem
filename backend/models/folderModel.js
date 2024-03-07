const mongoose = require("mongoose");

const folderSchema = mongoose.Schema({
    regionName : {type:String, required:true},
    cropName : {type:String, required:true},
    farmers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    }],
}, {timestamps:true})

const Folder = mongoose.model("Folder", folderSchema);

module.exports = Folder;