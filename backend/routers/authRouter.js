const express = require("express");
const router = express.Router();

const multer = require("multer");
const uploadMiddleware = multer({dest: '../uploads/profile/'});

const {register, login, logout} = require("../controllers/authController");

router.post("/login", login);
router.post("/register", uploadMiddleware.single('image'), register);
router.post("/logout", logout);

module.exports = router;