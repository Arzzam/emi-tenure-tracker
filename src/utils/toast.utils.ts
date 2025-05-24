import { toast, ToasterProps } from 'sonner';

export const successToast = (message: string, ToastProps?: ToasterProps) => {
    toast.success(message, {
        duration: 5000,
        position: 'top-center',
        ...ToastProps,
    });
};

export const errorToast = (message: string, ToastProps?: ToasterProps) => {
    toast.error(message, {
        duration: 5000,
        position: 'top-center',
        ...ToastProps,
    });
};

export const infoToast = (message: string, ToastProps?: ToasterProps) => {
    toast.info(message, {
        duration: 5000,
        position: 'top-center',
        ...ToastProps,
    });
};
