// pages/dashboard/EditUser.jsx
import { useParams } from 'react-router-dom';
import { useFetchUser } from '../../hooks/useFetchUser';
import UserForm from '../../components/users/UserForm';

const EditUser = () => {
  const { id } = useParams();
  const { data: user } = useFetchUser(`/users/${id}`);

  return (  
      <>
      <h2 className="text-xl font-semibold mb-4">Editar usuario</h2>
      <UserForm initialData={user} onSubmit={handleUpdate} />
    </>
  );
};

export default EditUser;
