const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
    title: {type:String, required:true},
    caption: {type:String, required:true},
    description: {type:String, required:true},
    createdBy: {type:mongoose.Schema.Types.ObjectId, ref:"User"},
    images: [{type:String}],
    folder : {type:mongoose.Schema.Types.ObjectId, ref:"Folder"}
}, {timestamps:true})

const Post = mongoose.model("Post", postSchema);
module.exports = Post;