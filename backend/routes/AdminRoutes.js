const express=require("express")
const { conductPrimaryMatches , conductSecondaryMatches, conductChallenges, getResultOfRoundOne } = require("../controller/AdminController")

const router=express.Router()

router.post("/conductPrimaryMatches",conductPrimaryMatches)
router.post("/conductSecondaryMatches",conductSecondaryMatches)
router.post("/conductChallenges",conductChallenges)
router.post("/getResultOfRoundOne",getResultOfRoundOne)

module.exports=router