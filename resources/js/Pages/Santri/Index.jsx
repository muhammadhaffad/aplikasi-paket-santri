import DataTable, { usePagination, useSorting } from '@/Components/DataTable';
import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/Table';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { useMockAPI } from '@/lib/mockAPI';
import { debounce } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import * as Lucide from 'lucide-react';

const cols = [
    { id: "id", header: "Ep. overall", enableSorting: true },
    {
        id: "episode",
        header: "Ep. in season",
        enableSorting: false,
    },
    { id: "title", header: "Title", enableSorting: true },
];

export default function Index({ auth, santri }) {
    const { limit, onPaginationChange, skip, pagination } = usePagination();
    const { sorting, onSortingChange, field, order } = useSorting();
    const [search, searchInput, setSearchInput] = debounce("", 500);

    const [data, count, loading] = useMockAPI("/episodes", {
        pagination: { skip, limit },
        sort: { field, order },
        search,
    });

    console.info(santri)

    return <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Santri</h2>}
    >
        <Head title="Santri" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className=" overflow-hidden shadow-sm sm:rounded-lg bg-background">
                    <div className="p-6 text-gray-900 space-y-4">
                        <div className="flex gap-2 justify-end">
                            <SecondaryButton className="p-2" title="Export to Excel">
                                <Lucide.Sheet className='size-4' />
                            </SecondaryButton>
                            <SecondaryButton className="p-2" title="Save as PDF">
                                <Lucide.File className='size-4' />
                            </SecondaryButton>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <TextInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." />
                            <PrimaryButton onClick={() => router.visit(route('santris.create'))} title="Add Santri" className='inline-flex items-center gap-2'>
                                <Lucide.Plus className='size-4' /> Tambah Santri
                            </PrimaryButton>
                        </div>
                        <div className="[&>section>div]:-mx-6 [&>section>div]:w-auto">
                            <DataTable
                                cols={cols}
                                data={data}
                                loading={loading}
                                onPaginationChange={onPaginationChange}
                                onSortingChange={onSortingChange}
                                rowCount={count} /* pageCount={pageCount} if version lower than 8.13.0 */
                                pagination={pagination}
                                sorting={sorting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}