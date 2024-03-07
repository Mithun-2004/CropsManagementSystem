const express = require("express");
const router = express.Router();

const {protectFarmer} = require("../middlewares/authmiddleware");
const {getAssignedFolders, getAssignedFolderById, createPost, getPostById, removePost, sendMessage} = require("../controllers/farmerController");

router.use("*", protectFarmer);
router.get("/assignedFolders", getAssignedFolders);
router.get("/assignedFolder/:id", getAssignedFolderById);
router.post("/createPost", createPost);
router.get("/post/:id", getPostById);
router.post("/removePost", removePost);
router.post("/sendMessage", sendMessage);

module.exports = router;