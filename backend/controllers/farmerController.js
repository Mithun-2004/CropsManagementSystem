const multer = require("multer");
const fs = require("fs");
const path = require('path');

const Folder = require("../models/folderModel");
const Post = require("../models/PostModel");
const Message = require("../models/messageModel");

// Set up multer for handling file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).array('images');

module.exports.getAssignedFolders = async (req, res) => {
    const farmerId = req.user._id;
    if (!farmerId){
        return res.status(400).json({success:false, message:"Farmer does not exist."});
    }
    try{
        const folders = await Folder.find({ farmers: { $in: [farmerId] } });
        if (!folders){
            return res.status(400).json({success:false, message:"No assgined folders found."})
        }else{
            return res.status(200).json({success:true, message:folders});
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching the assigned folders."})
    }
}

module.exports.getAssignedFolderById = async (req, res) => {
    const folderId = req.params.id;
    if (!folderId){
        return res.status(400).json({success:false, message:"Folder Id does not exist."});
    }
    try{
        const folderDoc = await Folder.findById(folderId).populate({
            path: "farmers",
            select: '-password -isAdmin'
        }).select("-password -isAdmin")
        if (!folderDoc){
            return res.status(400).json({success:false, message:"Folder does not exist."})
        }
        const posts = await Post.find({ folder: folderId }).select('title caption description createdBy images').populate({path:"createdBy", select:"username"});;
        const document = {folderDoc, posts};
        return res.status(200).json({success:true, message:document});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching the assigned folder."})
    }
}

module.exports.createPost = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ success: false, message: "Error uploading images." });
        }

        const { title, caption, description, folderId } = req.body;
        const createdBy = req.user._id;
        
        if (!title || !caption || !description || !folderId || !createdBy){
            return res.status(400).json({success:false, message:"Incomplete details."});
        }

        const images = req.files.map(file => file.path);
        try {
            const newPost = await Post.create({
                title,
                caption,
                description,
                createdBy,
                images,
                folder: folderId
            });

            res.status(201).json({ success: true, message: newPost });
        } catch (err) {
            console.error(err);
            res.status(400).json({ success: false, message: "Error creating post." });
        }
    });
}

module.exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    if (!postId){
        return res.status(400).json({success:false, message:"Post Id does not exist."});
    }
    try{
        const postDoc = await Post.findById(postId).populate({path:"createdBy", select:"username"});
        if (!postDoc){
            return res.status(400).json({success:false, message:"Post does not exist."});
        }
        return res.status(200).json({success:true, message:postDoc});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching post"});
    }
}

module.exports.removePost = async (req, res) => {
    const {postId} = req.body;
    if (!postId){
        return res.status(400).json({success:true, message:"Post Id does not exist."});
    }
    
    try{
        const removedDoc = await Post.findByIdAndDelete(postId);
        
        if (!removedDoc){
            return res.status(400).json({success:false, message:"Post does not exist."});
            
        }
        res.status(200).json({success:true, message:"Post removed successfully."});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while deleting a post."});
    }
}

module.exports.sendMessage = async (req, res) => {
    const {text} = req.body;
    const sender = req.user.username;
    if (!sender || !text){
        return res.status(400).json({success:false, message:"Both sender and text must be entered."});
    }
    const name = "MessageFromFarmers";
    try{
        const currentDate = new Date();
        const messageDoc = await Message.findOneAndUpdate(
            { name },
            {
                $push: {
                    messages: {
                        sender,
                        text,
                        sentAt: currentDate
                    }
                }
            },
            { new: true }
        );

        res.status(200).json({ success: true, message: "Message sent successfully." });
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while sending message."})
    }
}