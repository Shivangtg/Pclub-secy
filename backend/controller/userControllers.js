const { Json } = require("sequelize/lib/utils");
const { User} = require("../models/models")

const changeUserImage=async (req,res)=>{
    try {
        const user = await User.findOne({
            where:{name:req.body.user.name}
        })
        if(req.body.url==""){
            return res.json(400).json({success:false,error:"please enter a non empty string"})
        }
        user.image_url=req.body.url;
        await user.save()
        const { id, email, name, team_name ,image_url }=user
        res.status(200).json({success:true,message:"Updated user image successfully",user:{ id, email, name, team_name ,image_url }})
    } catch (error) {
        
        res.status(400).json({success:false,error})
        console.log("\n\n\n","error in changing user profile",error,"\n\n\n")
    }
}

const leaveTeam=async (req,res)=>{
    try {
        console.log("\n\n\n",req.body,req.body.user.id,"\n\n\n")
        // body=JSON.parse(req.body.user)
        const user = await User.findOne({
            where:{id:req.body.user.id}
        })
        console.log(user)
        if(user.team_name==null){
            return res.status(400).json({success:false,error:"You are not part of any team become a part of some team then think about leave it"})
        }
        const all_members=await User.findAll({where:{team_name:req.body.user.team_name}})
        console.log(all_members)
        if(all_members.length==1){
            return res.status(400).json({success:false,error:"You are the only member in the team you can not leave it"})
        }

        user.team_name=null;
        await user.save()
        console.log("happy")
        const { id, email, name, team_name ,image_url }=user
        res.status(200).json({success:true,error:"user successfully left the team",user:{ id, email, name, team_name ,image_url }})
    } catch (error) {
        console.log(error,error.message)
        res.status(500).json({success:false,error})
    }
}

module.exports={changeUserImage,leaveTeam}
