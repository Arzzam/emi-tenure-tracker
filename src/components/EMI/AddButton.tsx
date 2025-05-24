import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { useState } from 'react';
import EMIForm from './EMIForm';
import { IEmi } from '@/store/models/emiModel';

const FormModal = ({ data }: { data?: IEmi }) => {
    const [isOpen, setIsOpen] = useState(false);
    const isEdit = !!data;
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>{isEdit ? 'Edit EMI' : 'Add EMI'}</Button>
            </DialogTrigger>
            <DialogContent onInteractOutside={(ev) => ev.preventDefault()}>
                <DialogHeader>
                    <DialogTitle>Add New EMI</DialogTitle>
                    <DialogDescription>Enter the details of your new EMI here.</DialogDescription>
                </DialogHeader>
                <EMIForm setIsOpen={setIsOpen} data={data} />
            </DialogContent>
        </Dialog>
    );
};

export default FormModal;
