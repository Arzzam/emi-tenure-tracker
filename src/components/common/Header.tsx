import { Separator } from '@/components/ui/separator';
import { ModeToggle } from './ModeToggle';

const Header = ({ title }: { title: string }) => {
  return (
    <>
      <div className='flex p-3 pl-4 pr-4 text-gray-950 dark:text-gray-200 flex-row items-center justify-between gap-4 w-full'>
        <h3 className='text-2xl font-extrabold capitalize leading-snug tracking-tight truncate'>
          {title}
        </h3>
        <div className='flex flex-row gap-4'>
          <ModeToggle />
        </div>
      </div>
      <Separator />
    </>
  );
};

export default Header;
