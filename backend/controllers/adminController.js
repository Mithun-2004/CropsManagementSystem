const User = require("../models/userModel");
const Folder = require("../models/folderModel");
const Post = require("../models/PostModel");
const Message = require("../models/messageModel");

module.exports.fetchAllFarmers = async (req, res) => {
    try{
        const farmers = await User.find({isAdmin: false}).select("-password").select("-isAdmin");
        if (farmers === null){
            res.status(400).json({success:false, message:"No farmers exist."});
        }else{
            res.status(200).json({success:true, message:farmers});
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching the farmer details."});
    }
}

module.exports.fetchAllUsers = async (req, res) => {
    try{
        const users = await User.find().select("-password");
        if (users === null){
            res.status(400).json({success:false, message:"No users exist."});
        }else{
            res.status(200).json({success:true, message:users});
        }
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching the details of users."});
    }
}

module.exports.createFolder = async (req, res) => {
    let { regionName, cropName, farmers } = req.body;

    if (!regionName || !cropName) {
        res.status(400).json({ success: false, message: "Region name and crop name are required." });
        return;
    }

    regionName = regionName.trim();
    cropName = cropName.trim();
    regionName = regionName.charAt(0).toUpperCase() + regionName.slice(1);
    cropName = cropName.charAt(0).toUpperCase() + cropName.slice(1);

    try {
        let ExistedDoc = await Folder.findOne({ regionName, cropName });
        if (ExistedDoc !== null) {
            res.status(400).json({ success: false, message: "Entered region and crop already exist." });
            return;
        }

        let FolderDoc;
        if (farmers === null) {
            FolderDoc = await Folder.create({ regionName, cropName });
        } else {
            FolderDoc = await Folder.create({ regionName, cropName, farmers });
        }
        res.status(200).json({ success: true, message: FolderDoc });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Error occurred while creating folder." });
    }
}

module.exports.getFolders = async (req, res) => {
    try {
        let query = {};
    
        // Check if regionName or cropName is provided
        if (req.query.regionName && req.query.cropName) {
            regionName = req.query.regionName;
            regionName = regionName.trim();
            regionName = regionName.charAt(0).toUpperCase() + regionName.slice(1);
            cropName = req.query.cropName;
            cropName = cropName.trim();
            cropName = cropName.charAt(0).toUpperCase() + cropName.slice(1);
            query = { regionName: regionName, cropName: cropName };
        } else if (req.query.regionName) {
            regionName = req.query.regionName;
            regionName = regionName.trim();
            regionName = regionName.charAt(0).toUpperCase() + regionName.slice(1);
            query = { regionName: regionName };
        } else if (req.query.cropName) {
            cropName = req.query.cropName;
            cropName = cropName.trim();
            cropName = cropName.charAt(0).toUpperCase() + cropName.slice(1);
            query = { cropName: cropName };
        }

        const folders = await Folder.find(query);
    
        if (folders.length === 0) {
            res.status(400).json({ success: false, message: "No folders exist." });
            return;
        }
    
        res.status(200).json({ success: true, message: folders });
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Error occurred while fetching folders." });
    }
    
}

module.exports.getFolderById = async (req, res) => {
    const folderId = req.params.id;

    try {
        const folderDoc = await Folder.findById(folderId)
            .populate({
                path: 'farmers',
                select: '-password -isAdmin'
            })
            .select("-password -isAdmin");

        if (folderDoc) {
            const posts = await Post.find({folder: folderId})
            .select("title caption description createdBy images")
            .populate({path:"createdBy", select:"username"});
            const document = {folderDoc, posts}
            res.status(200).json({ success: true, message: document });
            return;
        } else {
            res.status(400).json({ success: false, message: "Folder does not exist." });
        }
    } catch (err) {
        console.log(err);
        res.status(400).json({ success: false, message: "Error occurred while fetching the details of the folder." });
    }

}

module.exports.addFarmer = async (req, res) => {
    const { folderId, username } = req.body;
    if (!folderId || !username){
        return res.status(400).json({success:false, message:"Insufficient details."});
    }

    try {
        const user = await User.find({username});
        if (user.length===0){
            return res.status(400).json({success:false, message:"Farmer does not exit."})
        }
        const farmerId = user[0]._id;
        const folderDoc = await Folder.findById(folderId);
        
        if (!folderDoc) {
            return res.status(400).json({ success: false, message: "Folder does not exist." });
        }

        if (folderDoc.farmers.includes(farmerId)) {
            return res.status(400).json({ success: false, message: "Farmer already exists in the folder." });
        }

        folderDoc.farmers.push(farmerId); 
        await folderDoc.save();

        res.status(200).json({ success: true, message: folderDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "error occured while adding a member." });
    }
}

module.exports.removeFarmer = async (req, res) => {
    const { folderId, farmerId } = req.body;
    if (!folderId || !farmerId){
        return res.status(400).json({success:false, message:"Insufficient details."});
    }

    try{
        const folderDoc = await Folder.findById(folderId);
        if (!folderDoc) {
            return res.status(404).json({ success: false, message: "Folder not found." });
        }

        if (!folderDoc.farmers.includes(farmerId)) {
            return res.status(400).json({ success: false, message: "Farmer does not exist in the folder." });
        }

        folderDoc.farmers = folderDoc.farmers.filter(id => id.toString() !== farmerId.toString());
        await folderDoc.save();

        res.status(200).json({ success: true, message: folderDoc });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "error occured while removing a member." });
    }
}

