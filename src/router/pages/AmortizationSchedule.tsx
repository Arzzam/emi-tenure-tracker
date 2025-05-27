import { useParams } from 'react-router';

import { Table, TableCell, TableBody, TableRow, TableHead, TableHeader } from '@/components/ui/table';
import { formatAmount, getFormattedDate } from '@/utils/utils';
import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import BreadcrumbContainer from '@/components/common/BreadcrumbContainer';
import { IEmi } from '@/types/emi.types';
import { useEmis } from '@/hooks/useEmi';

const AmortizationSchedule = () => {
    const { id } = useParams();
    const { data } = useEmis();
    const currentData = data?.find((emi: IEmi) => emi.id === id) || null;
    const { amortizationSchedules } = currentData || {};

    if (!amortizationSchedules) {
        return <div>No amortization schedule found</div>;
    }

    return (
        <>
            <Header title="Amortization Schedule" />
            <BreadcrumbContainer
                className="pt-4 pb-0 px-8"
                items={[
                    { label: 'Dashboard', link: '/' },
                    { label: `EMI Details (${currentData?.itemName})`, link: `/emi/${id}` },
                    { label: 'Amortization Schedule' },
                ]}
            />
            <MainContainer>
                <h3 className="text-lg font-bold pl-2">Amortization Schedule</h3>
                <div className="p-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Month</TableHead>
                                <TableHead>Bill Date</TableHead>
                                <TableHead>EMI</TableHead>
                                <TableHead>Interest</TableHead>
                                <TableHead>Principal Paid</TableHead>
                                <TableHead>Balance</TableHead>
                                <TableHead>GST</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {amortizationSchedules.map((item) => (
                                <TableRow key={item.month}>
                                    <TableCell>{item.month}</TableCell>
                                    <TableCell>{getFormattedDate(item.billDate)}</TableCell>
                                    <TableCell>{item.emi}</TableCell>
                                    <TableCell>{item.interest}</TableCell>
                                    <TableCell>{item.principalPaid}</TableCell>
                                    <TableCell>{item.balance}</TableCell>
                                    <TableCell>{formatAmount(item.gst)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </MainContainer>
        </>
    );
};

export default AmortizationSchedule;
