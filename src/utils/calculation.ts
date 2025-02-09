import { TFormValues } from '@/components/EMI/EMIForm';
import { IEmi, ScheduleData } from '@/store/models/emiModel';
import { addMonths, format, isBefore } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

export const calculateEMI = (
  {
    principal,
    interestRate,
    tenure,
    billDate,
    itemName,
    interestDiscount,
    interestDiscountType,
  }: TFormValues,
  id?: string
): IEmi => {
  const P = principal;
  const r = interestRate / 100 / 12;
  const n = tenure;

  let emiValue = 0;
  if (r === 0) {
    emiValue = P / n;
  } else {
    emiValue = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
  }

  const { scheduleData, totalInterest } = calculateAmortizationSchedule({
    principal: P,
    n,
    r,
    billDate,
    emiValue,
    interestDiscount,
    interestDiscountType,
  });

  const { completedMonths, remainingMonths } = calculateRemainingTenure(
    billDate,
    n,
    new Date()
  );

  const totalPrincipalPaid = scheduleData.reduce((acc, curr, idx) => {
    if (idx < completedMonths) {
      return acc + parseFloat(curr.principalPaid);
    }
    return acc;
  }, 0);

  const payload: IEmi = {
    id: id ? id : uuidv4(),
    itemName,
    principal,
    interestRate,
    tenure,
    billDate,
    interestDiscount,
    interestDiscountType,
    emi: emiValue,
    totalLoan: P + totalInterest,
    totalPaidEMIs: completedMonths,
    totalInterest,
    remainingBalance: P - totalPrincipalPaid,
    remainingTenure: remainingMonths,
    endDate: addMonths(billDate, n - 1),
    AmortizationSchedule: scheduleData,
    isCompleted: remainingMonths === 0,
  };

  return payload;
};

export const calculateAmortizationSchedule = ({
  principal,
  n,
  r,
  billDate,
  emiValue,
  interestDiscount,
  interestDiscountType,
}: {
  principal: number;
  n: number;
  r: number;
  billDate: Date;
  emiValue: number;
  interestDiscount: number;
  interestDiscountType: 'percent' | 'amount';
}) => {
  let remaining = principal;
  const scheduleData: ScheduleData[] = [];
  let totalInterest = 0;
  let lastPaymentDate = billDate;

  for (let i = 1; i <= n; i++) {
    const interest = remaining * r;
    const principalPaid = emiValue - interest;
    remaining -= principalPaid;
    totalInterest += interest;

    scheduleData.push({
      month: i,
      billDate: format(lastPaymentDate, 'yyyy-MM-dd'),
      emi: emiValue.toFixed(2),
      interest: interest.toFixed(2),
      principalPaid: principalPaid.toFixed(2),
      balance: remaining.toFixed(2),
    });

    lastPaymentDate = addMonths(lastPaymentDate, 1);
  }

  const totalInterestWithDiscount = applyDiscount(
    totalInterest,
    interestDiscount,
    interestDiscountType
  );

  return {
    scheduleData,
    totalInterest: totalInterestWithDiscount,
  };
};

export const calculateRemainingTenure = (
  billStartDate: Date,
  totalTenure: number,
  currentDate: Date
): {
  completedMonths: number;
  remainingMonths: number;
} => {
  const today = currentDate;

  let completedMonths = 0;

  for (let i = 0; i < totalTenure; i++) {
    const cycleDate = addMonths(billStartDate, i);
    if (isBefore(cycleDate, today)) {
      completedMonths++;
    }
  }

  const remainingMonths = totalTenure - completedMonths;

  return { completedMonths, remainingMonths };
};

function applyDiscount(
  totalInterest: number,
  discountValue: number,
  discountType: 'percent' | 'amount'
): number {
  if (discountType === 'percent') {
    return Math.max(totalInterest - totalInterest * (discountValue / 100), 0);
  } else {
    return Math.max(totalInterest - discountValue, 0);
  }
}
