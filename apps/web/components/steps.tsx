import { Check, Circle } from "lucide-react"

interface Props{
    name: string
    status: "completed" | "pending"
}


export const StepsComponent = ({name , status}: Props) => {
    return(
        <>
        <div className="w-full bg-black text-white border-md my-4 flex gap-4 items-center">
            {status === "completed" ? 
            <Check />  :
            <Circle />   
        }
        <p>Creating {name}</p>
        </div>
        </>
    )
}