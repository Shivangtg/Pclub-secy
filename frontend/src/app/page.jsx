"use client"
import HomeMain from "@/components/HomeMain";
import Nav from "@/components/Nav";
import { useUserContext } from "@/context/user";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const {user,setUser}=useUserContext()
  const router=useRouter();
  useEffect(()=>{
    if(user!=null||sessionStorage.getItem("user")){
      router.push("/dashboard")
    }
  })
  
  return (
    <>
    <Nav/>
    <HomeMain/>
    </>
  );
}
