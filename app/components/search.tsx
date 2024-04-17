'use client';

import { memo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';
import { TextField } from '@mui/material';

function Search({ placeholder }: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    const handleSearch = useDebouncedCallback((query: string) => {
        const params = new URLSearchParams(searchParams);
        if (query) {
            params.set('query', query);
        } else {
            params.delete('query');
        }

        replace(`${pathname}?${params.toString()}`);
    }, 300);

    return (
        <TextField
            type="search"
            label="Search"
            variant="outlined"
            placeholder={placeholder}
            defaultValue={searchParams.get('query')?.toString()}
            onChange={(event) => handleSearch(event.target.value)}
            className="block bg-white rounded text-sm border border-gray-200 shadow w-64"
        />
    );
}

export default memo(Search);
