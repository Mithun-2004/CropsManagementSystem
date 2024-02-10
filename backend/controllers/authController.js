const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);

module.exports.register = async (req, res) => {
    let newPath = "";
    if (req.file){
        const {originalname, path} = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        fs.renameSync(path, newPath);
    }

    const {username, password} = req.body;
    if (!username || !password){
        res.status(400).json({success:false, message:"Username and password is required."})
    }

    try{
        if (password.length < 8){
            res.status(400).json({success:false, message:"Password must be minimum of 8 characters."})
        }
        const existedDoc = await User.findOne({username});
        if (existedDoc){
            res.status(400).json({success:false, message:"Username already exists."})
        }
        let UserDoc;
        if (newPath !== ''){
            UserDoc = await User.create({
                'username' : username,
                'password' : bcrypt.hashSync(password, salt),
                pic: newPath
            })
        }else{
            UserDoc = await User.create({
                'username' : username,
                'password' : bcrypt.hashSync(password, salt),
            })
        }
        jwt.sign({username, id:UserDoc._id}, process.env.SECRET, {expiresIn : 24 * 60 * 60}, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, {maxAge: 24 * 60 * 60 * 1000, secure:true, sameSite:'none'}).status(200).json({success:true, message: {
                id: userDoc._id,
                username: userDoc.username,
            }});
        })
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"some error occured while registering the user details in the database."})
    }
}

module.exports.login = async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.findOne({username});
        if (userDoc === null){
            res.status(400).json({success:false, message:"User does not exists."});
        }else{
            const passOK = bcrypt.compareSync(password, userDoc.password);
            if (passOK){
                jwt.sign({username: userDoc.username, id:userDoc._id}, process.env.SECRET, {expiresIn : 24 * 60 * 60}, (err, token) => {
                    if (err) throw err;
                    res.cookie('token', token, {maxAge: 24 * 60 * 60 * 1000, secure:true, sameSite:'none'}).status(200).json({success:true, message:{
                        id: userDoc._id,
                        name: userDoc.username
                    }})
                })
            }else{
                res.status(400).json({success:false, message:"incorrect credentials"});
            }
        }
    } 
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:"Some error occured while checking user credentials."})
    }
}

module.exports.logout = async (req, res) => {
    try{
        res.cookie('token', '', {secure:true, sameSite:'none'}).status(200).json({success:true, message:"user logged out successfully"});
    }
    catch (err){
        console.log(err);
        res.status(400).json({success:false, message:'some error occured while logging out.'});
    }
}