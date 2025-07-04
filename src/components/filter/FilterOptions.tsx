import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

import { IEmi } from '@/types/emi.types';

import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export type TFilterOptions = {
    status: 'all' | 'active' | 'completed';
    sortBy: 'name' | 'balance' | 'updated';
    tag: string;
};

interface IFilterOptionsProps {
    filters: TFilterOptions;
    onFilterChange: (filters: TFilterOptions) => void;
    emis?: IEmi[];
}

const FilterOptions = ({ filters, onFilterChange, emis = [] }: IFilterOptionsProps) => {
    const [availableTags, setAvailableTags] = useState<string[]>(['All']);

    // Extract unique tags from EMIs
    useEffect(() => {
        if (emis.length > 0) {
            const tags = ['All', ...new Set(emis.map((emi) => emi.tag || 'Personal').filter(Boolean))];
            setAvailableTags(tags);
        }
    }, [emis]);

    const clearFilters = () => {
        onFilterChange({
            ...filters,
            tag: 'All',
            status: 'all',
        });
    };

    const hasActiveFilters = filters.tag !== 'All' || filters.status !== 'all';

    return (
        <div className="flex flex-wrap items-center gap-2">
            <div className="flex flex-1 flex-col sm:flex-row gap-2 items-center">
                <div className="w-full xs:w-auto min-w-[120px]">
                    <Select
                        value={filters.status}
                        onValueChange={(value: TFilterOptions['status']) =>
                            onFilterChange({ ...filters, status: value })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full xs:w-auto min-w-[120px]">
                    <Select
                        value={filters.sortBy}
                        onValueChange={(value: TFilterOptions['sortBy']) =>
                            onFilterChange({ ...filters, sortBy: value })
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="updated">Last Updated</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                            <SelectItem value="balance">Balance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="w-full xs:w-auto min-w-[120px]">
                    <Select
                        value={filters.tag}
                        onValueChange={(value: string) => onFilterChange({ ...filters, tag: value })}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Filter by tag" />
                        </SelectTrigger>
                        <SelectContent>
                            {availableTags.map((tag) => (
                                <SelectItem key={tag} value={tag}>
                                    {tag}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {hasActiveFilters && (
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={clearFilters}
                    className="h-10 w-10 shrink-0"
                    title="Clear filters"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
};

export default FilterOptions;
