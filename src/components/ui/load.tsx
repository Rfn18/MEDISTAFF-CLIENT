import { Loader2 } from "lucide-react";

export function Loading({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-pulse">
      <Loader2 size={32} className="text-blue-primary animate-spin" />
      <p className="text-sm text-muted-foreground mt-3">{message}</p>
    </div>
  );
}

