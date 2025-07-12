import express from "express"
import cors from "cors"
const app = express()
import { GoogleGenAI } from "@google/genai";
import { BASE_PROMPT, getSystemPrompt } from "./utils/systemPrompts";
import { reactBasePrompt } from "./utils/reactBase";
import { nodeBasePrompt } from "./utils/nodeBase";

app.use(express.json())
app.use(cors())

const ai = new GoogleGenAI({});



app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            systemInstruction: "Return either node or react based on what do you think this project should be. Only return a single word either 'node' or 'react'. Do not return anything extra",
            maxOutputTokens: 200,
            thinkingConfig: {
                thinkingBudget: 0, 
              },
        },

    });

    const answer = response.text
    if (answer == "react") {
        res.json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [reactBasePrompt]
        })
        return;
    }

    if (answer === "node") {
        res.json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [nodeBasePrompt]
        })
        return;
    }

    res.status(403).json({ message: "You cant access this" })
    return;

})

app.post("/chat", async (req, res) => {
    const messages = req.body.messages

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: messages,
        config: {
            systemInstruction: getSystemPrompt(),
            maxOutputTokens: 32768
        }
    });
   
    res.json({
        response:  response.text
    })
})

app.listen(8080, () => {
    console.log("Yo your backend is up")
})