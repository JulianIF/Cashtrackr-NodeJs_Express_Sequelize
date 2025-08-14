import Image from "next/image";

export default function Logo() 
{
    return (
        <Image 
            src="/logo.svg" 
            alt="Cashtrackr Logo" 
            width={400} 
            height={100}
            className="py-10 lg:py-20" 
            priority
            />
    );

}