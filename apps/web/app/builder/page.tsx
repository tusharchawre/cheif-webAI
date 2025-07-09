"use client";
import { parseCheifArtifactToWebcontainerFiles } from "@/utils/parser";
import { WebContainer } from "@webcontainer/api";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:8080";

export default function Builder() {
  const searchParams = useSearchParams();
  const prompt = searchParams.get("prompt");
  const [loading, setLoading] = useState(true);
  const [filesToMount, setFilesToMount] = useState<any>(null);
  const [url, setUrl] = useState("");

  // Effect 1: Fetches the AI-generated project files (changes/additions)
  useEffect(() => {
    async function fetchAndProcessFiles() {
      try {
        setLoading(true);
        setUrl("");
        const templateResponse = await fetch(`${API_URL}/template`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ prompt }),
        });
        const templateData = await templateResponse.json();
        const { prompts } = templateData;

        const messagesToSendToAI = [
          { role: "user", parts: [{ text: prompts[0] }] }, // This is BASE_PROMPT
          { role: "user", parts: [{ text: prompt }] }, // This is the user's actual request
        ];

        const aiResponse = await fetch(`${API_URL}/chat`, {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ messages: messagesToSendToAI }),
        });
        const aiResponseData = await aiResponse.json();

        console.log(
          "Raw AI Response XML (from /chat):",
          aiResponseData.response,
        );

        const aiGeneratedFiles =
          parseCheifArtifactToWebcontainerFiles(aiResponseData);
        console.log(
          "AI Generated Files (Expected additions/modifications):",
          aiGeneratedFiles,
        );

        const finalFiles = aiGeneratedFiles;
        console.log("Final Files to Mount (Base + AI-generated):", finalFiles);

        setFilesToMount(finalFiles);
      } catch (e) {
        console.error("Error fetching or parsing project files:", e);
        setLoading(false);
        setFilesToMount(null);
      }
    }

    fetchAndProcessFiles();
  }, [prompt]);

  // Effect 2: Boots WebContainer and runs commands ONLY when filesToMount is available
  useEffect(() => {
    if (!filesToMount) {
      return;
    }

    let webcontainerInstance: WebContainer | null = null; // Declare instance for cleanup

    async function bootAndRunWebContainer() {
      try {
        console.log("Booting WebContainer...");
        webcontainerInstance = await WebContainer.boot();
        console.log("WebContainer booted. Mounting files...");

        // Mount the correctly parsed and merged files
        await webcontainerInstance.mount(filesToMount);
        console.log("Files mounted.");

        // Ensure current working directory is root '/'
        const cdProcess = await webcontainerInstance.spawn("cd", ["/"]);
        await cdProcess.exit;
        console.log("WebContainer CWD changed to /");

        // OPTIONAL: List files in the root to confirm package.json presence
        console.log("WebContainer: Running ls -l / to verify mounted files...");
        const lsCheck = await webcontainerInstance.spawn("ls", ["-l", "/"]);
        lsCheck.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("WebContainer: ls -l / output:", data);
            },
          }),
        );
        await lsCheck.exit;
        console.log("WebContainer: ls -l / command finished.");

        console.log("WebContainer: Running npm install...");
        const installProcess = await webcontainerInstance.spawn("npm", [
          "install",
        ]);

        installProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("WebContainer: npm install output:", data);
            },
          }),
        );

        const installExitCode = await installProcess.exit;
        if (installExitCode !== 0) {
          console.error(
            `WebContainer: npm install exited with code ${installExitCode}`,
          );
          throw new Error("WebContainer: Unable to run npm install");
        }
        console.log("WebContainer: npm install finished successfully!");

        console.log("WebContainer: Running npm run dev...");
        const devProcess = await webcontainerInstance.spawn("npm", [
          "run",
          "dev",
        ]);

        devProcess.output.pipeTo(
          new WritableStream({
            write(data) {
              console.log("WebContainer: npm run dev output:", data);
            },
          }),
        );

        webcontainerInstance.on("server-ready", (port, url) => {
          setUrl(url);
          setLoading(false); // Only set loading to false once the server is actually ready
          console.log(
            `WebContainer: Server ready on port: ${port}, URL: ${url}`,
          );
        });
      } catch (error) {
        console.error("Error during WebContainer operations:", error);
        setLoading(false);
      }
    }

    bootAndRunWebContainer();

    // Cleanup function for when component unmounts or filesToMount changes
    return () => {
      if (webcontainerInstance) {
        console.log("Shutting down WebContainer...");
        webcontainerInstance.teardown();
        webcontainerInstance = null;
      }
    };
  }, [filesToMount]); // THIS IS CRUCIAL: Re-run this effect ONLY when filesToMount changes

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {loading ? (
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "24px",
            color: "#555",
          }}
        >
          <p>
            Setting up your development environment. This might take a moment...
          </p>
        </div>
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={url}
          title="WebContainer Preview"
          style={{ border: "none", flex: 1 }}
        />
      )}
    </div>
  );
}