module.exports.renameFolder = async (req, res) => {
    const { folderId, newRegionName, newCropName } = req.body;
    if (!folderId) {
        return res.status(400).json({ success: false, message: "Folder ID is required." });
    }
    try {
        let updateObject = {};

        if (newRegionName !== null) {
            updateObject.regionName = newRegionName;
        }
        if (newCropName !== null) {
            updateObject.cropName = newCropName;
        }
        const folderDoc = await Folder.findByIdAndUpdate(
            folderId,
            { $set: updateObject },
            { new: true }
        );
        if (!folderDoc) {
            return res.status(404).json({ success: false, message: "Folder not found." });
        }

        res.status(200).json({ success: true, message: folderDoc });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: "Error occurred while changing the details of the folder." });
    }
}

module.exports.removeFolder = async (req, res) => {
    const {folderId} = req.body;
    if (!folderId){
        return res.status(400).json({success:false, message:"Folder does not exist."});
    }
    
    try {
        const removedFolder = await Folder.findByIdAndDelete(folderId);

        if (!removedFolder) {
            return res.status(404).json({ success: false, message: "Folder not found." });
        }

        res.status(200).json({ success: true, message: "Folder removed successfully." });
    } catch (err) {
        console.error(err);
        res.status(400).json({ success: false, message: "error occurred while removing the folder." });
    }
}

module.exports.getPostById = async (req, res) => {
    const postId = req.params.id;
    if (!postId){
        res.status(400).json({success:false, message:"Post Id does not exist."});
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
        res.status(400).json({success:false, message:"error occured while fetching post."});
    }
}

module.exports.createMessage = async (req, res) => {
    const {name} = req.body;
    try{
        const messageDoc = await Message.create({name});
        res.status(200).json({success:true, message:messageDoc});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:true, message:"error occured while creating message doc."})
    }
}

module.exports.fetchMessages = async (req, res) => {
    const name = "MessageFromFarmers";
    try{
        const messageDoc = await Message.aggregate([
            { $match: { name } },
            { $unwind: "$messages" },
            { $sort: { "messages.sentAt": -1 } },
            { $group: { _id: "$_id", messages: { $push: "$messages" } } }
        ]);

        const formattedMessageDoc = messageDoc.length > 0 ? messageDoc[0] : null;
        res.status(200).json({ success: true, message: formattedMessageDoc });
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"error occured while fetching messages"});
    }
}