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

export default function Create({ auth, roles }) {
    const { data, setData, post, errors, processing, reset, recentlySuccessful } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role_id: '',
    });
    const submit = (e) => {
        e.preventDefault();
        post(route('users.store'), {
            preserveScroll: true,
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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah User</h2>
            </div>
        }
    >
        <Head title="Tambah User" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                    <section className="p-4 sm:p-8 max-w-xl space-y-6">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Informasi User</h2>
                            <p className="mt-1 text-sm text-gray-600">
                                Informasi singkat tentang user
                            </p>
                        </header>
                        <form onSubmit={submit} className='space-y-6'>
                            <div>
                                <InputLabel htmlFor="name" value="Nama" />
                                <TextInput className="w-full" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                                <InputError className="mt-2" message={errors.name} />
                            </div>
                            <div>
                                <InputLabel htmlFor="email" value="Email" />
                                <TextInput className="w-full" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                                <InputError className="mt-2" message={errors.email} />
                            </div>
                            <div>
                                <InputLabel htmlFor="role_id" value="Role" />
                                <select className="w-full" value={data.role_id} onChange={(e) => setData('role_id', e.target.value)}>
                                    <option value="">Pilih Role</option>
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>{role.nama}</option>
                                    ))}
                                </select>
                                <InputError className="mt-2" message={errors.role_id} />
                            </div>

                            <div>
                                <InputLabel htmlFor="password" value="Password" />
                                <TextInput type="password" className="w-full" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                                <InputError className="mt-2" message={errors.password} />
                            </div>
                            <div>
                                <InputLabel htmlFor="password_confirmation" value="Konfirmasi Password" />
                                <TextInput type="password" className="w-full" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} />
                                <InputError className="mt-2" message={errors.password_confirmation} />
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