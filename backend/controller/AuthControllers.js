const {User} = require("../models/models")
const bcryptjs=require("bcryptjs")

const loginUser=async (req,res)=>{
    try {
        req.body.email=req.body.email.toLowerCase();
        const user=await User.findOne({where:{email:req.body.email}})
        
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found try to signup" });
        }


        const is_correct=await bcryptjs.compare(req.body.password,user.password)
        if(!is_correct){
            return res.status(400).json({success:false,error:"wrong password please try again"})
        }

        const { id, email, name ,team_name ,image_url } = user;
        return res.status(200).json({success:true,message:"new user created",user: { id, email, name ,team_name ,image_url } })
    } catch (err) {
        return res.status(500).json({success:false,error:err.message})
    }
    
}

const signupUser=async (req,res)=>{
    try {
        req.body.email=req.body.email.toLowerCase();
        const user=await User.findOne({where:{email:req.body.email}})
        if(user!=null){
            return res.status(400).json({
                success:false,
                error:"User with same email address already exists in our database try to login"
            })
        }

        //hashing the password
        const hashed_password=await bcryptjs.hash(req.body.password,10);

        const new_user=await User.create({email:req.body.email,name:req.body.name,password:hashed_password})

        const { id, email, name, team_name,image_url } = new_user;
        res.status(201).json({ success: true, message: "User created successfully", user: { id, email, name, team_name ,image_url } });
    } catch (error) {
        res.status(500).json({success:false,error:error.message})
        console.log(error,"\n\n","signup error","\n\n")
    }
}

module.exports={loginUser,signupUser}