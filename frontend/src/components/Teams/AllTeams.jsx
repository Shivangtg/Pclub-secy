'use client'

import clsx from 'clsx';
import Image from 'next/image';
import { lusitana } from '@/utils/fonts';
import AuraButton from '../AuraButton';
import Link from 'next/link';
import { useUserContext } from '@/context/user';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function AllTeams({Teams}) {
  
  const [error,setError]=useState("")
  const {user,setUser}=useUserContext()
  const router=useRouter();
  console.log(user)
  
  
  const handleJoiningTeam=(team)=>{
    return async (e)=>{
      setError("")
      const res=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/Teams/joinATeam",{
        method:"POST",
        body:JSON.stringify({team:team,user:user}),
        headers:{
            "Content-Type":"application/json"
        },
        credentials:"include"
      })
      const json=await res.json()
      if(!res.ok){
        setError(json.error);
        console.log("error in login",json.error);
        return ;
      }
      await setUser(json.user)
      router.push("/dashboard/Teams")
    }
  }

  const handleChallengingTeam=(team)=>{
    return (
      async function runChallenge() {
          try {
              const response = await fetch(process.env.NEXT_PUBLIC_API_URL+'/api/Admin/conductChallenges', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      challengerBot: user.team_name,
                      botToChallenge: team.name
                  })
              });

              if (!response.ok) {
                  throw new Error('Challenge failed');
              }

              // For direct download
              const blob = await response.blob();
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'game_log.csv';
              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
              window.URL.revokeObjectURL(url);

          } catch (error) {
              console.error('Error:', error);
              alert('Challenge failed: ' + error.message);
          }
      }
    )
  }

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <div style={{display:"flex",flexDirection:"row",justifyContent:"space-between",padding:"1rem"}}>
        <h2 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
          All teams
        </h2>
        {user?.team_name==null?
          <AuraButton className="borderShadow" href="/dashboard/Teams/CreateTeam" style={{padding:"0.3rem"}}>
            Create Team
          </AuraButton>:null
        }
      </div>


      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {/* NOTE: Uncomment this code in Chapter 7 */}

        <div className=" bg-gray-200 rounded-xl px-6">
          {Teams.map((team, i) => {
            return (
              <div
                key={team.id}
                className={clsx(
                  'flex flex-row items-center justify-between py-4',
                  {
                    'border-t': i !== 0,
                  },
                )}
              >
                <div style={{columnGap:"1rem"}} className="flex items-center">
                  <Image
                    src={team.image_url}
                    alt={`${team.name}'s profile picture`}
                    className="p-1 bg-white bgmr-4 rounded-full"
                    width={32}
                    height={32}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-lg font-semibold md:text-base">
                      {team.name}
                    </p>
                  </div>
                </div>
                {user?.team_name==null?
                <AuraButton className="borderShadow" auraColor="gray" onClick={handleJoiningTeam(team)} style={{padding:"0.3rem",backgroundColor:"white"}}>
                  Join Team
                </AuraButton>:null}
                {user?.team_name!=null && user.team_name!=team.name?
                <AuraButton className="borderShadow" auraColor="gray" onClick={handleChallengingTeam(team)} style={{padding:"0.3rem",backgroundColor:"white"}}>
                  Challenge team
                </AuraButton>:null}
              </div>
            );
          })}
        </div>
        {/* <div className="flex items-center pb-2 pt-6">
          <ArrowPathIcon className="h-5 w-5 text-gray-500" />
          <h3 className="ml-2 text-sm text-gray-500 ">Updated just now</h3>
        </div> */}
      </div>
    </div>
  );
}
