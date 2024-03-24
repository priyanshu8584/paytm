const express=require("express");
const {authMiddleware } = require("../middleware");
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const mongoose=require("mongoose");
const {User,Accounts}=require("../db");
const router=express.Router();




router.get('/balance', authMiddleware,async (req, res) => {
  console.log("Querying for userId:", req.userId); // Debugging line
  
  try {
    const account = await Accounts.findOne({
      userId: req.userId
    });

    if (!account) {
      return res.status(404).json({
        message: "Account not found"
      });
    }

    res.json({
      balance: account.balance
    });
  } catch (error) {
    console.error("Error retrieving account balance:", error);
    res.status(500).json({
      message: "Internal server error"
    });
  }
});



router.post("/transfer", authMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  session.startTransaction();
  const { amount, to } = req.body;

  // Fetch the accounts within the transaction
  const account = await Accounts.findOne({ userId: req.userId }).session(session);

  if (!account || account.balance < amount) {
      await session.abortTransaction();
      return res.status(400).json({
          message: "Insufficient balance"
      });
  }

  const toAccount = await Account.findOne({ userId: to }).session(session);

  if (!toAccount) {
      await session.abortTransaction();
      return res.status(400).json({
          message: "Invalid account"
      });
  }

  // Perform the transfer
  await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
  await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);

  // Commit the transaction
  await session.commitTransaction();
  res.json({
      message: "Transfer successful"
  });
});
module.exports=router