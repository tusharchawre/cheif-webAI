"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useState } from "react"

interface InputBoxProps {
    placeholder?: string
}

export const InputBox = ({ placeholder }: InputBoxProps) => {
    const [prompt , setPrompt] = useState("")

    return (
        <div className="h-full w-full px-2 py-2 relative">
            <Textarea onChange={(e)=> setPrompt(e.target.value)} placeholder={placeholder} className="h-full md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 border-none resize-none w-full" />
            <Button disabled={prompt === ""} className="absolute bottom-5 h-9 w-9 right-5" size="icon">
                <ArrowRight className="!size-5"/>
            </Button>
        </div>
    )
}