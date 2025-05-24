'use client'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import AuraButton from '../AuraButton';
import { useUserContext } from '@/context/user';

const Signup = () => {
  const [useremail,setUseremail]=useState("");
  const [password,setPassword]=useState("");
  const [username,setUsername]=useState("");
  const [error,setError]=useState("");
  const {setUser}=useUserContext();
  const router=useRouter();

  const handleSubmit=async (event)=>{
    event.preventDefault();
    setError("")
    const origin=process.env.NEXT_PUBLIC_API_URL;
    
    const response= await fetch(origin+"/api/auth/signup",{
        method:"POST",
        body:JSON.stringify({email:useremail,password,name:username}),
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include"
    })
    const json= await response.json()
    if(!response.ok){
      setError(json.error);
      console.log("error in login",json.error);
      return ;
    }
    await setUser(json.user)
    router.push("/dashboard")
  }
  
  const _backgroundColor= "#ffefef";
  const _color="#e7195a";
  const _border=  "1px solid #e7195a";
  const _boxShadow= "#e7195a 0px 0px 1rem" ;

  return (
    <div className='flexContainerRowsCentered' style={{columnGap:"5rem",height:"100vh",justifyContent:"center"}}>
        <div className='flexContainerRowsCentered borderShadow' style={{justifyContent:"center",padding:"2rem"}}>
            <div className='flexContainerColoumnsCentered borderShadow' style={{position:"relative",borderRadius:"5px",padding:"2rem"}}>
                <p>Sign Up</p>
                <form className='flexContainerColoumnsCentered' onSubmit={handleSubmit}>
                    <input className='borderShadow' type="email"
                        placeholder='abc@gmail.com'
                        value={useremail}
                        style={{borderRadius:"2px",padding:"0.4rem"}}
                        onChange={(event)=>{setUseremail(event.target.value)}}
                        required
                    />
                    <input className='borderShadow' type="text" 
                        value={username}
                        placeholder='abc master'
                        style={{borderRadius:"2px",padding:"0.4rem"}}
                        onChange={(event)=>{setUsername(event.target.value)}}
                        required
                    />
                    <input className='borderShadow' type="password" 
                        value={password}
                        placeholder='password'
                        style={{borderRadius:"2px",padding:"0.4rem"}}
                        onChange={(event)=>{setPassword(event.target.value)}}
                        required
                    />
                    
                    <button className='borderShadow hoverScale SpclBg1'  style={{borderRadius:"2px",color:"white",padding:"0.4rem"}}>Sign Up</button>
                    
                    
                    {error!=""?<div className="errorBox" style={{backgroundColor:_backgroundColor,color:_color,border:_border,boxShadow:_boxShadow}}>
                        {error}
                    </div>:""}
                </form>
            </div>
            <img src='/sign_up.svg' width={"200px"}/>
            
        </div>

    </div>

  )
}

export default Signup