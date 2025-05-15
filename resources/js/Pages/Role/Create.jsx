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
import { useEffect, useState } from 'react';
import Autocomplete from '@/Components/Autocomplete';

export default function Create({ auth }) {
    const { data: form, setData, post, errors, processing, isDirty, setDefaults, reset } = useForm({
        nama: '',
        permissions: [],
    });
    const [permissionSelected, setPermissionSelected] = useState([]);
    useEffect(() => {
        setData('permissions', permissionSelected.map((permission) => permission.id));
    }, [permissionSelected]);
    const submit = (e) => {
        e.preventDefault();
        post(route('access-control.role.store'), {
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
                reset('password', 'password_confirmation');
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
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Tambah Role</h2>
            </div>
        }
    >
        <Head title="Tambah Role" />

        <div className="py-12">
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow-sm sm:rounded-lg">
                    <section className="p-4 sm:p-8 max-w-xl space-y-6">
                        <header>
                            <h2 className="text-lg font-medium text-gray-900">Informasi Role</h2>
                        </header>
                        <form onSubmit={submit} className='space-y-6'>
                            <div>
                                <InputLabel htmlFor="nama" value="Nama" />
                                <TextInput className="w-full" value={form.nama} onChange={(e) => setData('nama', e.target.value)} />
                                <InputError className="mt-2" message={errors.nama} />
                            </div>
                            <div className='space-y-2'>
                                <InputLabel value="Permission" />
                                <div className="flex gap-2">
                                    {permissionSelected.map((permission) => (
                                        <span className="rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-800 flex items-center gap-2" key={permission.id}>{permission.label} <Lucide.X className='size-4' onClick={() => setPermissionSelected((prev) => prev.filter((item) => item.id !== permission.id))} /></span>
                                    ))}
                                </div>
                                <Autocomplete
                                    placeholder="Cari Permission"
                                    name="permission"
                                    className="w-full"
                                    onSelect={(value) => {
                                        setPermissionSelected((prev) => {
                                            // Check if item with this ID already exists in the array
                                            const isDuplicate = prev.some(item => item.id === value.id);

                                            // If it's a duplicate, return unchanged array
                                            if (isDuplicate) {
                                                return prev;
                                            }

                                            // Otherwise, add the new item
                                            return [...prev, { id: value.id, label: value.nama }];
                                        });
                                    }}
                                    apiUrl={route('permissions.api.index')}
                                    searchParam="search"
                                    displayField="nama"
                                    valueField="nama"
                                    responseField="items"
                                />
                                <InputError message={errors.permissions} />
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