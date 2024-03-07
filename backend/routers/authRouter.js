const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploadMiddleware = multer({ dest: 'uploads/' });

const { register, login, logout, fetchAllUsers, changeProfilePic } = require("../controllers/authController");

router.post("/login", login);
router.post("/register", uploadMiddleware.single('image'), register);
router.post("/logout", logout);
router.get("/allUsers", fetchAllUsers);
router.put("/changeProfilePic", uploadMiddleware.single('image'), changeProfilePic)
module.exports = router;
