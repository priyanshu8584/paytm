const express=require("express");
const zod=require("zod");
const {User, Accounts}=require("../db");
const jwt=require("jsonwebtoken");
const {JWT_SECRET}=require("../config");
const { authMiddleware } = require("../middleware");


const router=express.Router();

const signupBody=zod.object({
  username:zod.string(),
  password:zod.string(),
  firstName:zod.string(),
  lastName:zod.string()
})
router.get("/getuser", authMiddleware, async (req, res) => {
  try {
      const userdata = await User.findOne({ _id: req._id });
      return res.json(userdata);
  } catch (error) {
      console.error("Error fetching user data:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});
  //signup
router.post("/signup",async(req,res)=>{
   const {success,error}=signupBody.safeParse(req.body);
   if(!success)
   {
    error: error.issues.map(issue => issue.message)
    return res.status(411).json({
    message:"invalid credentials"
   })
  }
   const existingUser=await User.findOne({
    username:req.body.username
   })
   if(existingUser)
   return res.json({
  message:"email already taken"
  })
  const user=await User.create({
    username:req.body.username,
    password:req.body.password,
    firstName:req.body.firstName,
    lastName:req.body.lastName
  })
  const userId=user._id;
  await Accounts.create({
    userId,
    balance:1+Math.random()*10000
  })
  const token= jwt.sign({
    userId
  },JWT_SECRET);
  res.json({
    messgage:"User Created Succesfully",
    token:token
  })
})
const signinBody=zod.object({
  username:zod.string(),
  password:zod.string()
})

//signin body
router.post("/signin",async (req,res)=>{
const {success}=signinBody.safeParse(req.body);
if(!success)
return res.status(403).json({
  message:"invalid credentials"
})

 const user=await User.findOne({
  username:req.body.username,
  password:req.body.password
 })
 const userId=user._id
 if(user)
{
   const token=jwt.sign({
    userId
   },JWT_SECRET);
   return res.json({
    token:token
   })
}
return res.json({
  message:"wrong inputs"
})
})




const updateBody=zod.object({
  password:zod.string().optional(),
  firstName:zod.string().optional(),
  lastName:zod.string().optional()
})
router.put("/",async (req,res)=>{
     const{success}=updateBody.safeParse(req.body);
     if(!success)
     return res.status(403).json({
    message:"invalid inputs"
    })
   await User.updateOne({_id:req.userId},req.body);
   res.json("updated successfully");

})
router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  const users = await User.find({
      $or: [{
          firstName: {
              "$regex": filter
          }
      }, {
          lastName: {
              "$regex": filter
          }
      }]
  })

  res.json({
      user: users.map(user => ({
          username: user.username,
          firstName: user.firstName,
          lastName: user.lastName,
          _id: user._id
      }))
  })
})
module.exports=router;

