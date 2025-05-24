import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { useUser } from './useUser';
import { EmiService } from '@/supabase/emiService';
import { IEmi } from '@/types/emi.types';

export const useEmis = (): UseQueryResult<IEmi[], Error> => {
    const { data: user } = useUser();

    return useQuery({
        queryKey: ['emis'],
        enabled: !!user,
        queryFn: () => EmiService.getEmis(),
        staleTime: 1000 * 60 * 5,
    });
};

export const useCreateEmi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (emi: Omit<IEmi, 'id'>) => EmiService.createEmi(emi),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emis'] });
        },
    });
};

export const useUpdateEmi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (emi: IEmi) => EmiService.updateEmi(emi),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emis'] });
        },
    });
};

export const useDeleteEmi = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => EmiService.deleteEmi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emis'] });
        },
    });
};

export const useUpdateEmiList = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (emiList: IEmi[]) => EmiService.updateEmiList(emiList),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['emis'] });
        },
    });
};
