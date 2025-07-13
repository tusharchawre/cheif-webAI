"use client"

import { Editor } from "@monaco-editor/react"
import { FileType } from "./CodeInterface"

import { useState } from "react"
import { FileExplorer } from "./FileExplorer"

interface EditorProps {
    files: FileType[]
}

export const CodeEditor = ({ files }: EditorProps) => {
    const [selectedFile, setSelectedFile] = useState<FileType | null>(null);

    const handleSelectFile = (file: FileType) => {
        setSelectedFile(file);
    }

    return (
        <div className="flex w-full flex-grow h-full">
            <div className="w-64 h-full flex flex-col gap-2 py-2 border-r border-white/30">
                <div className="border-b border-white/30 px-2 h-8 flex items-center">
                    <p>Files</p>
                </div>
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
            </div>
        </div>
    )
}