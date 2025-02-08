import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import CustomCalendar from '../calender/CustomCalender';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { calculateEMI } from '@/utils/calculation';
import { useState } from 'react';
import { useAppDispatch } from '@/store/store';

const formSchema = z.object({
  itemName: z.string().min(2, {
    message: 'Item name must be at least 2 characters.',
  }),
  principal: z.number().min(1000, {
    message: 'Principal amount must be at least ₹1,000.',
  }),
  interestRate: z.number().min(1).max(100, {
    message: 'Interest rate must be between 1 and 100.',
  }),
  billDate: z.date({ message: 'Please select a bill date.' }),
  tenure: z.number().min(1).max(360, {
    message: 'Tenure must be between 1 and 360 months.',
  }),
});

export type TFormValues = z.infer<typeof formSchema>;

const AddEMIForm = ({
  setIsOpen,
}: {
  setIsOpen: (isOpen: boolean) => void;
}) => {
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const form = useForm<TFormValues>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: TFormValues) {
    console.log(values);
    const newEMI = calculateEMI(values);

    console.log(newEMI);
    if (newEMI) {
      dispatch.emiModel.addEmi(newEMI);
      setIsOpen(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='grid grid-cols-2 gap-4'
      >
        <FormField
          control={form.control}
          name='itemName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Item Name</FormLabel>
              <FormControl>
                <Input placeholder='e.g., Laptop' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='principal'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Principal Amount (₹)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='e.g., 50000'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='interestRate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Interest Rate (%)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  step='0.01'
                  placeholder='e.g., 12.5'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='billDate'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bill Date</FormLabel>
              <FormControl>
                <FormControl>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'pl-3 text-left font-normal w-full',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span className='truncate'>Select Bill Date</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <CustomCalendar
                        mode='single'
                        required
                        autoFocus
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setOpen(false);
                        }}
                        endMonth={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                </FormControl>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='tenure'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tenure (Months)</FormLabel>
              <FormControl>
                <Input
                  type='number'
                  placeholder='e.g., 12'
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' className='w-36 col-span-2 ml-auto'>
          Add EMI
        </Button>
      </form>
    </Form>
  );
};

export default AddEMIForm;
