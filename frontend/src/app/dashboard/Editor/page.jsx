'use client'
// pages/index.js
import SimpleEditor from '@/components/Editor/SimpleEditor';
import { useUserContext } from '@/context/user';
import { useEffect, useState } from 'react';

export default function Home() {
    const {user,setUser}=useUserContext()
    const [message,setMessage]=useState("")
    const [error,setError]=useState("")
    const [success,setSuccess]=useState("")
    const [codeHistory,setCodeHistory]=useState([])
    // console.log("\n\n\n",user,"\n\n\n")
    const origin=process.env.NEXT_PUBLIC_API_URL
    const [code, setCode] = useState(
    "# Write your code here\n# and prove your metal\n# among the bests");


    //getting different version's history
    const fetchingHistory=async()=>{
        setError("")
        const res=await fetch(origin+"/api/code/getAllCodeHistory",{
            method:"POST",
            body:JSON.stringify({ team_name:user.team_name,user }),
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        })
        const json=await res.json()
        if(!res.ok){
            if(json.error!="Your team hasn't submitted any code yet first save the code then get the history"){
                setError(json.error)
                console.log("got an error",json.error)
            }
            
            return ;
        }
        setCodeHistory(json.history)
        console.log(json.history)
    }


    useEffect(()=>{
        if(user && user.team_name){
            fetchingHistory()
        }
        // console.log(user,"lo ho gaya user change")
    },[user])



    //getting back to a version
    const getBackVersion= async (e)=>{

        setError("")
        const res=await fetch(process.env.NEXT_PUBLIC_API_URL+"/api/code/getCodeAtCommit",{
                method:"POST",
                body:JSON.stringify({ team_name:user.team_name,commitHash:e.target.value }),
                 headers:{
                        "Content-Type":"application/json"
                },
                credentials:"include"
            })
            const json=await res.json()
            if(!res.ok){
                setError(json.error);
                console.log("error in getting the history back",json.error);
                return ;
            }
            console.log(json)
            setCode(json.code)
    }

























    const _backgroundColor= "#ffefef";
    const _color="#e7195a";
    const _border=  "1px solid #e7195a";
    const _boxShadow= "#e7195a 0px 0px 1rem" ;
    
    const __backgroundColor= "#efffef";
    const __color="#19e719";
    const __border=  "1px solid #19e719";
    const __boxShadow= "#19e719 0px 0px 1rem" 


    const submitCode =  (code) => {
        return (
            async (e)=>{
                setError("")
                setSuccess("")
                if(message==""){
                    console.log("Cann't save code with empty message")
                    setError("Cann't save code with empty message")
                    return ;
                }
                const res = await fetch(origin+'/api/code/savingCode', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ content:code ,user,team_name:user.team_name,message}),
                });

                const data = await res.json();
                if(!res.ok){
                    setError(data.error)
                    console.log("cann't submit the code",data.error)
                    return ;
                }
                setSuccess("Your code has been success fully submitted")
                setCodeHistory(data.history)
                console.log(data.history)
            }
        )
    }


    if(user.team_name!=null){
    return (
        <div className='flexContainerColoumnsCentered' style={{padding:"0" ,alignItems:"normal",position:"relative"}} >
            <SimpleEditor code={code} setCode={setCode} onSubmit={submitCode} />
            
            <input placeholder='leave a message about your changes..' type="text" className='borderShadow' value={message} style={{borderRadius:"2px",padding:"0.4rem",width:"100%"}}
            onChange={(e)=>{setMessage(e.target.value)}} />

            {error!=""?<div className="errorBox" style={{backgroundColor:_backgroundColor,color:_color,border:_border,boxShadow:_boxShadow}}>
                    {error}
            </div>:null}
            {success!=""?<div className="successBox" style={{backgroundColor:__backgroundColor,color:__color,border:__border,boxShadow:__boxShadow}}>
                    {success}
            </div>:null}
            {codeHistory!=[]?
            (<select onChange={getBackVersion}>
                {codeHistory.map((commit)=>{
                    return (
                        <option value={commit.hash} key={commit.hash}>
                            {commit.user}--{commit.message}
                        </option>
                    )
                })}
            </select>):null}
            
            

        </div>
    );
    }else{
        return (
            <div>
                Join or Create a team first to write code for it
            </div>
        )
    }
}
