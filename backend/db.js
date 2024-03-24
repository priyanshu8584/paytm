const mongoose=require("mongoose");
mongoose.connect("mongodb+srv://singhpriyanshu1024:th6UU9awaFY9FLw7@cluster0.kibvlzl.mongodb.net/paytm")
const mongooseSchema = new mongoose.Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String
});
const User=mongoose.model('User',mongooseSchema);
const accountsSchema=new mongoose.Schema({
  userId:{
  type:mongoose.Schema.Types.ObjectId,
  ref:'User',
  required:true
  },
  balance:{
   type:Number,
   required:true
  }
})

const Accounts= mongoose.model('Accounts', accountsSchema);
module.exports={User,Accounts};