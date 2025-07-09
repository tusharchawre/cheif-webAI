"use client";
import { useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/landing/Navbar";
import { HeroHeading } from "@/components/landing/Heading";
import { Footer } from "@/components/landing/Footer";

const page = () => {
  const [prompt, setPrompt] = useState("");

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center justify-between bg-black">
        <Navbar />
        <div className="flex w-full flex-col items-center justify-center">
          <HeroHeading />
          <div className="h-52 w-1/2 rounded-md border border-white/30">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="h-full w-full resize-none text-white"
            />
          </div>

          <Link
            href={{
              pathname: "/builder",
              query: { prompt },
            }}
          >
            <button className="rounded-md border-[0.7] border-white/40 bg-black px-4 py-2 text-white">
              Create
            </button>
          </Link>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default page;
