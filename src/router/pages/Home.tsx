import { Icons } from '@/assets/icons';
import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import FormModal from '@/components/emi/AddButton';
import EMICard from '@/components/emi/EMICard';
import EMICardSkeleton from '@/components/emi/EMICardSkeleton';
import EMIFilter, { FilterOptions } from '@/components/emi/EMIFilter';
import { Button } from '@/components/ui/button';
import { useEmis, useUpdateEmiList } from '@/hooks/useEmi';
import { useLogin, useUser } from '@/hooks/useUser';
import { useAppDispatch } from '@/store/store';
import { IEmi } from '@/types/emi.types';
import { calculateEMI } from '@/utils/calculation';
import { useEffect, useState } from 'react';

const Home = () => {
    const { data: user, isLoading: userLoading, isError: userError } = useUser();
    const { data, isLoading: isEMILoading, isError: isEmisError } = useEmis();
    const loginMutation = useLogin();
    const { mutate } = useUpdateEmiList();
    const dispatch = useAppDispatch();
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'all',
        sortBy: 'updated',
    });

    useEffect(() => {
        if (user) {
            dispatch.userModel.setUser({
                id: user.user?.id || '',
                email: user.user?.email || '',
                rawData: user.user?.user_metadata || {},
                metadata: user.user?.app_metadata || {},
            });
        }
    }, [user]);

    const emiData = (data || []) as IEmi[];

    const filteredEmiData = emiData
        .filter((emi) => {
            if (filters.status === 'all') return true;
            return filters.status === 'completed' ? emi.isCompleted : !emi.isCompleted;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'name':
                    return a.itemName.localeCompare(b.itemName);
                case 'balance':
                    return b.remainingBalance - a.remainingBalance;
                default:
                    return 0;
            }
        });

    const recalculateEmis = () => {
        const emiList = (emiData as IEmi[] | [])?.map((emi) => calculateEMI(emi, emi.id));
        mutate(emiList);
    };

    return (
        <>
            <Header title="Dashboard" />
            <MainContainer>
                {!user || userError ? (
                    <div className="flex flex-col justify-center items-center h-full">
                        <h3 className="text-2xl font-bold">Please login to continue</h3>
                        <p className="text-gray-500">You can login with your Google account</p>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={loginMutation.isPending}
                            onClick={() => loginMutation.mutate()}
                        >
                            <>
                                {loginMutation.isPending || userLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Icons.google className="mr-2 h-4 w-4" />
                                )}{' '}
                                Google
                            </>
                        </Button>
                    </div>
                ) : isEMILoading ? (
                    <>
                        <div className="flex flex-row justify-between p-2 py-4">
                            <h3 className="text-2xl font-bold">EMI List</h3>
                            <div className="flex flex-row gap-2">
                                <FormModal />
                                <Button variant="outline" onClick={recalculateEmis}>
                                    Recalculate Emis
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <EMICardSkeleton key={index} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div className="flex flex-row justify-between p-2 py-4">
                            <div className="flex flex-row items-center gap-4">
                                <h3 className="text-2xl font-bold">EMI List</h3>
                                <EMIFilter filters={filters} onFilterChange={setFilters} />
                            </div>
                            <div className="flex flex-row gap-2">
                                <FormModal />
                                <Button variant="outline" onClick={recalculateEmis}>
                                    Recalculate Emis
                                </Button>
                            </div>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                            {filteredEmiData.length === 0 ? (
                                <div className="col-span-full flex justify-center items-center">
                                    <p className="text-gray-500">No EMI found</p>
                                </div>
                            ) : (
                                filteredEmiData.map((emi) => <EMICard key={emi.id} {...emi} />)
                            )}
                        </div>
                        {isEmisError && (
                            <div className="col-span-full flex justify-center items-center">
                                <p className="text-gray-500">Error loading EMI data</p>
                            </div>
                        )}
                    </>
                )}
            </MainContainer>
        </>
    );
};

export default Home;
