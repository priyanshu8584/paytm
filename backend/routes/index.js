const express=require("express");
const router=express.Router();
const userRouter=require("./user");
const AccountsRouter=require("./account");
router.use("/user",userRouter);
router.use("/accounts",AccountsRouter);
module.exports=router;               