'use client'
import { useUserContext } from "@/context/user"
import { button_primary, button_secondary } from "@/utils/default_tailwind_classes"
import Image from "next/image"
import Link from "next/link"

export default function Nav(){
    const {user,setUser}=useUserContext()
    if(user!=null){
        return (
        <nav>
            <div>
                <button>Your team</button>
                <button>Leader board</button>
            </div>
        </nav>)
    }else{
        return (
            <nav className="flexContainerRowsCentered p-4 bg-gray-900" >
                <div className="flex items-center  text-xl font-bold col-gap-1">
                    <Image src="/App-Icon.svg" alt="Icon" className="w-10" width={800} height={800} />
                    PROG BATTLE
                </div>
                <div className="flexContainerRowsEnd" style={{flexGrow:1}}>
                    <Link href="/Authentication/signup">
                        <button className={button_primary}>Sign Up</button>
                    </Link>
                    <Link href="/Authentication/login">
                        <button className={button_secondary}>Login</button>
                    </Link>
                </div>
            </nav>
        )
    }
}