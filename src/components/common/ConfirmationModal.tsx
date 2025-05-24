import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogDescription,
    AlertDialogContent,
    AlertDialogTitle,
    AlertDialogFooter,
    AlertDialogHeader,
} from '../ui/alert-dialog';

const ConfirmationModal = ({
    title,
    description,
    cancelText,
    confirmText,
    onConfirm,
    onCancel,
    open,
    setOpen,
}: {
    title: string;
    description?: string;
    cancelText?: string;
    confirmText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
    setOpen: (open: boolean) => void;
}) => {
    const handleCancel = () => {
        setOpen(false);
        onCancel();
    };

    const handleConfirm = () => {
        setOpen(false);
        onConfirm();
    };
    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel} className="cursor-pointer">
                        {cancelText || 'Cancel'}
                    </AlertDialogCancel>
                    <AlertDialogAction onClick={handleConfirm} className="cursor-pointer">
                        {confirmText || 'Confirm'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ConfirmationModal;
