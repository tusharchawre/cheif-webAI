"use client"

import { useState } from "react"

type Files = {
    type: "directory" | "file",
    name: string
    content?: string
}

export const CodeInterface = () => {
    const [files, setFiles] = useState<Files[]>([
        {
            type: "directory",
            name: "src",
        },
        {
            type: "file",
            name: "src/index.tsx",
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
            type: "file",
            name: "src/App.tsx",
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
        },
        {
            type: "directory",
            name: "public",
        },
        {
            type: "file",
            name: "public/index.html",
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
        },
        {
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
                    <div className="w-64 h-full border-r border-white/30">

                    </div>
                </div>

            </div>

        </div>
    )
}