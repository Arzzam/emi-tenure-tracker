import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import { Button } from '@/components/ui/button';
import BreadcrumbContainer from '@/components/common/BreadcrumbContainer';
import FormModal from '@/components/emi/AddButton';
import ConfirmationModal from '@/components/common/ConfirmationModal';
import { formatAmount } from '@/utils/utils';
import { useDeleteEmi, useEmis } from '@/hooks/useEmi';

const EMIDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data } = useEmis();
    const { mutate } = useDeleteEmi();
    const currentData = data?.find((emi) => emi.id === id) || null;
    const [open, setOpen] = useState(false);

    if (!currentData) {
        return <div>EMI not found</div>;
    }

    const {
        itemName,
        principal,
        interestRate,
        tenure,
        billDate,
        emi,
        totalLoan,
        totalInterest,
        totalPaidEMIs,
        remainingBalance,
        remainingTenure,
        endDate,
        isCompleted,
        totalGST,
        gst,
        interestDiscount,
        interestDiscountType,
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

    const handleConfirmDelete = () => {
        mutate(currentData.id);
        navigate('/');
    };

    return (
        <>
            <Header title="EMI Details" />
            <BreadcrumbContainer
                className="pt-4 pb-0 px-8"
                items={[{ label: 'Dashboard', link: '/' }, { label: 'EMI Details' }]}
            />
            <MainContainer>
                <div className="flex flex-row justify-between">
                    <h1 className="text-2xl font-bold ">{itemName}</h1>
                </div>
                <h3 className="text-lg font-bold mt-2 pl-2">EMI Details</h3>
                <div className="grid grid-cols-2 gap-4 p-4">
                    <div className="col-span-1">
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Principal Amount </span>
                            <span>₹{formatAmount(principal)}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Interest Rate </span>
                            <span>{interestRate}%</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Tenure </span>
                            <span>{tenure} months</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Bill Date </span>
                            <span>{formattedBillDate}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">End Date </span>
                            <span>{formattedEndDate}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Remaining Tenure </span>
                            <span>{remainingTenure} months</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">GST </span>
                            <span>{gst} %</span>
                        </span>
                        {interestDiscount > 0 && (
                            <span className="grid grid-cols-2 space-y-2">
                                <span className="font-bold">Interest Discount </span>
                                <span>
                                    {interestDiscount} {interestDiscountType === 'percent' ? '%' : '₹'}
                                </span>
                            </span>
                        )}
                    </div>
                    <div className="col-span-1">
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Monthly EMI </span>
                            <span>₹{formatAmount(emi)}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Total Loan </span>
                            <span>₹{formatAmount(totalLoan)}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Total Interest </span>
                            <span>₹{formatAmount(totalInterest)}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Total GST </span>
                            <span>{totalGST ? `₹${formatAmount(totalGST)}` : 'N/A'}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Total Paid EMIs </span>
                            <span>{totalPaidEMIs}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Remaining Balance </span>
                            <span>₹{formatAmount(remainingBalance)}</span>
                        </span>
                        <span className="grid grid-cols-2 space-y-2">
                            <span className="font-bold">Is Completed </span>
                            <span className={`${isCompleted ? 'text-green-500' : 'text-red-500'}`}>
                                {isCompleted ? 'Yes' : 'No'}
                            </span>
                        </span>
                    </div>
                </div>
                <div className="flex flex-row gap-2 mt-10">
                    <Button variant="outline">
                        <Link to={`/emi/${id}/amortization`} className="text-blue-500">
                            Amortization Schedule
                        </Link>
                    </Button>
                    <FormModal data={currentData} />
                    <Button variant="destructive" onClick={() => setOpen(true)}>
                        Delete
                    </Button>
                </div>
                <ConfirmationModal
                    title="Are you sure you want to delete this EMI?"
                    description="This action cannot be undone."
                    open={open}
                    setOpen={setOpen}
                    onCancel={() => setOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            </MainContainer>
        </>
    );
};

export default EMIDetails;
