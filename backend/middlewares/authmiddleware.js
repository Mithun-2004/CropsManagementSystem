const jwt = require('jsonwebtoken');

const User = require("../models/userModel");

module.exports.protectAdmin = async (req, res, next) => {
    const {token} = req.cookies;

    try{
        if (token){
            jwt.verify(token, process.env.SECRET, {}, async (err, decodedToken) => {
                if (err) throw err;
                else{
                    if (!req.user){
                        req.user = await User.findById(decodedToken.id).select("-password");
                    }
                    if (req.user.isAdmin === true){
                        next();
                    }
                    else{
                        res.status(400).json({success:false, message:"Authorization failed. You are not an admin"});
                    }
                }
            })
        }
        else{
            res.status(400).json({success:false, message:"Authorization failed."});
        }
    }
    catch (err){
        res.status(400).json({success:false, message:"error while checking authorization."});
    }  
}

module.exports.protectFarmer = async (req, res, next) => {
    const {token} = req.cookies;
    try{
        if (token){
            jwt.verify(token, process.env.SECRET, {}, async (err, decodedToken) => {
                if (err) throw err;
                else{
                    if (!req.user){
                        req.user = await User.findById(decodedToken.id).select("-password");
                    }
                    if (req.user.isAdmin === false){
                        next();
                    }
                    else{
                        res.status(400).json({success:false, message:"Authorization failed. You are not a farmer"});
                    }
                }
            })
        }
        else{
            res.status(400).json({success:false, message:"Authorization failed."});
        }
    }
    catch (err){
        res.status(400).json({success:false, message:"Authorization failed."});
    }  
}