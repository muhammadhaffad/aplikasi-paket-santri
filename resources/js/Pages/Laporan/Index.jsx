import DangerButton from '@/Components/DangerButton';
import DataTable, { usePagination, useSorting } from '@/Components/DataTable';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Lucide from 'lucide-react';
import useFetchLaporan from './hooks/useFetchLaporan';
import SecondaryButton from '@/Components/SecondaryButton';
import { useState } from 'react';
import TextInput from '@/Components/TextInput';
import InputLabel from '@/Components/InputLabel';

const cols = () => [
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
];

export default function Index({ auth, paketKategoris }) {
    const { limit, onPaginationChange, skip, pagination } = usePagination(10);
    const { sorting, onSortingChange, field, order } = useSorting('id', 'DESC');
    const [filter, setFilter] = useState({
        rentangTanggal: {
            column: "tanggal_diterima",
            start: null,
            end: null,
        },
        jenisPaket: "masuk",
        kategoriPakets: [],
        isDisita: null,
    });

    const [data, setData, count, setCount, loading, refresh] = useFetchLaporan({
        pagination: { limit, skip },
        sorting: { field, order },
        ...filter,
    });

    return <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan</h2>}
    >
        <Head title="Laporan" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className=" overflow-hidden shadow-sm sm:rounded-lg bg-background">
                    <div className="p-6 text-gray-900 space-y-4">
                        <div className="flex gap-2 justify-end">
                            <SecondaryButton onClick={() => location.href = route('pakets.export.excel', { jenisPaket: filter.jenisPaket })} className="p-2" title="Export to Excel">
                                <Lucide.Sheet className='size-4' />
                            </SecondaryButton>
                            <SecondaryButton onClick={() => location.href = route('pakets.export.pdf', { jenisPaket: filter.jenisPaket })} className="p-2" title="Export to PDF">
                                <Lucide.File className='size-4' />
                            </SecondaryButton>
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Rentang Tanggal" />
                            <div className="block space-y-2 md:flex md:gap-2 md:space-y-0">
                                <select
                                    className="w-full md:w-auto"
                                    value={filter.rentangTanggal.column}
                                    onChange={(e) => setFilter({ ...filter, rentangTanggal: { ...filter.rentangTanggal, column: e.target.value } })}
                                >
                                    <option value="tanggal_diterima">Tanggal Diterima</option>
                                    <option value="created_at">Tanggal Dibuat</option>
                                </select>
                                <div className="block space-y-2 sm:flex sm:gap-2 sm:space-y-0">
                                    <TextInput
                                        className="w-full"
                                        type="datetime-local"
                                        value={filter.rentangTanggal.start}
                                        onChange={(e) => setFilter({ ...filter, rentangTanggal: { ...filter.rentangTanggal, start: e.target.value } })}
                                    />
                                    <TextInput
                                        className="w-full"
                                        type="datetime-local"
                                        value={filter.rentangTanggal.end}
                                        onChange={(e) => setFilter({ ...filter, rentangTanggal: { ...filter.rentangTanggal, end: e.target.value } })}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Jenis Paket" />
                            <select
                                value={filter.jenisPaket}
                                onChange={(e) => setFilter({ ...filter, jenisPaket: e.target.value })}
                            >
                                <option value="">Semua</option>
                                <option value="masuk">Masuk</option>
                                <option value="keluar">Keluar</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <InputLabel value="Kategori Paket" />
                            <select
                                value={filter.kategoriPakets[0]}
                                onChange={(e) => setFilter({ ...filter, kategoriPakets: e.target.value ? [e.target.value] : [] })}
                            >
                                <option value="">Semua</option>
                                {paketKategoris.map((kategori) => (
                                    <option key={kategori.id} value={kategori.id}>{kategori.nama}</option>
                                ))}
                            </select>
                        </div>
                        <div className="[&>section>div]:border [&>section>div]:rounded [&>section>div]:w-auto">
                            <DataTable
                                cols={cols()}
                                data={data}
                                loading={loading}
                                onPaginationChange={onPaginationChange}
                                rowCount={count}
                                pagination={pagination}
                                onSortingChange={onSortingChange}
                                sorting={sorting}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}