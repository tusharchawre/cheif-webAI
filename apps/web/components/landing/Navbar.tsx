import Link from "next/link";
import { VT323 } from "next/font/google";
import { IconBrandGithub, IconBrandX } from "@tabler/icons-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const vt323 = VT323({ weight: "400" });

export const Navbar = () => {
    const socials = [
        {
            name: "Github",
            href: "https://github.com/tusharchawre",
            icons: <IconBrandGithub className="h-5 w-5" />,
            tooltip: "Chaos behind this creation"
        },
        {
            name: "Twitter",
            href: "https://twitter.com/TusharCtwt",
            icons: <IconBrandX className="h-5 w-5" />,
            tooltip: "The Creator"
        },
    ];

    return (
        <>
            <div className="h-16 w-full bg-black px-8">
                <div className="flex h-full w-full items-center justify-between">
                    <div className={`${vt323.className} text-4xl tracking-tighter text-white`}>
                        dizzi
                    </div>

                    <div className="flex h-full items-center gap-4">
                        {socials.map((item, idx) => (
                            <Tooltip key={idx}>
                                <TooltipTrigger asChild><Link href={item.href} key={idx}>
                                    <button
                                        className="rounded-md border border-neutral-700 p-1 transition-all text-neutral-300 hover:bg-neutral-800"
                                        key={idx}
                                    >
                                        {item.icons}
                                    </button>
                                </Link>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p className="text-xs">{item.tooltip}</p>
                                </TooltipContent>
                            </Tooltip>


                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};
