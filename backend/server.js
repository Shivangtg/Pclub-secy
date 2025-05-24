require("dotenv").config()
const express=require("express");
const authRouter = require("./routes/AuthRoutes");
const { connectToDB, sequelize } = require("./database/db");
const leaderboardRouter = require("./routes/Teams");
const userRouter = require("./routes/userRoutes");
const codeRouter = require("./routes/CodeRoutes");
const adminRouter = require("./routes/AdminRoutes");
const app=express();

const allowedOrigins= [
    "http://localhost:3000/",
    "https://course-helper-beta.vercel.app",
    "http://localhost:3000",
    "https://course-helper-beta.vercel.app/"
  ];

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
      res.header("Access-Control-Allow-Origin", origin);
      res.header("Access-Control-Allow-Credentials", "true");
    }
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    
    if (req.method === "OPTIONS") {
      return res.sendStatus(204); // No Content for preflight requests
    }
  
    next();
});

app.use("/api/auth/",authRouter)
app.use("/api/teams/",leaderboardRouter)
app.use("/api/user/",userRouter)
app.use("/api/code/",codeRouter)
app.use("/api/Admin/",adminRouter)


connectToDB(sequelize)
.then((result)=>{
  app.listen(process.env.PORT,()=>{
    console.log("server started to listen to port",process.env.PORT)
  })
})
.catch(error=>{
  console.log("got this error\n\n",error)
})