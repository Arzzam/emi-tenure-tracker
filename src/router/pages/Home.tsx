import { useEffect, useState, useMemo } from 'react';
import { IndianRupee, Clock, AlertCircle, ArrowUpDown, Tag, User } from 'lucide-react';

import { useLogin, useUser } from '@/hooks/useUser';
import { useEmis, useAutoRecalculateEmis, useUpdateEmiList } from '@/hooks/useEmi';
import { useRematchDispatch } from '@/store/store';
import { IEmi } from '@/types/emi.types';
import { IDispatch } from '@/store/types/store.types';
import { formatAmount } from '@/utils/utils';

import { Icons } from '@/assets/icons';
import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import EMICard from '@/components/emi/EMICard';
import EMICardSkeleton from '@/components/emi/EMICardSkeleton';
import { TFilterOptions } from '@/components/filter/FilterOptions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { Badge } from '@/components/ui/badge';
import FilterSection from '@/components/filter/FilterSection';

const Home = () => {
    const { data: user, isLoading: userLoading, isError: userError } = useUser();
    const { data, isLoading: isEMILoading, isError: isEmisError } = useEmis();
    const loginMutation = useLogin();
    const { setUser } = useRematchDispatch((state: IDispatch) => state.userModel);
    const { recalculateNow } = useAutoRecalculateEmis();
    const { isPending: isUpdatingEmis } = useUpdateEmiList();
    const [searchQuery, setSearchQuery] = useState('');
    const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
    const [filters, setFilters] = useState<TFilterOptions>({
        status: 'all',
        sortBy: 'updated',
        tag: 'All',
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
            tagCounts: {} as Record<string, number>,
        };

        // Count EMIs by tag
        emiData.forEach((emi) => {
            const tag = emi.tag || 'Personal';
            stats.tagCounts[tag] = (stats.tagCounts[tag] || 0) + 1;
        });

        return stats;
    }, [emiData]);

    // Calculate filtered statistics based on selected tag
    const filteredStatistics = useMemo(() => {
        // If no tag filter or "All" is selected, return the overall statistics
        if (!filters.tag || filters.tag === 'All') {
            return statistics;
        }

        // Filter EMIs by the selected tag
        const tagFilteredEmis = emiData.filter((emi) => (emi.tag || 'Personal') === filters.tag);

        return {
            totalEMIs: tagFilteredEmis.length,
            activeEMIs: tagFilteredEmis.filter((emi) => !emi.isCompleted).length,
            completedEMIs: tagFilteredEmis.filter((emi) => emi.isCompleted).length,
            totalMonthlyPayment: tagFilteredEmis.reduce((sum, emi) => sum + (emi.isCompleted ? 0 : emi.emi), 0),
            totalRemainingBalance: tagFilteredEmis.reduce(
                (sum, emi) => sum + (emi.isCompleted ? 0 : emi.remainingBalance),
                0
            ),
            tagCounts: statistics.tagCounts, // Keep the overall tag counts
        };
    }, [emiData, filters.tag, statistics]);

    // Calculate statistics by tag
    const tagStatistics = useMemo(() => {
        const stats: Record<
            string,
            {
                activeEMIs: number;
                totalEMIs: number;
                totalMonthlyPayment: number;
                totalRemainingBalance: number;
            }
        > = {};

        // Group EMIs by tag and calculate stats
        emiData.forEach((emi) => {
            const tag = emi.tag || 'Personal';

            if (!stats[tag]) {
                stats[tag] = {
                    activeEMIs: 0,
                    totalEMIs: 0,
                    totalMonthlyPayment: 0,
                    totalRemainingBalance: 0,
                };
            }

            stats[tag].totalEMIs++;

            if (!emi.isCompleted) {
                stats[tag].activeEMIs++;
                stats[tag].totalMonthlyPayment += emi.emi;
                stats[tag].totalRemainingBalance += emi.remainingBalance;
            }
        });

        return stats;
    }, [emiData]);

    // Get unique tags for display in statistics
    const uniqueTags = useMemo(() => {
        return Object.keys(statistics.tagCounts).sort();
    }, [statistics.tagCounts]);

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
                const matchesTag = filters.tag === 'All' ? true : (emi.tag || 'Personal') === filters.tag;
                return matchesSearch && matchesStatus && matchesTag;
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
                        {/* Statistics Cards - Now using filteredStatistics */}
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
                            <Card>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {filters.tag && filters.tag !== 'All' ? `${filters.tag} EMIs` : 'Total EMIs'}
                                    </CardTitle>
                                    <ArrowUpDown className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{filteredStatistics.totalEMIs}</div>
                                    <p className="text-xs text-muted-foreground">
                                        {filteredStatistics.activeEMIs} active, {filteredStatistics.completedEMIs}{' '}
                                        completed
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
                                        ₹{formatAmount(filteredStatistics.totalMonthlyPayment)}
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
                                    <div className="text-2xl font-bold">{filteredStatistics.activeEMIs}</div>
                                    <div className="mt-2 h-2 w-full bg-secondary rounded-full">
                                        <div
                                            className="h-2 bg-primary rounded-full"
                                            style={{
                                                width:
                                                    filteredStatistics.totalEMIs > 0
                                                        ? `${(filteredStatistics.activeEMIs / filteredStatistics.totalEMIs) * 100}%`
                                                        : '0%',
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
                                        ₹{formatAmount(filteredStatistics.totalRemainingBalance)}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Total remaining balance</p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tag Statistics - Show all tags or just the selected one with a back button */}
                        {uniqueTags.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {filters.tag && filters.tag !== 'All'
                                            ? `${filters.tag} Statistics`
                                            : 'EMIs by Category'}
                                    </CardTitle>
                                    <Tag className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    {filters.tag && filters.tag !== 'All' ? (
                                        <div className="flex flex-col gap-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 rounded-md bg-primary/10 border border-primary/20 gap-3">
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{filters.tag}</span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {filteredStatistics.activeEMIs} active EMIs, ₹
                                                        {formatAmount(filteredStatistics.totalMonthlyPayment)}/month
                                                    </span>
                                                </div>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => setFilters({ ...filters, tag: 'All' })}
                                                    className="w-full sm:w-auto"
                                                >
                                                    View All Categories
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {uniqueTags.map((tag) => {
                                                const tagStats = tagStatistics[tag];
                                                return (
                                                    <div
                                                        key={tag}
                                                        className={`flex flex-col p-3 rounded-md cursor-pointer hover:bg-muted ${
                                                            filters.tag === tag
                                                                ? 'bg-primary/10 border border-primary/20'
                                                                : 'bg-muted/50'
                                                        }`}
                                                        onClick={() => setFilters({ ...filters, tag })}
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-medium">{tag}</span>
                                                            <Badge variant="outline" className="text-xs">
                                                                {tagStats.totalEMIs} EMIs
                                                            </Badge>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-2 text-xs">
                                                            <div>
                                                                <p className="text-muted-foreground">Active EMIs</p>
                                                                <p className="font-medium">{tagStats.activeEMIs}</p>
                                                            </div>
                                                            <div>
                                                                <p className="text-muted-foreground">Monthly</p>
                                                                <p className="font-medium">
                                                                    ₹{formatAmount(tagStats.totalMonthlyPayment)}
                                                                </p>
                                                            </div>
                                                            <div className="col-span-2">
                                                                <p className="text-muted-foreground">Outstanding</p>
                                                                <p className="font-medium">
                                                                    ₹{formatAmount(tagStats.totalRemainingBalance)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        )}

                        {/* Summary section - Only show when viewing all EMIs */}
                        {(!filters.tag || filters.tag === 'All') && uniqueTags.length > 0 && (
                            <Card className="mb-6">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">Summary by Category</CardTitle>
                                    <User className="h-4 w-4 text-muted-foreground" />
                                </CardHeader>
                                <CardContent>
                                    <div className="overflow-x-auto -mx-4 px-4">
                                        <table className="w-full text-sm min-w-[600px]">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2 font-medium">Category</th>
                                                    <th className="text-center py-2 font-medium">EMIs</th>
                                                    <th className="text-center py-2 font-medium">Active</th>
                                                    <th className="text-right py-2 font-medium">Monthly Payment</th>
                                                    <th className="text-right py-2 font-medium">Outstanding</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {uniqueTags.map((tag) => {
                                                    const tagStats = tagStatistics[tag];
                                                    const isPersonal = tag === 'Personal';
                                                    return (
                                                        <tr
                                                            key={tag}
                                                            className="border-b hover:bg-muted/50 cursor-pointer"
                                                            onClick={() => setFilters({ ...filters, tag })}
                                                        >
                                                            <td className="py-2 flex items-center gap-2">
                                                                {isPersonal ? (
                                                                    <Tag className="h-3 w-3 text-muted-foreground" />
                                                                ) : (
                                                                    <User className="h-3 w-3 text-primary" />
                                                                )}
                                                                {tag}
                                                            </td>
                                                            <td className="text-center py-2">{tagStats.totalEMIs}</td>
                                                            <td className="text-center py-2">{tagStats.activeEMIs}</td>
                                                            <td className="text-right py-2">
                                                                ₹{formatAmount(tagStats.totalMonthlyPayment)}
                                                            </td>
                                                            <td className="text-right py-2">
                                                                ₹{formatAmount(tagStats.totalRemainingBalance)}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                                <tr className="bg-muted/30 font-medium">
                                                    <td className="py-2">Total</td>
                                                    <td className="text-center py-2">{statistics.totalEMIs}</td>
                                                    <td className="text-center py-2">{statistics.activeEMIs}</td>
                                                    <td className="text-right py-2">
                                                        ₹{formatAmount(statistics.totalMonthlyPayment)}
                                                    </td>
                                                    <td className="text-right py-2">
                                                        ₹{formatAmount(statistics.totalRemainingBalance)}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Controls Section */}
                        <FilterSection
                            searchQuery={searchQuery}
                            setSearchQuery={setSearchQuery}
                            filters={filters}
                            setFilters={setFilters}
                            emiData={emiData}
                            setOpenConfirmationModal={setOpenConfirmationModal}
                        />

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
