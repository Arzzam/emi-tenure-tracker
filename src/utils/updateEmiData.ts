import { bulkUpdateEmis } from './bulkEmiUpdate';
import type { EMIData } from './bulkEmiUpdate';

export const updateEmiData = async (emiData: EMIData[]) => {
    try {
        const result = await bulkUpdateEmis(emiData as EMIData[]);
        console.log('EMI Update Results:', result);

        if (result.failedUpdates > 0) {
            console.error('Failed Updates:', result.failedItems);
        }

        return result;
    } catch (error) {
        console.error('Failed to update EMIs:', error);
        throw error;
    }
};
