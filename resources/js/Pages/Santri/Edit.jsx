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
import { useEffect } from 'react';

export default function Edit({ auth, data, asramas }) {
    const { data:form, setData, put, errors, processing, isDirty, setDefaults } = useForm({
        nis: data.nis,
        asrama_id: data.asrama_id.toString(),
        nama: data.nama,
        alamat: data.alamat,
    });
    const submit = (e) => {
        e.preventDefault();
        put(route('santris.update', {nis: data.nis}), {
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
            },
            onFinish: () => {
                setDefaults();
            }
        });
    };
    return <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex items-center gap-4">
                <SecondaryButton onClick={() => history.back()} title="Kembali">
                    <Lucide.ArrowLeft className='size-4' />
                </SecondaryButton>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Ubah Santri</h2>
            </div>
        }
    >
        <Head title="Ubah Santri" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <section className="p-4 sm:p-8 max-w-xl space-y-6">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Informasi Santri</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Informasi singkat tentang santri
                            </p>
                        </header>
                        <form onSubmit={submit} className='space-y-6'>
                            <div>
                                <InputLabel htmlFor="nis" value="NIS"/>
                                <TextInput className="w-full" value={form.nis} disabled/>
                                <InputError className="mt-2" message={errors.nis} />
                            </div>
                            <div>
                                <InputLabel htmlFor="asrama" value="Asrama" />
                                <select className="w-full" value={form.asrama_id} onChange={(e) => setData('asrama_id', e.target.value)}>
                                    <option value="">Pilih Asrama</option>
                                    {asramas.map((asrama) => (
                                        <option key={asrama.id} value={parseInt(asrama.id)}>{`${asrama.nama} - ${asrama.gedung}`}</option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.asrama_id} />
                            </div>
                            <div>
                                <InputLabel htmlFor="nama" value="Nama" />
                                <TextInput className="w-full" value={form.nama} onChange={(e) => setData('nama', e.target.value)} />
                                <InputError className="mt-2" message={errors.nama} />
                            </div>
                            <div>
                                <InputLabel htmlFor="alamat" value="Alamat" />
                                <TextArea className="w-full" value={form.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                                <InputError className="mt-2" message={errors.alamat} />
                            </div>
                            <div className="flex items-center gap-4">
                                <SecondaryButton onClick={() => history.back()}>Kembali</SecondaryButton>
                                <PrimaryButton disabled={processing || !isDirty}>Simpan</PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}