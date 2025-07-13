"use client"

import { motion } from "framer-motion";
import { useState } from "react";

interface Props {
    url?: string
}

export const Preview = ({ url }: Props) => {
    const [loading, setLoading] = useState(true);

    return (
        <div className="w-full h-full flex items-center justify-center flex-grow z-10">
            {url && !loading ? (
                <iframe
                    width="100%"
                    height="100%"
                    src={url}
                    title="WebContainer Preview"
                    style={{ border: "none", flex: 1 }}
                    onLoad={() => setLoading(false)}
                />
            ) : (
                <div className="relative flex items-center justify-center h-full w-full bg-muted text-white text-4xl font-bold overflow-hidden">
                    <motion.h1
                        className="relative z-10 text-center text-2xl font-bold bg-gradient-to-r from-neutral-700 via-white to-neutral-700 bg-clip-text text-transparent"
                        style={{
                            backgroundSize: "200% 100%",
                        }}
                        initial={{ backgroundPosition: "200% 0" }}
                        animate={{ backgroundPosition: "-200% 0" }}
                        transition={{
                            duration: 2.5,
                            ease: "easeInOut",
                            repeat: Infinity,
                            repeatType: "loop",
                        }}
                    >
                        Loading...
                    </motion.h1>
                </div>
            )}
        </div>
    )
}