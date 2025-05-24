const { Team, User } = require("../models/models")

const getTopTeams=async function(req,res){
    const topTeams=await Team.findAll({
        order:[["score","DESC"]]
    })
    res.status(200).json({success:true,teams:topTeams})
}

const getAllTeams=async function(req,res){
    const Teams=await Team.findAll({
        order:[["createdAt","DESC"]]
    })
    res.status(200).json({success:true,teams:Teams})
}

const createTeam=async function(req,res){
    console.log("\n\n\n",req.body,"\n\n\n")
    //Checking if user is already part of a team
    const user=await User.findOne({where:{email:req.body.user.email}})
    if(user.team!=null){
        return res.status(400).json({success:false,error:`You are already a part of ${user.team} you can't create your own team`})
    }


    //Creating a team for users that don't exists
    const team=await Team.findOne({where:{name:req.body.name}})
    if(team!=null){
        return res.status(400).json({
            success:false,
            error:"Team with same name already exists in our database try to use different name"
        })
    }
    if(req.body.team_url!=""){
        const new_team=await Team.create({name:req.body.name,image_url:req.body.team_url})
    }else{
        const new_team=await Team.create({name:req.body.name})
    }
    await User.update(
        {team_name:req.body.name},
        {where :{email:req.body.user.email}}
    )
    const { id, email, name, team_name ,image_url }=await User.findOne({where:{email:req.body.user.email}})
    // console.log("\n\n\n\n\n\n",id, email, name, team_name, "\n\n\n\n\n\n")
    res.status(200).json({success:true,message:"successfully created the team",user:{ id, email, name, team_name ,image_url }})
}

const joiningATeam=async function(req,res){
    console.log("\n\n\n",req.body,"\n\n\n")
    //Checking if user is already part of a team
    const user=await User.findOne({where:{email:req.body.user.email}})
    if(user.team_name!=null){
        return res.status(400).json({success:false,error:`You are already a part of ${user.team} you can't join another team`})
    }


    //Creating a team for users that don't exists
    const allMembers=await User.findAll({where:{team_name:req.body.team.name}})
    if(allMembers.length>=5){
        return res.status(400).json({success:false,error:`This team has maxium number of members currently you can't join it now`})
    }
    user.team_name=req.body.team.name
    await user.save();
    const { id, email, name, team_name ,image_url }=await User.findOne({where:{email:req.body.user.email}})
    res.status(200).json({success:true,message:`Successfully joined the team ${req.body.team.name}`,user:{ id, email, name, team_name ,image_url }})

}


module.exports = {getTopTeams,getAllTeams,createTeam,joiningATeam}