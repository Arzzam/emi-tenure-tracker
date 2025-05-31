import { useEffect, useState, useMemo } from 'react';
import { IndianRupee, Clock, AlertCircle, ArrowUpDown, Search } from 'lucide-react';

import { useLogin, useUser } from '@/hooks/useUser';
import { useEmis, useAutoRecalculateEmis, useUpdateEmiList } from '@/hooks/useEmi';
import { useRematchDispatch } from '@/store/store';
import { IEmi } from '@/types/emi.types';
import { IDispatch } from '@/store/types/store.types';
import { formatAmount } from '@/utils/utils';

import { Icons } from '@/assets/icons';
import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import FormModal from '@/components/emi/AddButton';
import EMICard from '@/components/emi/EMICard';
import EMICardSkeleton from '@/components/emi/EMICardSkeleton';
import EMIFilter, { FilterOptions } from '@/components/emi/EMIFilter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ConfirmationModal from '@/components/common/ConfirmationModal';

const Home = () => {
    const { data: user, isLoading: userLoading, isError: userError } = useUser();
    const { data, isLoading: isEMILoading, isError: isEmisError } = useEmis();
    const loginMutation = useLogin();
    const { setUser } = useRematchDispatch((state: IDispatch) => state.userModel);
    const { recalculateNow } = useAutoRecalculateEmis();
    const { isPending: isUpdatingEmis } = useUpdateEmiList();
    const [searchQuery, setSearchQuery] = useState('');
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [filters, setFilters] = useState<FilterOptions>({
        status: 'all',
        sortBy: 'updated',
    });

    useEffect(() => {
        if (user) {
            setUser({
                id: user.user?.id || '',
                email: user.user?.email || '',
                rawData: user.user?.user_metadata || {},
                metadata: user.user?.app_metadata || {},
            });
        }
    }, [user]);

    const emiData = useMemo(() => (data || []) as IEmi[], [data]);

    // Calculate statistics
    const statistics = useMemo(() => {
        const stats = {
            totalEMIs: emiData.length,
            activeEMIs: emiData.filter((emi) => !emi.isCompleted).length,
            completedEMIs: emiData.filter((emi) => emi.isCompleted).length,
            totalMonthlyPayment: emiData.reduce((sum, emi) => sum + (emi.isCompleted ? 0 : emi.emi), 0),
            totalRemainingBalance: emiData.reduce((sum, emi) => sum + (emi.isCompleted ? 0 : emi.remainingBalance), 0),
        };
        return stats;
    }, [emiData]);

    const filteredEmiData = useMemo(() => {
        return emiData
            .filter((emi) => {
                const matchesSearch = emi.itemName.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesStatus =
                    filters.status === 'all'
                        ? true
                        : filters.status === 'completed'
                          ? emi.isCompleted
                          : !emi.isCompleted;
                return matchesSearch && matchesStatus;
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
    }, [emiData, filters, searchQuery]);

    if (!user || userError) {
        return (
            <>
                <Header title="Dashboard" />
                <MainContainer>
                    <Card className="max-w-md mx-auto mt-20">
                        <CardHeader>
                            <CardTitle className="text-2xl text-center">Welcome to EmiTrax</CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col items-center gap-4">
                            <p className="text-muted-foreground text-center">
                                Track and manage all your EMIs in one place. Login to get started.
                            </p>
                            <Button
                                size="lg"
                                variant="outline"
                                type="button"
                                disabled={loginMutation.isPending || userLoading}
                                onClick={() => loginMutation.mutate()}
                                className="w-full max-w-xs"
                            >
                                {loginMutation.isPending || userLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Icons.google className="mr-2 h-4 w-4" />
                                )}{' '}
                                Continue with Google
                            </Button>
                        </CardContent>
                    </Card>
                </MainContainer>
            </>
        );
    }

    return (
        <>
            <Header title="Dashboard" />
            <MainContainer>
                {isEMILoading ? (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <Card key={index} className="animate-pulse">
                                    <CardHeader className="h-24 bg-muted rounded-t-xl" />
                                </Card>
                            ))}
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                            {Array.from({ length: 3 }).map((_, index) => (
                                <EMICardSkeleton key={index} />
                            ))}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Statistics Cards */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total EMIs</CardTitle>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.totalEMIs}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {statistics.activeEMIs} active, {statistics.completedEMIs} completed
                                    </p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Monthly Payment</CardTitle>
                                    <IndianRupee className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₹{formatAmount(statistics.totalMonthlyPayment)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total monthly EMI payments</p>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Active EMIs</CardTitle>
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{statistics.activeEMIs}</div>
                                    <div className="mt-2 h-2 w-full bg-secondary rounded-full">
                                        <div
                                            className="h-2 bg-primary rounded-full"
                                            style={{
                                                width: `${(statistics.activeEMIs / statistics.totalEMIs) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                                    <AlertCircle className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">
                                        ₹{formatAmount(statistics.totalRemainingBalance)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total remaining balance</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Controls Section */}
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex flex-1 w-full sm:w-auto items-center gap-4">
                                        <div className="relative flex-1 sm:max-w-xs">
                                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                placeholder="Search EMIs..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-8"
                                            />
                                        </div>
                                        <EMIFilter filters={filters} onFilterChange={setFilters} />
                                    </div>
                                    <div className="flex gap-2 w-full sm:w-auto">
                                        <FormModal />
                                        <Button
                                            variant="outline"
                                            onClick={() => setOpenConfirmationModal(true)}
                                            className="flex-1 sm:flex-none"
                                        >
                                            <ArrowUpDown className="mr-2 h-4 w-4" />
                                            Recalculate
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* EMI Cards Grid */}
                        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
                            {filteredEmiData.length === 0 ? (
                                <Card className="col-span-full p-8">
                                    <div className="flex flex-col items-center gap-2 text-center">
                                        <AlertCircle className="h-8 w-8 text-muted-foreground" />
                                        <h3 className="font-semibold">No EMIs Found</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {searchQuery
                                                ? 'No EMIs match your search criteria'
                                                : 'Start by adding your first EMI'}
                                        </p>
                                    </div>
                                </Card>
                            ) : (
                                filteredEmiData.map((emi) => <EMICard key={emi.id} {...emi} />)
                            )}
                        </div>

                        {isEmisError && (
                            <Card className="mt-4 p-4 bg-destructive/10 text-destructive">
                                <div className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4" />
                                    <p>Error loading EMI data. Please try again.</p>
                                </div>
                            </Card>
                        )}
                    </>
                )}
                <ConfirmationModal
                    title="Recalculate EMIs"
                    description="The recalculation will happen every day automatically. Do you want to manually recalculate now?"
                    onConfirm={() => {
                        recalculateNow();
                        setOpenConfirmationModal(false);
                    }}
                    onCancel={() => setOpenConfirmationModal(false)}
                    open={openConfirmationModal}
                    setOpen={setOpenConfirmationModal}
                    isLoading={isUpdatingEmis}
                />
            </MainContainer>
        </>
    );
};

export default Home;
