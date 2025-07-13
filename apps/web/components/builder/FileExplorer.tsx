import { useState } from "react";
import { FileType } from "./CodeInterface"
import { ChevronDown, ChevronRight } from "lucide-react";

type FileExplorerProps = {
    file: FileType;
    level: number;
    selectedFile: FileType | null;
    onSelectFile: (file: FileType) => void;
}

export const FileExplorer = ({ file, level, selectedFile, onSelectFile }: FileExplorerProps) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const indentUnit = 16;
    const currentIndentLevelPadding = level * indentUnit; // Padding for the current level

    const handleFileClick = () => {
        if (file.type === "file") {
            onSelectFile(file);
        } else {
            setIsExpanded(!isExpanded);
            console.log(`Toggling expansion for ${file.name}. New state: ${!isExpanded}`);
        }
    }

    // Sort children: directories first, then files, both alphabetically
    const sortedChildren = file.children ? [...file.children].sort((a, b) => {
        if (a.type === "directory" && b.type === "file") {
            return -1; // Directory comes before file
        }
        if (a.type === "file" && b.type === "directory") {
            return 1; // File comes after directory
        }
        return a.name.localeCompare(b.name); // Sort alphabetically by name
    }) : [];

    return (
        <div>
            <div
                className={`flex gap-2 items-center cursor-pointer transition ${selectedFile?.id === file.id ? "bg-neutral-500" : ""}`}
                style={{ paddingLeft: `${currentIndentLevelPadding}px` }}
                onClick={handleFileClick}
            >
                {file.type === "directory" &&

                    (isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />)

                }
                <p className="px-2">
                    {file.name}
                </p>

            </div>
            {file.type === "directory" && isExpanded && sortedChildren.length > 0 && (
                <div
                    className="relative"
                    style={{ marginLeft: `${currentIndentLevelPadding}px` }}
                >
                    <div
                        className="absolute top-0 bottom-0 border-l border-neutral-600"
                        style={{ left: `${indentUnit / 2}px` }} // Position relative to the children container's left edge
                    />
                    {sortedChildren.map((childFile) => (
                        <div key={childFile.id} className="relative">
                            <FileExplorer
                                file={childFile}
                                level={level + 1}
                                selectedFile={selectedFile}
                                onSelectFile={onSelectFile}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
