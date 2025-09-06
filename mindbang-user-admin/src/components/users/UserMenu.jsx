import UserForm from "./UserForm";
import Modal from '../ui/Modal'

const UserMenu = ({ user, onClose }) => (
    <Modal tittle="Editar Usuario" onClose={onClose}>
        <UserForm initialData={user} onSubmit={handleUpdate}/>
        </Modal>
)
