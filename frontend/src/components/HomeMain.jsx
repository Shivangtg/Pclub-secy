import Image from "next/image";
import Leaderboard from "./Leaderboard";
import AnimatedHeading from "./AnimatedHeading";

export default function HomeMain(){
    
    return (
        <main>
            <div className="flexContainerColoumnsCentered relative inline-block justify-center item-ceter">
                <Image src="/bg.svg" alt="alt" width={786} height={684}/>
                <AnimatedHeading />
            </div>
            <Leaderboard/>
        </main>
    )
}