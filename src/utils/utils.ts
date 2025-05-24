import { supabase } from '@/supabase/supabase';

export const formatAmount = (amount: number) => {
    if (!amount) return 'N/A';
    const fixedAmount = amount.toFixed(2);
    return Number(fixedAmount).toLocaleString();
};

export const exchange = async (token: string) => {
    const { data } = await supabase.auth.getUser(token);

    return data?.user;
};

export const getFormattedDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};
