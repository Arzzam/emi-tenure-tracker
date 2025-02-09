import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { IRootState } from '@/store/types/store.types';
import { IEmi } from '@/store/models/emiModel';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from '@/components/ui/table';
import BreadcrumbContainer from '@/components/common/BreadcrumbContainer';
import { useAppDispatch } from '@/store/store';

const EMIDetails = () => {
  const { id } = useParams();
  const emiData = useSelector((state: IRootState) => state.emiModel);
  const currentData = emiData.find((emi: IEmi) => emi.id === id);
  const dispatch = useAppDispatch();

  if (!currentData) {
    return <div>EMI not found</div>;
  }

  const {
    itemName,
    principal,
    interestRate,
    tenure,
    billDate,
    AmortizationSchedule,
    emi,
    totalLoan,
    totalInterest,
    totalPaidEMIs,
    remainingBalance,
    remainingTenure,
    endDate,
    isCompleted,
  } = currentData;

  const formattedBillDate = new Date(billDate).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    month: 'long',
    day: '2-digit',
    year: 'numeric',
  });

  const handleRecalculate = () => {
    dispatch.emiModel.recalculateEmi(currentData.id);
  };

  const handleDelete = () => {
    dispatch.emiModel.deleteEmi(currentData.id);
  };

  return (
    <>
      <Header title='EMI Details' />
      <BreadcrumbContainer
        className='pt-4 pb-0 px-8'
        items={[{ label: 'Dashboard', link: '/' }, { label: 'EMI Details' }]}
      />
      <MainContainer>
        <div className='flex flex-row justify-between'>
          <h1 className='text-2xl font-bold '>{itemName}</h1>
          <div className='flex flex-row gap-2'>
            <Button variant='destructive' onClick={handleDelete}>
              Delete
            </Button>
            <Button variant='outline' onClick={handleRecalculate}>
              Recalculate
            </Button>
          </div>
        </div>
        <h3 className='text-lg font-bold mt-2 pl-2'>EMI Details</h3>
        <div className='grid grid-cols-2 gap-4 p-4'>
          <div className='col-span-1'>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Principal Amount </span>
              <span>{principal}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Interest Rate </span>
              <span>{interestRate}%</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Tenure </span>
              <span>{tenure} months</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Bill Date </span>
              <span>{formattedBillDate}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>End Date </span>
              <span>{formattedEndDate}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Remaining Tenure </span>
              <span>{remainingTenure} months</span>
            </span>
          </div>
          <div className='col-span-1'>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Monthly EMI </span>
              <span>{emi.toFixed(2)}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Total Loan </span>
              <span>{totalLoan.toFixed(2)}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Total Interest </span>
              <span>{totalInterest.toFixed(2)}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Total Paid EMIs </span>
              <span>{totalPaidEMIs}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Remaining Balance </span>
              <span>{remainingBalance.toFixed(2)}</span>
            </span>
            <span className='grid grid-cols-2 space-y-2'>
              <span className='font-bold'>Is Completed </span>
              <span
                className={`${isCompleted ? 'text-green-500' : 'text-red-500'}`}
              >
                {isCompleted ? 'Yes' : 'No'}
              </span>
            </span>
          </div>
        </div>
        <h3 className='text-lg font-bold pl-2'>Amortization Schedule</h3>
        <div className='p-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead>Bill Date</TableHead>
                <TableHead>EMI</TableHead>
                <TableHead>Interest</TableHead>
                <TableHead>Principal Paid</TableHead>
                <TableHead>Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {AmortizationSchedule.map((item) => (
                <TableRow key={item.month}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell>{getFormattedDate(item.billDate)}</TableCell>
                  <TableCell>{item.emi}</TableCell>
                  <TableCell>{item.interest}</TableCell>
                  <TableCell>{item.principalPaid}</TableCell>
                  <TableCell>{item.balance}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </MainContainer>
    </>
  );
};

const getFormattedDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export default EMIDetails;
