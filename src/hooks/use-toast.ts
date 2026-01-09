import { toast as sonnerToast } from "sonner";

type ToastVariant = "default" | "destructive";

interface ToastProps {
    title?: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}

/**
 * Custom useToast hook yang wrapping sonner toast
 * Mendukung pattern shadcn: toast({ title, description, variant })
 */
export function useToast() {
    const toast = (props: ToastProps) => {
        const { title, description, variant = "default", duration, action } = props;

        const toastOptions = {
            description,
            duration,
            action: action
                ? {
                    label: action.label,
                    onClick: action.onClick,
                }
                : undefined,
        };

        // Jika variant destructive, gunakan toast.error
        if (variant === "destructive") {
            return sonnerToast.error(title || "Error", toastOptions);
        }

        // Default toast
        return sonnerToast(title || "", toastOptions);
    };

    return {
        toast,
        // Helper methods untuk penggunaan langsung
        success: (message: string, description?: string) =>
            sonnerToast.success(message, { description }),
        error: (message: string, description?: string) =>
            sonnerToast.error(message, { description }),
        info: (message: string, description?: string) =>
            sonnerToast.info(message, { description }),
        warning: (message: string, description?: string) =>
            sonnerToast.warning(message, { description }),
        loading: (message: string, description?: string) =>
            sonnerToast.loading(message, { description }),
        dismiss: sonnerToast.dismiss,
        promise: sonnerToast.promise,
    };
}
