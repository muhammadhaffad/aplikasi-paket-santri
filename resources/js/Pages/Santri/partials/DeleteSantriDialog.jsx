import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { useForm } from "@inertiajs/react";

const DeleteSantriDialog = ({ show, onClose, rowSelected, refresh }) => {
    const {
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({});

    const deleteSantri = (e) => {
        e.preventDefault();
        destroy(route('santris.destroy', { nis: rowSelected?.nis }), {
            onSuccess: () => {
                refresh();
                onClose();
            },
            onError: () => onClose(),
            preserveScroll: true,
        });
    };

    return (
        <Modal
            show={show}
            onClose={onClose}
            maxWidth='md'
        >
            <form onSubmit={deleteSantri} className='p-6 space-y-4'>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Hapus Santri</h2>
                <p className="text-gray-600">Apakah Anda yakin ingin menghapus santri <b>{rowSelected?.nama}</b>?</p>
                <div className="flex justify-end gap-2">
                    <SecondaryButton onClick={() => onClose()}>Batal</SecondaryButton>
                    <DangerButton>Hapus</DangerButton>
                </div>
            </form>
        </Modal>
    );
}
export default DeleteSantriDialog;