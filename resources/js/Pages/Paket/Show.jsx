import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Lucide from 'lucide-react';

export default function Show({ auth, data, jenis_paket }) {
    return <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex items-center gap-4">
                <SecondaryButton onClick={() => history.back()} title="Kembali">
                    <Lucide.ArrowLeft className='size-4' />
                </SecondaryButton>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Paket {jenis_paket === 'masuk' ? 'Masuk' : 'Keluar'}</h2>
            </div>
        }
    >
        <Head title={`Detail Paket ${jenis_paket === 'masuk' ? 'Masuk' : 'Keluar'}`} />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <section className="p-4 sm:p-8 space-y-6">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Informasi Paket</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Informasi singkat tentang paket
                            </p>
                        </header>
                        <div className="block space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                            <div className="space-y-6">
                                <div>
                                    <InputLabel value="NIS" />
                                    <TextInput
                                        className="w-full"
                                        value={data.santri_nis}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Asrama" />
                                    <TextInput
                                        className="w-full"
                                        value={data.asrama.nama}
                                        disabled
                                    />
                                </div>
                                <div className={`flex gap-6 ${jenis_paket == 'keluar' ? 'flex-col-reverse' : 'flex-col'}`}>
                                    <div>
                                        <InputLabel value="Penerima" />
                                        <TextInput
                                            className="w-full"
                                            value={data.penerima}
                                            disabled
                                        />
                                    </div>
                                    <div>
                                        <InputLabel value="Pengirim" />
                                        <TextInput
                                            className="w-full"
                                            value={data.pengirim}
                                            disabled
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div>
                                    <InputLabel value="Nama Paket" />
                                    <TextInput
                                        className="w-full"
                                        value={data.nama}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Kategori" />
                                    <TextInput
                                        className="w-full"
                                        value={data.paket_kategori.nama}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Status" />
                                    <TextInput
                                        className="w-full"
                                        value={data.status == 'diterima' ? 'Diterima' : 'Belum Diterima'}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Tanggal Diterima" />
                                    <TextInput
                                        className="w-full"
                                        type="datetime-local"
                                        value={data.tanggal_diterima}
                                        disabled
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Keterangan Disita" />
                                    <TextArea
                                        className="w-full"
                                        type="text"
                                        value={data.keterangan_disita}
                                        disabled
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4 justify-between col-span-2">
                                <SecondaryButton onClick={() => history.back()}>Kembali</SecondaryButton>
                                <PrimaryButton onClick={() => router.visit(route('pakets.edit', {id: data.id, jenis_paket}))}>Edit</PrimaryButton>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}