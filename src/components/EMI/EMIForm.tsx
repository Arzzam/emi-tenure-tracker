import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, IndianRupee, Info, PercentIcon } from 'lucide-react';
import { format } from 'date-fns';
import CustomCalendar from '../calender/CustomCalender';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { calculateEMI } from '@/utils/calculation';
import { useEffect, useState } from 'react';
import ToolTipWrapper from '../common/TooltipWrapper';
import { useCreateEmi, useUpdateEmi } from '@/hooks/useEmi';
import { IEmi } from '@/types/emi.types';

const formSchema = z.object({
    itemName: z.string().min(2, {
        message: 'Item name must be at least 2 characters.',
    }),
    principal: z.number().min(1000, {
        message: 'Principal amount must be at least ₹1,000.',
    }),
    interestRate: z.number().min(0).max(100, {
        message: 'Interest rate must be between 1 and 100.',
    }),
    billDate: z.date({ message: 'Please select a bill date.' }),
    tenure: z.number().min(1).max(360, {
        message: 'Tenure must be between 1 and 360 months.',
    }),
    interestDiscount: z.number().min(0).max(100, {
        message: 'Interest discount must be between 0 and 100.',
    }),
    interestDiscountType: z.enum(['percent', 'amount']),
    gst: z.number().min(0).max(100, {
        message: 'GST must be between 0 and 100.',
    }),
});

export type TFormValues = z.infer<typeof formSchema>;

const EMIForm = ({ setIsOpen, data }: { setIsOpen: (isOpen: boolean) => void; data?: IEmi }) => {
    const { mutate: updateEmi } = useUpdateEmi();
    const { mutate: addEmi } = useCreateEmi();
    const [open, setOpen] = useState(false);

    const isEdit = !!data;

    const form = useForm<TFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            itemName: data?.itemName || '',
            principal: data?.principal || undefined,
            interestRate: data?.interestRate || undefined,
            billDate: data?.billDate ? new Date(data.billDate) : undefined,
            tenure: data?.tenure || undefined,
            interestDiscount: data?.interestDiscount || undefined,
            interestDiscountType: data?.interestDiscountType || 'percent',
            gst: data?.gst || undefined,
        },
    });

    function onSubmit(values: TFormValues) {
        console.log(values);
        const calculatedValues = calculateEMI(values, data?.id);

        console.log(calculatedValues);
        if (calculatedValues) {
            if (isEdit) {
                updateEmi(calculatedValues);
            } else {
                addEmi(calculatedValues);
            }
            setIsOpen(false);
        }
    }

    const interestDiscount = form.watch('interestDiscount');
    const interestDiscountType = form.watch('interestDiscountType');

    const interestDiscountPlaceholder = interestDiscountType === 'amount' ? 'e.g., 1000 (₹)' : 'e.g., 12.5 (%)';

    useEffect(() => {
        if (interestDiscountType === 'amount') {
            form.setValue('interestDiscount', interestDiscount);
        } else {
            form.setValue('interestDiscount', interestDiscount);
        }
    }, [interestDiscountType, interestDiscount, form]);

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="itemName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Item Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Laptop" {...field} min={0} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="principal"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>Principal Amount (₹)</FormLabel>
                                <ToolTipWrapper content="Principal amount is the amount of money borrowed from the bank or lender.">
                                    <Info className="w-4 h-4" />
                                </ToolTipWrapper>
                            </div>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 50000"
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
                    name="interestRate"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>Interest Rate (%)</FormLabel>
                                <ToolTipWrapper content="If it is No Interest Loan, then use 0 for interest rate and interest discount">
                                    <Info className="w-4 h-4" />
                                </ToolTipWrapper>
                            </div>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g., 12.5"
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
                    name="billDate"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>Bill Date</FormLabel>
                                <ToolTipWrapper content="Use statement date as bill date. So that you can track your EMI date and bill date.">
                                    <Info className="w-4 h-4" />
                                </ToolTipWrapper>
                            </div>
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
                                                        <span className="truncate">Select Bill Date</span>
                                                    )}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <CustomCalendar
                                                mode="single"
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
                    name="tenure"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tenure (Months)</FormLabel>
                            <FormControl>
                                <Input
                                    type="number"
                                    placeholder="e.g., 12"
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
                    name="interestDiscount"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Interest Discount (%) / (₹)</FormLabel>
                            <FormControl>
                                <div className="relative">
                                    <Input
                                        type="number"
                                        placeholder={interestDiscountPlaceholder}
                                        {...field}
                                        onChange={(e) => field.onChange(Number(e.target.value))}
                                        className="pr-16"
                                    />

                                    <FormField
                                        control={form.control}
                                        name="interestDiscountType"
                                        render={({ field }) => (
                                            <div className="absolute inset-y-0 right-2 flex items-center space-x-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        field.onChange(field.value === 'amount' ? 'percent' : 'amount')
                                                    }
                                                    className="bg-transparent border-none text-gray-500 hover:bg-transparent hover:text-foreground cursor-pointer"
                                                    {...field}
                                                >
                                                    {field.value === 'amount' ? (
                                                        <IndianRupee className="w-4 h-4 transition-all duration-300 scale-100" />
                                                    ) : (
                                                        <PercentIcon className="w-4 h-4 transition-all duration-300 scale-100" />
                                                    )}
                                                </button>
                                            </div>
                                        )}
                                    />
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="gst"
                    render={({ field }) => (
                        <FormItem>
                            <div className="flex flex-row gap-2">
                                <FormLabel>GST (%)</FormLabel>
                                <ToolTipWrapper content="GST is the tax on the interest rate. It is calculated on the interest rate and principal amount.">
                                    <Info className="w-4 h-4" />
                                </ToolTipWrapper>
                            </div>
                            <FormControl>
                                <Input
                                    type="number"
                                    step="0.01"
                                    placeholder="e.g., 18"
                                    {...field}
                                    onChange={(e) => field.onChange(Number(e.target.value))}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-36 col-span-2 ml-auto">
                    {isEdit ? 'Update' : 'Add'}
                </Button>
            </form>
        </Form>
    );
};

export default EMIForm;
