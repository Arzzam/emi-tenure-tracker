import MainContainer from '@/components/common/Container';
import Header from '@/components/common/Header';
import AddEMIButton from '@/components/EMI/AddButton';
import EMICard from '@/components/EMI/EMICard';
import { IRootState } from '@/store/types/store.types';
import { useSelector } from 'react-redux';

const Home = () => {
  const emiData = useSelector((state: IRootState) => state.emiModel);

  return (
    <>
      <Header title='Dashboard' />
      <MainContainer>
        <div className='flex flex-row justify-between p-2'>
          <h3 className='text-2xl font-bold'>EMI List</h3>
          <AddEMIButton />
        </div>
        <div className='grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-3'>
          {emiData.length === 0 ? (
            <div className='col-span-full flex justify-center items-center'>
              <p className='text-gray-500'>No EMI found</p>
            </div>
          ) : (
            emiData.map((emi) => <EMICard key={emi.id} {...emi} />)
          )}
        </div>
      </MainContainer>
    </>
  );
};

export default Home;
