const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();

require("dotenv").config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({credentials:true, origin:process.env.CLIENT_URL}));
app.use('/uploads', express.static(__dirname + "/uploads"));

mongoose.connect(process.env.MONGODB_URL)
.then((res) => {
    if (process.env.SERVER_PORT){
        app.listen(process.env.SERVER_PORT, () => console.log("Server started listening on port "+ process.env.SERVER_PORT));
    }
    console.log("DB Connected");
})
.catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.send("Home page");
})

const authRouter = require("./routers/authRouter");
const adminRouter = require("./routers/adminRouter");
const farmerRouter = require("./routers/farmerRouter");

app.use("/user", authRouter);
app.use("/admin", adminRouter);
app.use("/farmer", farmerRouter);
