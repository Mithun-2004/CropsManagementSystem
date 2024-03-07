const express = require("express");
const router = express.Router();

const {protectAdmin} = require("../middlewares/authmiddleware");
const {fetchAllFarmers, fetchAllUsers, createFolder, getFolders, getFolderById, addFarmer, removeFarmer, renameFolder, removeFolder, getPostById, createMessage, fetchMessages} = require("../controllers/adminController");

router.use("*", protectAdmin);
router.get("/allFarmers", fetchAllFarmers);  // fetch all farmer details
router.get("/allUsers", fetchAllUsers);      // fetch all users' details
router.post("/createFolder", createFolder);  // create a folder
router.get("/folders", getFolders);          // get all the folders
router.get("/folder/:id", getFolderById);    // get a particular folder with farmers and posts
router.put("/addFarmer", addFarmer);         // add farmer to the folder
router.put("/removeFarmer", removeFarmer);   // remove farmer to the folder
router.put("/renameFolder", renameFolder);   // rename folder 
router.post("/removeFolder", removeFolder);  // remove folder
router.get("/post/:id", getPostById);        // get post by id
router.post("/createMessage", createMessage); // create message model
router.get("/fetchMessages", fetchMessages);   // fetching messages from farmers

module.exports = router;