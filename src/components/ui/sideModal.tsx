import type { ReactNode } from "react";
import { X } from "lucide-react";

type SideModalProps = {
  title: string;
  open: boolean;
  onClose: () => void;
  children: ReactNode;
};

export default function SideModal({
  title,
  open,
  onClose,
  children,
}: SideModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 flex justify-end bg-black/20 z-50">
      <div className="flex flex-col bg-accent-foreground w-100 h-full overflow-y-auto shadow-md">
        {/* Header */}
        <div className="sticky top-0 bg-accent-foreground flex items-center justify-between p-4 border-b border-border">
          <h1 className="text-lg font-semibold text-blue-dark">{title}</h1>
          <X
            size={18}
            className="text-blue-dark cursor-pointer"
            onClick={onClose}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-6 p-4">{children}</div>
      </div>
    </div>
  );
}
