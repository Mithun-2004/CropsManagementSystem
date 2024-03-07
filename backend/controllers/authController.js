const User = require("../models/userModel");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const salt = bcrypt.genSaltSync(10);

module.exports.register = async (req, res) => {
    let newPath = "";
    if (req.file){
        const { originalname, path } = req.file;
        const parts = originalname.split('.');
        const ext = parts[parts.length-1];
        newPath = path+'.'+ext;
        newPath = newPath.replace(/\\/g, '/');
        fs.renameSync(path, newPath);
    }

    const { username, password } = req.body;
    if (!username || !password){
        return res.status(400).json({ success: false, message: "Username and password are required." });
    }

    if (password.length < 8){
        return res.status(400).json({ success: false, message: "Password must be a minimum of 8 characters." });
    }

    try{
        const existedDoc = await User.findOne({ username });
        if (existedDoc){
            return res.status(400).json({ success: false, message: "Username already exists." });
        }

        let UserDoc;
        if (newPath !== ''){
            newPath = "/" + newPath;
            UserDoc = await User.create({
                'username' : username,
                'password' : bcrypt.hashSync(password, salt),
                pic: newPath
            });
        } else {
            UserDoc = await User.create({
                'username' : username,
                'password' : bcrypt.hashSync(password, salt),
            });
        }

        jwt.sign({ username, id: UserDoc._id }, process.env.SECRET, { expiresIn : 24 * 60 * 60 }, (err, token) => {
            if (err) throw err;
            res.cookie('token', token, { maxAge: 24 * 60 * 60 * 1000, secure: true, sameSite: 'none' }).status(200).json({ success: true, message: {
                id: UserDoc._id,
                username: UserDoc.username,
                pic: UserDoc.pic,
                isAdmin: UserDoc.isAdmin
            }});
        });
    }
    catch (err){
        console.log(err);
        res.status(400).json({ success: false, message: "Some error occurred while registering the user details in the database." });
    }
}


module.exports.login = async (req, res) => {
    const {username, password} = req.body;
    try{
        const userDoc = await User.findOne({username});
        if (userDoc === null){
            return res.status(400).json({success:false, message:"User does not exists."});
        }else{
            const passOK = bcrypt.compareSync(password, userDoc.password);
            if (passOK){
                jwt.sign({username: userDoc.username, id:userDoc._id}, process.env.SECRET, {expiresIn : 24 * 60 * 60}, (err, token) => {
                    if (err) throw err;
                    return res.cookie('token', token, {maxAge: 24 * 60 * 60 * 1000, secure:true, sameSite:'none'}).status(200).json({success:true, message:{
                        id: userDoc._id,
                        username: userDoc.username,
                        pic: userDoc.pic,
                        isAdmin: userDoc.isAdmin
                    }})
                })
            }else{
                return res.status(400).json({success:false, message:"incorrect credentials"});
            }
        }
    } 
    catch (err){
        console.log(err);
        return res.status(400).json({success:false, message:"Some error occured while checking user credentials."})
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

module.exports.changeProfilePic = async (req, res) => {
    const {remove} = req.body;
    
    if (remove === "yes"){
        let newPath = "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg";
        try{
            const {username} = req.body;
            const userDoc = await User.findOne({username});
            if (!userDoc){
                return res.status(400).json({success:false, message:"User not found"});
            }
            userDoc.pic = newPath;
            await userDoc.save();
            return res.status(200).json({success:true, message:{
                id: userDoc._id,
                username: userDoc.username,
                pic: userDoc.pic,
                isAdmin: userDoc.isAdmin
            }});
        }
        catch (err){
            console.log(err);
            return res.status(400).json({success:false, message:"error occured while removing profile pic."});
        }
    }
    if (remove === "no"){
        let newPath = "";
        if (req.file){
            const { originalname, path } = req.file;
            const parts = originalname.split('.');
            const ext = parts[parts.length-1];
            newPath = path+'.'+ext;
            newPath = newPath.replace(/\\/g, '/');
            fs.renameSync(path, newPath);
        }
        try{
            const {username} = req.body;
            const userDoc = await User.findOne({username});
            if (!userDoc){
                return res.status(400).json({success:false, message:"User not found"});
            }

            userDoc.pic = newPath;
            await userDoc.save();
            return res.status(200).json({success:true, message:{
                id: userDoc._id,
                username: userDoc.username,
                pic: userDoc.pic,
                isAdmin: userDoc.isAdmin
            }});
        }
        catch (err){
            console.log(err);
            return res.status(400).json({success:false, message:"error occured while changing profile pic."});
        }
    }
    
    
}