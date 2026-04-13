import { toast } from "sonner";

const baseStyle = "!rounded-lg !px-4 !py-3 text-sm font-medium";

export const toastSuccess = (message: string) => {
  toast.success(message, {
    className: `${baseStyle} !bg-success !text-success-foreground`,
  });
};

export const toastError = (message: string) => {
  toast.error(message, {
    className: `${baseStyle} !bg-destructive !text-destructive-foreground`,
  });
};

export const toastWarning = (message: string) => {
  toast.warning(message, {
    className: `${baseStyle} !bg-warning !text-warning-foreground`,
  });
};

export const toastInfo = (message: string) => {
  toast(message, {
    className: `${baseStyle} !bg-primary !text-primary-foreground`,
  });
};
