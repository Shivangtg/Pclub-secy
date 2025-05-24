'use client'

import { useUserContext } from '@/context/user';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const UserProfileCard = () => {
  const {user,setUser,loading}=useUserContext()

  if (loading || !user) {
    return <div>Loading user data...</div>;
  }


  const [error,setError]=useState("")
  const router=useRouter()
  const handleLeavingTeam=async (e)=>{
    setError("")
    const res=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/user/leaveTeam",{
      method:"POST",
      body:JSON.stringify({user:user}),
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
  }

  const _backgroundColor= "#ffefef";
  const _color="#e7195a";
  const _border=  "1px solid #e7195a";
  const _boxShadow= "#e7195a 0px 0px 1rem" ;
  
  return (
    <div className='flexContainerColoumnsCentered' style={styles.card}>
      <img
        src={user?user.image_url:""}
        alt="Profile"
        style={styles.profileImage}
      />
      <h2 style={styles.name}>{user.name}</h2>
      <p style={styles.email}>{user.email}</p>
      <p style={styles.email}>{user.team}</p>
      <div style={styles.buttonContainer}>
        <button style={styles.changeBtn} onClick={()=>{router.push("/dashboard/Profile/ChangeProfilePhoto")}} >Change Profile Picture</button>
        <button style={styles.changeBtn} onClick={handleLeavingTeam} >Leave Current Team</button>
      </div>
      {error!=""?<div className="errorBox" style={{backgroundColor:_backgroundColor,color:_color,border:_border,boxShadow:_boxShadow}}>
          {error}
      </div>:""}
    </div>
  );
};

const styles = {
  card: {
    width: '300px',
    padding: '20px',
    margin: '50px auto',
    textAlign: 'center',
    border: '3px solid #ff00ff',
    borderRadius: '20px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    fontFamily: 'sans-serif',
    position:"relative"
  },
  profileImage: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '15px',
    borderRadius:"50%"
  },
  name: {
    margin: '10px 0 5px',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  email: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#333',
  },
  team: {
    margin: '0 0 20px',
    fontSize: '14px',
    color: '#333',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
  },
  changeBtn: {
    padding: '10px',
    backgroundColor: '#00e0ff',
    color: '#000',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1',
  },
  deleteBtn: {
    padding: '10px',
    backgroundColor: '#e91e63',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: '1',
  },
};

export default UserProfileCard;
