import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';
import * as Lucide from 'lucide-react';
import Autocomplete from '@/Components/Autocomplete';
import { useEffect } from 'react';

export default function Create({ auth, asramas, jenis_paket, paketKategoris }) {
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm({
        santri_nis: '',
        nama: '',
        kategori_id: '',
        pengirim: '',
        penerima: '',
        tanggal_diterima: '',
        keterangan_disita: '',
        asrama_id: '',
        status: 'belum diambil',
        jenis_paket: jenis_paket,
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('pakets.store', { jenis_paket: jenis_paket }), {
            preserveScroll: true,
            preserveState: true,
            onError: (e) => {
                if (e.error) {
                    toast.error(e.error);
                }
            },
            onSuccess: ({ props }) => {
                if (props.flash.success) {
                    toast.success(props.flash.success);
                }
                reset();
            },
        });
    };

    return <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex items-center gap-4">
                <SecondaryButton onClick={() => history.back()} title="Kembali">
                    <Lucide.ArrowLeft className='size-4' />
                </SecondaryButton>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Paket {jenis_paket === 'masuk' ? 'Masuk' : 'Keluar'}</h2>
            </div>
        }
    >
        <Head title={`Tambah Paket ${jenis_paket === 'masuk' ? 'Masuk' : 'Keluar'}`} />

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
                        <form onSubmit={submit}>
                            <div className="block space-y-6 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel value="NIS" />
                                        <Autocomplete
                                            placeholder="Cari NIS"
                                            name="santri_nis"
                                            className="w-full"
                                            value={data.santri_nis}
                                            onSelect={(value) => {
                                                setData('santri_nis', value.nis)
                                                setData('asrama_id', value.asrama_id)
                                                setData(jenis_paket === 'masuk' ? 'penerima' : 'pengirim', value.nama)
                                            }}
                                            apiUrl={route('santris.api.index')}
                                            searchParam="search"
                                            displayField="nama"
                                            valueField="nis"
                                            responseField="items"
                                        />
                                        <InputError message={errors.santri_nis} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="asrama" value="Asrama" />
                                        <select className="w-full" value={data.asrama_id} onChange={(e) => setData('asrama_id', e.target.value)}>
                                            <option value="">Pilih Asrama</option>
                                            {asramas.map((asrama) => (
                                                <option key={asrama.id} value={asrama.id}>{`${asrama.nama} - ${asrama.gedung}`}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.asrama_id} />
                                    </div>
                                    <div className={`flex gap-6 ${jenis_paket == 'keluar' ? 'flex-col-reverse' : 'flex-col'}`}>
                                        <div>
                                            <InputLabel value="Penerima" />
                                            <TextInput
                                                className="w-full"
                                                value={data.penerima}
                                                onChange={(e) => setData('penerima', e.target.value)}
                                                error={errors.penerima}
                                                disabled={jenis_paket === 'masuk'}
                                            />
                                            <InputError message={errors.penerima} />
                                        </div>
                                        <div>
                                            <InputLabel value="Pengirim" />
                                            <TextInput
                                                className="w-full"
                                                value={data.pengirim}
                                                onChange={(e) => setData('pengirim', e.target.value)}
                                                error={errors.pengirim}
                                                disabled={jenis_paket === 'keluar'}
                                            />
                                            <InputError message={errors.pengirim} />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div>
                                        <InputLabel value="Nama Paket" />
                                        <TextInput
                                            className="w-full"
                                            value={data.nama}
                                            onChange={(e) => setData('nama', e.target.value)}
                                            error={errors.nama}
                                        />
                                        <InputError message={errors.nama} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="kategori" value="Kategori" />
                                        <select className="w-full" value={data.kategori_id} onChange={(e) => setData('kategori_id', e.target.value)}>
                                            <option value="">Pilih Kategori</option>
                                            {paketKategoris.map((kategori) => (
                                                <option key={kategori.id} value={kategori.id}>{kategori.nama}</option>
                                            ))}
                                        </select>
                                        <InputError className="mt-2" message={errors.kategori_id} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="status" value="Status" />
                                        <select className="w-full" value={data.status || 'belum diambil'} onChange={(e) => setData('status', e.target.value)}>
                                            <option value="diambil">Diambil</option>
                                            <option value="belum diambil">Belum Diambil</option>
                                        </select>
                                        <InputError className="mt-2" message={errors.status} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="tanggal_diterima" value="Tanggal Diterima" />
                                        <TextInput
                                            className="w-full"
                                            type="datetime-local"
                                            value={data.tanggal_diterima}
                                            onChange={(e) => setData('tanggal_diterima', e.target.value)}
                                            error={errors.tanggal_diterima}
                                        />
                                        <InputError message={errors.tanggal_diterima} />
                                    </div>
                                    <div>
                                        <InputLabel htmlFor="keterangan_disita" value="Keterangan Disita" />
                                        <TextArea
                                            className="w-full"
                                            type="text"
                                            value={data.keterangan_disita}
                                            onChange={(e) => setData('keterangan_disita', e.target.value)}
                                            error={errors.keterangan_disita}
                                        />
                                        <InputError message={errors.keterangan_disita} />
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 justify-end col-span-2">
                                    <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}