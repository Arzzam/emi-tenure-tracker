import { calculateEMI } from '@/utils/calculation';
import { IRootState } from '../types/store.types';
import store from '../store';

export interface IEmi {
  id: string;
  itemName: string;
  principal: number;
  interestRate: number;
  billDate: Date;
  tenure: number;
  interestDiscount: number;
  interestDiscountType: 'percent' | 'amount';
  emi: number;
  totalLoan: number;
  totalPaidEMIs: number;
  totalInterest: number;
  remainingBalance: number;
  remainingTenure: number;
  endDate: Date;
  isCompleted: boolean;
  AmortizationSchedule: ScheduleData[];
}

export interface ScheduleData {
  month: number;
  billDate: string;
  emi: string;
  interest: string;
  principalPaid: string;
  balance: string;
}

const emiModel = {
  state: <IEmi[]>[],
  reducers: {
    addEmi: (state: IEmi[], emi: IEmi) => {
      return [...state, emi];
    },
    deleteEmi: (state: IEmi[], id: string) => {
      return state.filter((emi) => emi.id !== id);
    },
    updateEmi: (state: IEmi[], emi: IEmi) => {
      const index = state.findIndex((e) => e.id === emi.id);
      if (index !== -1) {
        return [...state.slice(0, index), emi, ...state.slice(index + 1)];
      }
      return state;
    },
    updateEmiList: (_: IEmi[], emiList: IEmi[]) => {
      return emiList;
    },
  },
  effects: {
    recalculateEmi(id: string, rootState: IRootState) {
      const currentEmi = rootState.emiModel.find((emi) => emi.id === id);
      if (currentEmi) {
        const newEmi = calculateEMI(currentEmi, id);
        store.dispatch.emiModel.updateEmi(newEmi);
      }
    },
  },
};

export default emiModel;
