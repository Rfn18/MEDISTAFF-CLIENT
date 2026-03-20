import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

export const HeaderLogo = () => {
  return (
    <>
      <Link to={"/"}>
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl auth-gradient shadow-lg">
          <HeartPulse
            className="h-8 w-8 text-primary-foreground"
            strokeWidth={2.5}
          />
        </div>
      </Link>
    </>
  );
};
