import DangerButton from '@/Components/DangerButton';
import DataTable, { usePagination, useSorting } from '@/Components/DataTable';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { debounce } from '@/lib/utils';
import { Head, router } from '@inertiajs/react';
import * as Lucide from 'lucide-react';
import { useState } from 'react';
import useFetchPaket from './hooks/useFetchPaket';
import TextInput from '@/Components/TextInput';
import Autocomplete from '@/Components/Autocomplete';
import DeletePaketDialog from './Partials/DeletePaketDialog';

const cols = (setShowModal, setRowSelected) => [
    {
        id: "id",
        header: "ID",
        enableSorting: true,
    },
    {
        id: "santri_nis",
        header: "NIS",
        enableSorting: true,
    },
    {
        id: "asrama_id",
        header: "Asrama",
        enableSorting: true,
        cell: ({ row }) => {
            return <span className='whitespace-nowrap'>{row.original.asrama.nama + " - " + row.original.asrama.gedung}</span>;
        },
    },
    {
        id: "penerima",
        header: "Penerima",
        enableSorting: true,
        cell: ({ row }) => {
            return <span className='whitespace-nowrap'>{row.original.penerima}</span>;
        },
    },
    {
        id: "pengirim",
        header: "Pengirim",
        enableSorting: true,
        cell: ({ row }) => {
            return <span className='whitespace-nowrap'>{row.original.pengirim}</span>;
        },
    },
    {
        id: "nama",
        header: "Nama Paket",
        enableSorting: true,
        cell: ({ row }) => {
            return <span className='whitespace-nowrap'>{row.original.nama}</span>;
        },
    },
    {
        id: "kategori_id",
        header: "Kategori",
        enableSorting: true,
        cell: ({ row }) => {
            return <span className='px-2 py-1 text-sm font-medium rounded-full bg-muted whitespace-nowrap'>{row.original.paket_kategori?.nama}</span>;
        },
    },
    {
        id: "tanggal_diterima",
        header: "Tanggal Diterima",
        enableSorting: true,
        cell: ({ row }) => {
            return (row.original.tanggal_diterima ? <span className='whitespace-nowrap'>{new Date(row.original.tanggal_diterima).toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            })}</span> : "-");
        },
    },
    {
        id: "keterangan_disita",
        header: "Keterangan Disita",
        enableSorting: false,
        size: 200,
        cell: ({ row }) => {
            return <span className=''>{row.original.keterangan_disita}</span>;
        },
    },
    {
        id: "status",
        header: "Status",
        enableSorting: true,
        cell: ({ row }) => {
            return (<span className={`px-2 py-1 text-sm font-medium rounded-full whitespace-nowrap ${row.original.status === "diambil" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{row.original.status}</span>);
        },
    },
    {
        id: "action",
        header: "Aksi",
        enableSorting: false,
        cell: ({row}) => {
            return (
                <div className="flex gap-2">
                    <SecondaryButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => router.visit(route('pakets.show', {id: row.original.id, jenisPaket: row.original.jenisPaket}))} title="Lihat">
                        <Lucide.Eye className='size-4' />
                    </SecondaryButton>
                    <SecondaryButton className='h-9 w-9 inline-flex items-center justify-center' onClick={() => router.visit(route('pakets.edit', {id: row.original.id, jenisPaket: row.original.jenisPaket}))} title="Ubah">
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
    const { sorting, onSortingChange, field, order } = useSorting('id', 'DESC');
    const [search, searchInput, setSearchInput] = debounce("", 500);
    const [jenisPaket, setJenisPaket] = useState("masuk");
    const [showModal, setShowModal] = useState(false);
    const [rowSelected, setRowSelected] = useState(null);

    const [data, setData, count, setCount, loading, refresh] = useFetchPaket({
        pagination: { limit, skip },
        sort: { field, order },
        search,
        jenis_paket: jenisPaket,
    });

    return <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Paket</h2>}
    >
        <Head title="Paket Masuk" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className=" overflow-hidden shadow-sm sm:rounded-lg bg-background">
                    <div className="p-6 text-gray-900 space-y-4">
                        <div className="flex gap-2 justify-center mx-auto bg-accent p-2 rounded-lg w-full sm:w-min">
                            <SecondaryButton onClick={() => setJenisPaket("masuk")} className={`w-full p-2 inline-flex items-center justify-center gap-2 px-4 sm:w-auto ${jenisPaket === "masuk" ? "bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 text-white" 
                                : "bg-muted hover:bg-muted/80 focus:bg-muted/80 active:bg-muted/80 text-gray-800 border-none shadow-none"}`} title="Paket Masuk">
                                <Lucide.ArrowRightToLine className='size-4' /> Masuk
                            </SecondaryButton>
                            <SecondaryButton onClick={() => setJenisPaket("keluar")} className={`w-full p-2 inline-flex items-center justify-center gap-2 px-4 sm:w-auto ${jenisPaket === "keluar" ? "bg-gray-800 hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 text-white" 
                                : "bg-muted hover:bg-muted/80 focus:bg-muted/80 active:bg-muted/80 text-gray-800 border-none shadow-none"}`} title="Paket Keluar">
                                <Lucide.ArrowLeftFromLine className='size-4' /> Keluar
                            </SecondaryButton>
                        </div>
                        <div className="flex gap-2 justify-end">
                            <SecondaryButton onClick={() => location.href = route('pakets.export.excel', { jenisPaket })} className="p-2" title="Export to Excel">
                                <Lucide.Sheet className='size-4' />
                            </SecondaryButton>
                            <SecondaryButton onClick={() => location.href = route('pakets.export.pdf', { jenisPaket })} className="p-2" title="Export to PDF">
                                <Lucide.File className='size-4' />
                            </SecondaryButton>
                        </div>
                        <div className="flex gap-2 justify-between">
                            <TextInput value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search..." />
                            <PrimaryButton onClick={() => router.visit(route('pakets.create', { jenisPaket }))} title="Tambah Paket" className='inline-flex items-center gap-2'>
                                <Lucide.Plus className='size-4' /> Tambah Paket
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
        <DeletePaketDialog show={showModal} onClose={() => setShowModal(false)} rowSelected={rowSelected} refresh={refresh} />
    </AuthenticatedLayout>
}