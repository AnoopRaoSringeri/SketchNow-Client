import { Loader2Icon } from "lucide-react";

export const Loader = function Loader({ loading }: { loading?: boolean }) {
    return loading ? (
        <div className="absolute z-[999] flex size-full items-center justify-center bg-primary-foreground/50">
            <Loader2Icon className="animate-spin" size={50} />
        </div>
    ) : null;
};
