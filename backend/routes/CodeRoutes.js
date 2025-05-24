const express=require("express")
const { getAllCodeHistory, savingCode, getCodeAtCommit } = require("../controller/CodeController")

const router=express.Router()

router.post("/savingCode",savingCode)
router.post("/getAllCodeHistory",getAllCodeHistory)
router.post("/getCodeAtCommit",getCodeAtCommit)


module.exports=router