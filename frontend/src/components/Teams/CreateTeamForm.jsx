'use client'
import React, { useState } from 'react'
import { useRouter } from "next/navigation";
import AuraButton from '../AuraButton';
import { useUserContext } from '@/context/user';

const CreateTeamForm = () => {
  const [teamname,setTeamname]=useState("");
  const [team_url,setTeam_url]=useState("");
  const {user,setUser}=useUserContext()
  const [error,setError]=useState("");
  const router=useRouter();

  const handleSubmit=async (event)=>{
    event.preventDefault();
    setError("")
    const origin=process.env.NEXT_PUBLIC_API_URL;
    const response= await fetch(origin+"/api/Teams/createTeam",{
        method:"POST",
        body:JSON.stringify({name:teamname,team_url,user}),
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include"
    })
    const json=await response.json()
    if(!response.ok){
      setError(json.error);
      console.log("error in login",json.error);
      return ;
    }
    console.log(json)
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
                <p>Create Team</p>
                <form className='flexContainerColoumnsCentered' onSubmit={handleSubmit}>
                      <input className='borderShadow'
                          placeholder='Team name'
                          value={teamname}
                          style={{borderRadius:"2px",padding:"0.4rem"}}
                          onChange={(event)=>{setTeamname(event.target.value)}}
                          required
                      />
                      <input className='borderShadow'
                          value={team_url}
                          placeholder='team image url'
                          style={{borderRadius:"2px",padding:"0.4rem"}}
                          onChange={(event)=>{setTeam_url(event.target.value)}}
                      />
                      <button className='borderShadow hoverScale SpclBg1'  style={{borderRadius:"2px",color:"white",padding:"0.4rem"}}>Create</button>
                      {error!=""?<div className="errorBox" style={{backgroundColor:_backgroundColor,color:_color,border:_border,boxShadow:_boxShadow}}>
                          {error}
                      </div>:""}
                </form>
            </div>
            <img src='/App-Icon.svg' width={"200px"}/>

        </div>

    </div>

  )
}

export default CreateTeamForm