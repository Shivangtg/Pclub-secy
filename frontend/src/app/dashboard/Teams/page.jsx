// 'use client'

import AllTeams from "@/components/Teams/AllTeams";

export default async function page(){
    const teams=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/Teams/getAllTeams")
    const teamsObj=await teams.json()
    console.log(teamsObj)

    return (
        <AllTeams Teams={teamsObj.teams} />
    )
}