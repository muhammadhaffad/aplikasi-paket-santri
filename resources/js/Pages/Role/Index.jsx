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
import useFetchRole from './hooks/useFetchRole';
import DeleteRoleDialog from './Partials/DeleteRoleDialog';

const cols = (setShowModal, setRowSelected) => [
    {
        id: "id",
        header: "ID",
        enableSorting: true,
    },
    {
        id: "nama",
        header: "Nama",
        enableSorting: true,
    },
    {
        id: "permissions",
        header: "Permissions",
        enableSorting: true,
        cell: ({row}) => {
            return (
                <div className="flex gap-2">
                    {row.original.permissions.map((permission) => (
                        <span key={permission.id} className="px-2 py-1 text-xs font-medium text-white bg-gray-800 rounded">{permission.nama}</span>
                    ))}
                </div>
            );
        },
    },
    {
        id: "action",
        header: "Aksi",
        enableSorting: false,
        cell: ({row}) => {
            return (
                <div className="flex gap-2">
                    <SecondaryButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => router.visit(route('access-control.role.edit', {id: row.original.id}))} title="Ubah">
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

    const [data, setData, count, setCount, loading, refresh] = useFetchRole({
        pagination: { limit, skip },
        sort: { field, order },
        search,
    });

    return <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Role</h2>}
    >
        <Head title="Role" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className=" overflow-hidden shadow-sm sm:rounded-lg bg-background">
                    <div className="p-6 text-gray-900 space-y-4">
                        <div className="flex gap-2 justify-center mx-auto bg-accent p-2 rounded-lg w-full sm:w-min">
                            <SecondaryButton onClick={() => router.visit(route('access-control.permission'))} className={`w-full p-2 inline-flex items-center justify-center gap-2 px-4 sm:w-auto bg-muted hover:bg-muted/80 focus:bg-muted/80 active:bg-muted/80 text-gray-800 border-none shadow-none`} title="Permission">
                                Permission
                            </SecondaryButton>
                            <SecondaryButton onClick={() => router.visit(route('access-control.role'))} className={`w-full p-2 inline-flex items-center justify-center gap-2 px-4 sm:w-auto bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 text-white`} title="Role"> Role
                            </SecondaryButton>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <TextInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." />
                            <PrimaryButton onClick={() => router.visit(route('access-control.role.create'))} title="Add Role" className='inline-flex items-center gap-2'>
                                <Lucide.Plus className='size-4' /> Tambah Role
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
        <DeleteRoleDialog show={showModal} onClose={() => setShowModal(false)} rowSelected={rowSelected} refresh={refresh} />
    </AuthenticatedLayout>
}