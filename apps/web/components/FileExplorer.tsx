import { useState } from "react";
import { File } from "./CodeInterface"
import { ChevronDown, ChevronRight } from "lucide-react";

type FileExplorerProps = {
    file: File;
    level: number;
    selectedFile: File | null;
    onSelectFile: (file: File) => void;
}

export const FileExplorer = ({ file, level, selectedFile, onSelectFile }: FileExplorerProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const paddingLeft = level * 16;

    const handleFileClick = () => {
        if (file.type === "file") {
            onSelectFile(file);
        } else {
            setIsExpanded(!isExpanded);
        }
    }

    return (
        <div>
            <div
                className={`flex gap-2 items-center cursor-pointer transition ${selectedFile?.id === file.id ? "bg-neutral-500" : ""}`}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={handleFileClick}
            >
                {file.type === "directory" &&

                    (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)

                }

                {file.name}
            </div>
            {file.type === "directory" && isExpanded && file.children && (
                <div>
                    {file.children.map((childFile) => (
                        // Recursively Rendering File Explorer
                        <FileExplorer
                            key={childFile.id}
                            file={childFile}
                            level={level + 1}
                            selectedFile={selectedFile}
                            onSelectFile={onSelectFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
