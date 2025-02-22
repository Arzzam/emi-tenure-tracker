import { useNavigate } from 'react-router';
import { Card, CardContent, CardTitle } from '../ui/card';
import { IEmi } from '@/store/models/emiModel';
import { formatAmount } from '@/utils/utils';
import { CircleCheckBigIcon } from 'lucide-react';
const EMICard = (props: IEmi) => {
  const navigate = useNavigate();

  const { id, itemName, billDate, endDate, emi, isCompleted } = props;

  const formattedBillDate = new Date(billDate).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const formattedEndDate = new Date(endDate).toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });

  const handleClick = () => {
    navigate(`/emi/${id}`);
  };

  return (
    <Card
      className='cursor-pointer hover:bg-accent/50 transition-colors relative'
      onClick={handleClick}
    >
      {isCompleted && (
        <CircleCheckBigIcon className='w-4 h-4 absolute top-2 right-2 text-green-500' />
      )}
      <CardContent className='pt-6'>
        <div className='flex flex-col gap-2'>
          <div className='flex flex-row justify-between text-muted-foreground tracking-wide'>
            <CardTitle className='font-semibold text-xs'>Bill Date</CardTitle>
            <span className='text-xs'>{formattedBillDate}</span>
          </div>
          <div className='font-bold flex flex-row justify-between gap-4'>
            <CardTitle className={'flex items-center text-lg'}>
              {itemName}
            </CardTitle>
            <span className='flex items-center text-base text-end'>
              {`\u20B9`}
              {formatAmount(emi)}
            </span>
          </div>
          <div className='flex flex-row justify-between text-muted-foreground tracking-wide'>
            <CardTitle className='font-semibold text-xs'>End Date</CardTitle>
            <span className='text-xs'>{formattedEndDate}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EMICard;
