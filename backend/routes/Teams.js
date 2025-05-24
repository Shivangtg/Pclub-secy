const express=require("express")
const { getAllTeams, getTopTeams, createTeam, joiningATeam } = require("../controller/Teams")

const router=express.Router()

router.get("/getAllTeams",getAllTeams)
router.get("/getTopTeams",getTopTeams)
router.post("/createTeam",createTeam)
router.post("/joinATeam",joiningATeam)

module.exports=router