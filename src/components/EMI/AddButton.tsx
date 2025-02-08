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
import AddEMIForm from './AddEMIForm';

const AddEMIButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add EMI</Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={(ev) => ev.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add New EMI</DialogTitle>
          <DialogDescription>
            Enter the details of your new EMI here.
          </DialogDescription>
        </DialogHeader>
        <AddEMIForm setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default AddEMIButton;
