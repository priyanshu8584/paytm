import { Heading } from "../components/Heading"
import { SubHeading } from "../components/SubHeading"
import { InputBox } from "../components/Inputbox"
import { Button } from "../components/Button"
import { BottomWarning } from "../components/BottomWarning"
import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
export const Signup=()=>{
  const navigate=useNavigate();
  const [firstName,setFirstName]=useState("");
  const [lastName,setLastName]=useState("");
  const [username,setUsername]=useState("");
  const [password,setPassword]=useState("");
return <div className="bg-slate-400 h-screen flex justify-center">
<div className="flex flex-col justify-center">
<div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
<Heading label={"Sign up"} />
<SubHeading label={"fill up the mentioned details to proceed"}/>
<InputBox onChange={(e)=>{
  setFirstName(e.target.value);
}} placeholder="John" label={"FirstName"}/>
<InputBox  onChange={(e)=>{
  setLastName(e.target.value);
}}placeholder="Doe" label={"LastName"}/>
<InputBox onChange={(e)=>{
  setUsername(e.target.value);
}} placeholder="abc@example.com" label={"Email"}/>
<InputBox  onChange={(e)=>{
  setPassword(e.target.value);
}}placeholder="Password" label={"Password"}/>
<div className="pt-4">
 <Button label={"Signup Now"} onClick={async ()=>{
  const response=await axios.post("http://localhost:3000/api/v1/user/signup",{
    username,
    firstName,
    lastName,
    password
  })
  localStorage.setItem("token",response.data.token)
  navigate("/dashboard")
 }}/>
</div>
<BottomWarning label={"Already have an account "} buttontext={"Sign in"} to={"/signin"}/>
</div>
</div>
</div>
}