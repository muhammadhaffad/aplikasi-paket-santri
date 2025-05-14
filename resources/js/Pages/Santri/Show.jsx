import DangerButton from '@/Components/DangerButton';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextArea from '@/Components/TextArea';
import TextInput from '@/Components/TextInput';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import * as Lucide from 'lucide-react';
import { useState } from 'react';

export default function Show({ auth, data, asramas }) {
    const [showModal, setShowModal] = useState(false);

    return <AuthenticatedLayout
        user={auth.user}
        header={
            <div className="flex items-center gap-4">
                <SecondaryButton onClick={() => history.back()} title="Kembali">
                    <Lucide.ArrowLeft className='size-4' />
                </SecondaryButton>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Santri</h2>
            </div>
        }
    >
        <Head title="Detail Santri" />

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
                        <div className='space-y-6'>
                            <div>
                                <InputLabel htmlFor="nis" value="NIS" />
                                <TextInput className="w-full" disabled value={data.nis} />
                            </div>
                            <div>
                                <InputLabel htmlFor="asrama" value="Asrama" />
                                <select className="w-full" value={data.asrama_id} disabled>
                                    <option value="">Pilih Asrama</option>
                                    {asramas.map((asrama) => (
                                        <option key={asrama.id} value={asrama.id}>{`${asrama.nama} - ${asrama.gedung}`}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <InputLabel htmlFor="nama" value="Nama" />
                                <TextInput className="w-full" disabled value={data.nama} />
                            </div>
                            <div>
                                <InputLabel htmlFor="alamat" value="Alamat" />
                                <TextArea className="w-full" disabled value={data.alamat} />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <SecondaryButton onClick={() => history.back()}>Kembali</SecondaryButton>
                            <PrimaryButton onClick={() => router.visit(route('santris.edit', { id: data.nis }))}>Edit</PrimaryButton>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </AuthenticatedLayout>
}