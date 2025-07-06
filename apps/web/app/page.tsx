"use client"
import { useState } from "react"
import Link from "next/link"

const page = () => {
  const [prompt, setPrompt] = useState("")


  return (
    <div className="w-full h-screen bg-black flex justify-center gap-4 flex-col items-center">

      <div className="w-1/2 h-52 border-white/30 border rounded-md">
        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} className="resize-none w-full h-full text-white" />
      </div>

      <Link
        href={{
          pathname: '/builder',
          query: {prompt}
        }}
      >
        <button className="bg-black border-[0.7] border-white/40 text-white px-4 py-2 rounded-md">Create</button>
      </Link>


    </div>
  )
}

export default page