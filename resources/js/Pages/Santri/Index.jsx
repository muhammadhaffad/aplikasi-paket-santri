import DangerButton from '@/Components/DangerButton';
import DataTable, { usePagination, useSorting } from '@/Components/DataTable';
import InputError from '@/Components/InputError';
import Modal from '@/Components/Modal';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/Components/Table';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { debounce } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import * as Lucide from 'lucide-react';
import { useEffect, useState } from 'react';
import useFetchSantri from './hooks/useFetchSantri';
import DeleteSantriDialog from './partials/DeleteSantriDialog';

const cols = (setShowModal, setRowSelected) => [
    {
        id: "nis",
        header: "NIS",
        enableSorting: true,
    },
    {
        id: "nama",
        header: "Nama",
        enableSorting: true,
    },
    {
        id: "asrama_id",
        header: "Asrama",
        enableSorting: true,
        cell: ({row}) => {
            return row.original.asrama.nama + " - " + row.original.asrama.gedung;
        },
    },
    {
        id: "alamat",
        header: "Alamat",
        enableSorting: false,
    },
    {
        id: "action",
        header: "Aksi",
        enableSorting: false,
        cell: ({row}) => {
            return (
                <div className="flex gap-2">
                    <SecondaryButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => router.visit(route('santris.show', {id: row.original.nis}))} title="Lihat">
                        <Lucide.Eye className='size-4' />
                    </SecondaryButton>
                    <SecondaryButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => router.visit(route('santris.edit', {id: row.original.nis}))} title="Ubah">
                        <Lucide.Pen className='size-4' />
                    </SecondaryButton>
                    <DangerButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => {setShowModal(true); setRowSelected(row.original)}} title="Hapus">
                        <Lucide.Trash className='size-4' />
                    </DangerButton>
                </div>
            );
        },
    }
];

export default function Index({ auth }) {
    const { limit, onPaginationChange, skip, pagination } = usePagination(10);
    const { sorting, onSortingChange, field, order } = useSorting();
    const [search, searchInput, setSearchInput] = debounce("", 500);
    const [showModal, setShowModal] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);

    const [data, setData, count, setCount, loading, refresh] = useFetchSantri({
        pagination: { limit, skip },
        sort: { field, order },
        search,
    });

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
                            <SecondaryButton onClick={() => location.href = route('santris.export.excel')} className="p-2" title="Export to Excel">
                                <Lucide.Sheet className='size-4' />
                            </SecondaryButton>
                            <SecondaryButton onClick={() => location.href = route('santris.export.pdf')} className="p-2" title="Save as PDF">
                                <Lucide.File className='size-4' />
                            </SecondaryButton>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <TextInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." />
                            <PrimaryButton onClick={() => router.visit(route('santris.create'))} title="Add Santri" className='inline-flex items-center gap-2'>
                                <Lucide.Plus className='size-4' /> Tambah Santri
                            </PrimaryButton>
                        </div>
                        <div className="[&>section>div]:border [&>section>div]:rounded [&>section>div]:w-auto">
                            <DataTable
                                cols={cols(setShowModal, setRowSelected)}
                                data={data}
                                loading={loading}
                                onPaginationChange={onPaginationChange}
                                onSortingChange={onSortingChange}
                                rowCount={count}
                                pagination={pagination}
                                sorting={sorting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <DeleteSantriDialog show={showModal} onClose={() => setShowModal(false)} rowSelected={rowSelected} refresh={refresh} />
    </AuthenticatedLayout>
}