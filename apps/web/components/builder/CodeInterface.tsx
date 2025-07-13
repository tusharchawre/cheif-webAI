"use client"

import { useEffect, useState } from "react"
import { parseCheifArtifactToWebcontainerFiles, convertFileSystemTreeToFileTypeArray } from "@/utils/parser";

import { CodeEditor } from "./CodeEditor";
import { Preview } from "./Preview";
import { motion, AnimatePresence } from "framer-motion"



export type FileType = {
    id: string;
    type: "directory" | "file",
    name: string,
    children?: FileType[]
    content?: string
}

interface InterfaceProps {
    responseData?: any,
    url?: string
}


export const CodeInterface = ({ responseData , url }: InterfaceProps) => {

    const tabs = ["Code", "Preview"]

    const [activeTab, setActiveTab] = useState(tabs[0])


    const [files, setFiles] = useState<FileType[]>([
        {
            id: "src",
            type: "directory",
            name: "src",
            children: [
                {
                    id: "src-index.tsx",
                    type: "file",
                    name: "index.tsx",
                    content: `import React from "react";
export const App = () => (
  <div>
    <h1>Hello, world!</h1>
    <p>This is a dummy React app.</p>
  </div>
);
`
                },
                {
                    id: "src-app.tsx",
                    type: "file",
                    name: "App.tsx",
                    content: `import React from "react";

const App = () => {
  return (
    <main>
      <h2>Welcome to the Dummy App</h2>
      <p>Edit src/App.tsx to get started.</p>
    </main>
  );
};

export default App;
`
                }
            ]
        },
        {
            id: "public",
            type: "directory",
            name: "public",
            children: [
                {
                    id: "public-index.html",
                    type: "file",
                    name: "index.html",
                    content: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8" />
    <title>Dummy App</title>
</head>
<body>
    <div id="root"></div>
</body>
</html>
`
                }
            ]
        },
        {
            id: "package.json",
            type: "file",
            name: "package.json",
            content: `{
  "name": "dummy-app",
  "version": "1.0.0",
  "main": "src/index.tsx",
  "scripts": {
    "start": "react-scripts start"
  }
}
`
        }
    ])

    useEffect(() => {
        if (responseData != null) {
            const aiGeneratedFiles = parseCheifArtifactToWebcontainerFiles(responseData);
            console.log("tusharchawer", aiGeneratedFiles)

            const filesArray = convertFileSystemTreeToFileTypeArray(aiGeneratedFiles);

            // Sort the top-level files array
            const sortedTopLevelFiles = [...filesArray].sort((a, b) => {
                if (a.type === "directory" && b.type === "file") {
                    return -1; // Directory comes before file
                }
                if (a.type === "file" && b.type === "directory") {
                    return 1; // File comes after directory
                }
                return a.name.localeCompare(b.name); // Sort alphabetically by name
            });

            setFiles(sortedTopLevelFiles);
            console.log("Files array after conversion:", sortedTopLevelFiles); // Add this line

        }

    }, [responseData])




    return (
        <div className="w-full h-full bg-black p-2">
            <div className="rounded-md border border-white/30 bg-muted h-full w-full flex flex-col relative">
                {/* Header */}
                <div className="h-16 border-b flex items-center border-b-white/30">
                    <motion.div className="ml-4  w-48 rounded-md bg-black items-center px-2 h-12 flex justify-between py-2">
                        {
                            tabs.map((tab) => (
                                <div onClick={() => setActiveTab(tab)} className="cursor-pointer relative flex items-center justify-center px-4 py-2">
                                    {activeTab === tab && <motion.div layoutId="highlight" className="absolute w-full h-full bg-muted rounded-md px-2 py-1" />}
                                    <span className="relative z-10">
                                        {tab}
                                    </span>
                                </div>
                            ))
                        }

                    </motion.div>
                </div>
                <div className="flex-grow overflow-hidden">
                    <motion.div
                        className="flex w-[200%] h-full"
                        animate={{ x: activeTab === "Code" ? "0%" : "-50%" }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-1/2">
                            <CodeEditor files={files} />
                        </div>
                        <div className="w-1/2 h-full">
                            <Preview url={url} />
                        </div>
                    </motion.div>
                </div>


            </div>

        </div>
    )
}