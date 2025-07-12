"use client"

import { ChevronDown, ChevronRight } from "lucide-react"
import { useState } from "react"
import { FileExplorer } from "./FileExplorer";
import Editor from '@monaco-editor/react';



export type File = {
    id: string;
    type: "directory" | "file",
    name: string,
    children?: File[]
    content?: string
}


export const CodeInterface = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [files, setFiles] = useState<File[]>([
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

    const handleSelectFile = (file: File) => {
        setSelectedFile(file);
    }

    return (
        <div className="w-full h-full bg-black p-2">
            <div className="rounded-md bg-muted h-full w-full flex flex-col">
                {/* Header */}
                <div className="h-16 border-b flex items-center border-b-white/30">
                    <div className="ml-4 w-48 rounded-md bg-black items-center px-2 h-12 flex justify-between py-2">
                        <div className="bg-muted py-2 px-4 rounded-md">
                            <p>Code</p>
                        </div>
                        <div className="py-2 px-4 rounded-md">
                            <p>Preview</p>
                        </div>
                    </div>
                </div>

                {/* Interface */}
                <div className="flex w-full flex-grow">
                    <div className="w-64 h-full flex flex-col gap-2 py-2 border-r border-white/30">
                        {files.map((file) => (
                            <FileExplorer
                                key={file.id}
                                file={file}
                                level={0}
                                selectedFile={selectedFile}
                                onSelectFile={handleSelectFile}
                            />
                        ))}
                    </div>
                    <div className="flex-grow">
                        <Editor
                            theme="vs-dark" 
                            
                            options={{
                                scrollBeyondLastLine: false,
                                fontSize: 18,
                                
                                minimap: {
                                    enabled: false 
                                },
                                cursorStyle: "line-thin",
                                cursorBlinking: "smooth",
                                renderLineHighlight: "gutter",
                                bracketPairColorization: {
                                    enabled: true
                                },
                                guides: {
                                    indentation: true
                                },
                                lineNumbers: 'on'
                            }}
                            defaultLanguage="javascript"
                            value={selectedFile?.content || ""} />




                        {/* {selectedFile && (
                            <textarea
                                className="w-full h-full bg-black text-white p-2 rounded-md font-mono text-sm"
                                value={findFileById(files, selectedFile)?.content || ""}
                                readOnly
                            />
                        )} */}
                    </div>
                </div>

            </div>

        </div>
    )
}