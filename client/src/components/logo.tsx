import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
    return (
        <h1
            className={cn([
                "z-10 ml-[5%] font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl 2xl:text-6xl text-white",
                className,
            ])}
        >
            HackCC - All California Community Colleges
        </h1>
    );
}
