'use client'


import { useUserContext } from '@/context/user'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'



export default function changeProfile()  {
    const [error,setError]=useState("")
    const {user,setUser}=useUserContext()
    const router=useRouter()
    const handleSubmit= async (e)=>{
        e.preventDefault()
        setError("")
        const res=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/user/changeUserImage",{
            method:"POST",
            body:JSON.stringify({url,user:user}),
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const json=await res.json()
        if(!res.ok){
            setError(json.error);
            console.log("error in changing profile",json.error);
            return ;
        }
        await setUser(json.user)
        router.push("/dashboard/Profile")
    }
    const [url,setUrl]=useState("");

    const _backgroundColor= "#ffefef";
    const _color="#e7195a";
    const _border=  "1px solid #e7195a";
    const _boxShadow= "#e7195a 0px 0px 1rem" ;


    return (
        <div className='flexContainerRowsCentered' style={{columnGap:"5rem",height:"100vh",justifyContent:"center"}}>
            <div className='flexContainerRowsCentered borderShadow' style={{justifyContent:"center",padding:"2rem"}}>
                <div className='flexContainerColoumnsCentered borderShadow' style={{position:"relative",borderRadius:"5px",padding:"2rem"}}>
                    <p>Change Profile</p>
                    <form className='flexContainerColoumnsCentered' onSubmit={handleSubmit}>
                        <input className='borderShadow'
                            placeholder='abc@gmail.com'
                            value={url}
                            style={{borderRadius:"2px",padding:"0.4rem"}}
                            onChange={(event)=>{setUrl(event.target.value)}}
                            required
                        />
                        <button className='borderShadow hoverScale SpclBg1'  style={{borderRadius:"2px",color:"white",padding:"0.4rem"}}>Set url</button>
                        {error!=""?<div className="errorBox" style={{backgroundColor:_backgroundColor,color:_color,border:_border,boxShadow:_boxShadow}}>
                            {error}
                        </div>:""}
                    </form>
                </div>
            </div>
        </div>
    )
}
