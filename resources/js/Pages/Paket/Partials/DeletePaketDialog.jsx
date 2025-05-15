import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import DangerButton from "@/Components/DangerButton";
import { useForm } from "@inertiajs/react";

const DeletePaketDialog = ({ show, onClose, rowSelected, refresh }) => {
    const {
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({});

    const deletePaket = (e) => {
        e.preventDefault();
        destroy(route('pakets.destroy', { id: rowSelected?.id }), {
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
            <form onSubmit={deletePaket} className='p-6 space-y-4'>
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">Hapus Paket</h2>
                <p className="text-gray-600">Apakah Anda yakin ingin menghapus paket <b>{rowSelected?.nama}</b>?</p>
                <div className="flex justify-end gap-2">
                    <SecondaryButton onClick={() => onClose()}>Batal</SecondaryButton>
                    <DangerButton>Hapus</DangerButton>
                </div>
            </form>
        </Modal>
    );
}
export default DeletePaketDialog;