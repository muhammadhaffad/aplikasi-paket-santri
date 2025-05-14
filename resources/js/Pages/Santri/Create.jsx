import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import toast from 'react-hot-toast';

export default function Create({ auth, asramas }) {
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm({
        nis: '',
        asrama_id: '',
        nama: '',
        alamat: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('santris.store'), {
            preserveScroll: true,
            onError: (e) => {
                if (e.error) {
                    toast.error(e.error);
                }
            },
            onSuccess: ({props}) => {
                console.info(props);
                if (props.flash.success) {
                    toast.success(props.flash.success);
                }
                reset();
            },
        });
    };
    return <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Santri</h2>}
    >
        <Head title="Santri" />

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
                                <InputLabel htmlFor="nis" value="NIS" />
                                <TextInput className="w-full" value={data.nis} onChange={(e) => setData('nis', e.target.value)} />
                                <InputError className="mt-2" message={errors.nis} />
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
                            <div>
                                <InputLabel htmlFor="nama" value="Nama" />
                                <TextInput className="w-full" value={data.nama} onChange={(e) => setData('nama', e.target.value)} />
                                <InputError className="mt-2" message={errors.nama} />
                            </div>
                            <div>
                                <InputLabel htmlFor="alamat" value="Alamat" />
                                <TextArea className="w-full" value={data.alamat} onChange={(e) => setData('alamat', e.target.value)} />
                                <InputError className="mt-2" message={errors.alamat} />
                            </div>
                            <div className="flex items-center gap-4">
                                <PrimaryButton disabled={processing}>Simpan</PrimaryButton>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}