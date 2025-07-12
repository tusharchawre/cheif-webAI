"use client"
import { cn } from "@/lib/utils"
import { useState } from "react"
import { ScrollArea } from "./ui/scroll-area"

type Message = {
    type: "user" | "agent",
    content: string
}

export const ChatInterface = () => {
    const [messages, setMessages] = useState<Message[]>([
        {
            type: "user",
            content: "Create a todo app"
        },
        {
            type: "agent",
            content: "Sure! What features would you like in your todo app?"
        },
        {
            type: "user",
            content: "I want to be able to add, delete, and mark todos as done."
        },
        {
            type: "agent",
            content: "Great! I'll set up a simple React app with those features."
        },
        {
            type: "user",
            content: "Can you use TypeScript?"
        },
        {
            type: "agent",
            content: "Absolutely! The app will be written in TypeScript."
        },
        {
            type: "user",
            content: "Can you add a due date for each todo?"
        },
        {
            type: "agent",
            content: "Of course! I'll include a due date field for each todo item."
        },
        {
            type: "user",
            content: "How about filtering todos by their status?"
        },
        {
            type: "agent",
            content: "Good idea! I'll add filters for completed and pending todos."
        },
        {
            type: "user",
            content: "Can you also add the ability to edit a todo?"
        },
        {
            type: "agent",
            content: "Yes, I'll implement an edit feature for todos."
        },
        {
            type: "user",
            content: "Can you show me the folder structure?"
        },
        {
            type: "agent",
            content: "Certainly! Here is a suggested folder structure:\n\n- src/\n  - components/\n  - pages/\n  - types/\n  - utils/"
        },
        {
            type: "user",
            content: "Can you write the code for the Todo component?"
        },
        {
            type: "agent",
            content: "Here's a basic Todo component in TypeScript:\n\n```tsx\ninterface TodoProps {\n  todo: Todo;\n  onToggle: (id: string) => void;\n  onDelete: (id: string) => void;\n  onEdit: (id: string, content: string) => void;\n}\n\nexport const Todo: React.FC<TodoProps> = ({ todo, onToggle, onDelete, onEdit }) => (\n  <div>\n    <input type=\"checkbox\" checked={todo.completed} onChange={() => onToggle(todo.id)} />\n    <span>{todo.content}</span>\n    <button onClick={() => onEdit(todo.id, todo.content)}>Edit</button>\n    <button onClick={() => onDelete(todo.id)}>Delete</button>\n  </div>\n);\n```"
        },
        {
            type: "user",
            content: "Can you add tests for the Todo component?"
        },
        {
            type: "agent",
            content: "Absolutely! I'll provide some unit tests using Jest and React Testing Library."
        }
    ])

    return (
        <ScrollArea className="h-full w-full px-4 overflow-auto">
            {messages.map((message) => (
                <div className={cn("w-fit h-fit px-4 py-2 rounded-md my-2",
                    message.type === "user" ? "bg-muted ml-auto" : "bg-black mr-auto"
                )}>
                    {message.content}
                </div>
            ))}

        </ScrollArea>
    )
}