import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Head, router } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import { useState } from 'react';
import useFetchStats from './Laporan/hooks/useFetchStats';
import DataTable, { usePagination, useSorting } from '@/Components/DataTable';
import useFetchPaket from './Paket/hooks/useFetchPaket';
import PrimaryButton from '@/Components/PrimaryButton';

const periodeOptions = {
    days: {
        '7': 'last 7 days',
        '30': 'last 30 days',
        '60': 'last 60 days',
    },
    weeks: {
        '7': 'last 7 weeks',
        '12': 'last 12 weeks',
        '26': 'last 26 weeks',
    },
    months: {
        '6': 'last 6 months',
        '12': 'last 12 months',
        '24': 'last 24 months',
    },
    years: {
        '2': 'last 2 years',
        '5': 'last 5 years',
        '10': 'last 10 years',
    },
};

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

const LineChartKeluarMasukComponent = () => {
    const [periode, setPeriode] = useState('days');
    const [time, setTime] = useState('7');
    const [data, loading, refresh] = useFetchStats({ periode, time });
    data.map((item) => {
        item.day = new Date(item.day).toLocaleDateString();
        item['Masuk'] = item.masuk;
        item['Keluar'] = item.keluar;
    });

    return (
        <div className="p-6 shadow-lg border sm:rounded-lg space-y-6">
            <h3 className="font-semibold text-center text-lg text-gray-800">Jumlah Paket Masuk/Keluar</h3>
            <div className="flex justify-center gap-2">
                <select className="w-full md:w-auto" onChange={(e) => (setPeriode(e.target.value), setTime(Object.keys(periodeOptions[e.target.value])[0]))}>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
                <select value={time} className="w-full md:w-auto" onChange={(e) => setTime(e.target.value)}>
                    {
                        Object.keys(periodeOptions[periode]).map((item, index) => (
                            <option key={index} value={item}>{periodeOptions[periode][item]}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <ResponsiveContainer width="100%" height={300} className="text-xs">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="Masuk" stroke="#8884d8" />
                        <Line dataKey="Keluar" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

const LineChartKeluarMasukKategoriComponent = ({ paketKategoris }) => {
    const [periode, setPeriode] = useState('days');
    const [time, setTime] = useState('7');
    const [idKategori, setIdKategori] = useState(paketKategoris[0].id);
    const [data, loading, refresh] = useFetchStats({ periode, time, idKategori });
    data.map((item) => {
        item.day = new Date(item.day).toLocaleDateString();
        item['Masuk'] = item.masuk_kategori;
        item['Keluar'] = item.keluar_kategori;
    });

    return (
        <div className="p-6 shadow-lg border sm:rounded-lg space-y-6">
            <h3 className="font-semibold text-center text-lg text-gray-800">Jumlah Paket Masuk/Keluar {paketKategoris.find((item) => item.id == idKategori)?.nama}</h3>
            <div className="flex justify-center gap-2">
                <select value={idKategori} className="w-full md:w-auto" onChange={(e) => setIdKategori(e.target.value)}>
                    {
                        paketKategoris.map((item, index) => (
                            <option key={index} value={item.id}>{item.nama}</option>
                        ))
                    }
                </select>
                <select className="w-full md:w-auto" onChange={(e) => (setPeriode(e.target.value), setTime(Object.keys(periodeOptions[e.target.value])[0]))}>
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                </select>
                <select value={time} className="w-full md:w-auto" onChange={(e) => setTime(e.target.value)}>
                    {
                        Object.keys(periodeOptions[periode]).map((item, index) => (
                            <option key={index} value={item}>{periodeOptions[periode][item]}</option>
                        ))
                    }
                </select>
            </div>
            <div>
                <ResponsiveContainer width="100%" height={300} className="text-xs">
                    <LineChart
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Line dataKey="Masuk" stroke="#8884d8" />
                        <Line dataKey="Keluar" stroke="#82ca9d" />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    )
}

export default function Dashboard({ auth, paketKategoris, totalPaketBelumDiambil, totalPaketDisita }) {
    const { limit, onPaginationChange, skip, pagination } = usePagination(5);
    const { sorting, onSortingChange, field, order } = useSorting('id', 'DESC');

    const [data, setData, count, setCount, loading, refresh] = useFetchPaket({
        pagination: { limit, skip },
        sort: { field, order },
        search: "",
        jenis_paket: "masuk",
    });

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-lg text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="grid grid-cols-2 gap-6 md:grid-cols-4 md:col-span-2">
                                <div className="p-6 shadow-lg border sm:rounded-lg space-y-2">
                                    <h2 className="font-semibold text-lg text-gray-800 leading-tight">Total Paket Belum Diambil</h2>
                                    <h2 className="font-semibold text-3xl text-gray-800 leading-tight">{totalPaketBelumDiambil}</h2>
                                </div>
                                <div className="p-6 shadow-lg border sm:rounded-lg space-y-2">
                                    <h2 className="font-semibold text-lg text-gray-800 leading-tight">Total Paket Disita</h2>
                                    <h2 className="font-semibold text-3xl text-gray-800 leading-tight">{totalPaketDisita}</h2>
                                </div>
                            </div>
                            <LineChartKeluarMasukKategoriComponent paketKategoris={paketKategoris} />
                            <LineChartKeluarMasukComponent />

                            <div className="p-6 shadow-lg col-span-1 md:col-span-2 border sm:rounded-lg space-y-6">
                                <h2 className="font-semibold text-lg text-center text-gray-800 leading-tight">5 Paket Masuk Terbaru</h2>

                                <DataTable
                                    cols={cols()}
                                    data={data}
                                    loading={loading}
                                    onPaginationChange={onPaginationChange}
                                    onSortingChange={onSortingChange}
                                    rowCount={count}
                                    pagination={pagination}
                                    sorting={sorting}
                                    withPagination={false} />
                                <div className="w-full flex justify-center">
                                    <PrimaryButton onClick={() => router.visit(route('pakets.index', { jenisPaket: 'masuk' }))} >Lihat Semua</PrimaryButton>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
