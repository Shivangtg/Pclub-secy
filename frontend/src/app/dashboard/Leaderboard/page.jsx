
import TopTeams from "@/components/Leaderboard/TopTeams";
import Image from "next/image";

export default async function dashboard(){
    const topPrimaryTeams=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/Admin/getResultOfRoundOne",{
        method:"POST"
    });
    const json=await topPrimaryTeams.json()
    console.log(json)
    return (
        <TopTeams latestTopTeams={json.resultRoundOne} />
    )
}