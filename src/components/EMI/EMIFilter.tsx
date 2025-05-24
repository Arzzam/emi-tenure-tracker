import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type FilterOptions = {
    status: 'all' | 'active' | 'completed';
    sortBy: 'name' | 'balance' | 'updated';
};

interface EMIFilterProps {
    filters: FilterOptions;
    onFilterChange: (filters: FilterOptions) => void;
}

const EMIFilter = ({ filters, onFilterChange }: EMIFilterProps) => {
    return (
        <div className="flex flex-row gap-2 items-center">
            <Select
                value={filters.status}
                onValueChange={(value: FilterOptions['status']) => onFilterChange({ ...filters, status: value })}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortBy}
                onValueChange={(value: FilterOptions['sortBy']) => onFilterChange({ ...filters, sortBy: value })}
            >
                <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="balance">Balance</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default EMIFilter;
