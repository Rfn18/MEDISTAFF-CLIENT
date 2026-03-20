import { HeartPulse } from "lucide-react";

export const Logo = () => {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl auth-gradient shadow-lg">
        <HeartPulse
          className="h-8 w-8 text-primary-foreground"
          strokeWidth={2.5}
        />
      </div>
      <h1 className="text-2xl font-bold text-foreground">MediStaff</h1>
      <p className="text-sm text-muted-foreground">
        Pengelolaan Staff Rumah Sakit
      </p>
    </div>
  );
};
