const express=require("express")
const { changeUserImage, leaveTeam } = require("../controller/userControllers")

const router=express.Router()

router.post("/changeUserImage",changeUserImage)
router.post("/leaveTeam",leaveTeam)
// router.post("/createTeam",)
// router.post("/joinATeam",)

module.exports=router