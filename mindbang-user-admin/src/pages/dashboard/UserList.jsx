import { useState, useEffect, use } from "react";
import userService from '../../services/userService';
import TabContainer from "../../components/ui/TabContainer";
import UserTable from "../../components/users/UserTable";
import UserFilters from "../../components/users/UserFilters";
import Pagination from "../../components/shared/Pagination";
import { useAuth } from '../../hooks/useAuth';
import UserForm from "../../components/users/UserForm";
import UserProfile from "../../components/users/UserProfile";
import UserApplication from "../../components/users/UserAplication";
import { FiUserPlus } from "react-icons/fi";


export default function UserList() {

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtered, setFiltered] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  // El trigger que usas para forzar la recarga
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const pageSize = 10;

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getUsers();
      setUsers(data.users);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  // Un único useEffect que maneja la carga inicial y las recargas
  useEffect(() => {
    console.log("Cargando usuarios...");
    fetchUsers();
  }, [refreshTrigger]);

  // Otro useEffect para el filtrado, que se ejecuta cuando los usuarios o el query cambian
  useEffect(() => {
    const filteredUsers = users.filter(u =>
      u?.username?.toLowerCase().includes(query.toLowerCase()) ||
      u?.email?.toLowerCase().includes(query.toLowerCase())
    );    
    setFiltered(filteredUsers);
    setPage(1); // Reset paginación al filtrar
  }, [query, users]);


  // Evento para crear nuevo usuario
  const handleNewUser = () => {
    setSelectedUser(userService.newUser());
  };

  const handleEditClick = (user) => {
    setSelectedUser(user);
  };

  // Evento de actualización de usuario
  const handleUpdate = (updatedUser) => {
    setUsers(prevUsers => prevUsers.map(u => {
      if (u._id === updatedUser._id) {
        return updatedUser;
      }
      return u;
    }));
    //setSelectedUser(null);
  };

  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);
  const { user } = useAuth();

  // Restringir acceso a esta página, solo con permisos otorgados por auth service 
  // (completar lógica según permisos del usuario)
  //if (!user.roles.includes('admin') && !user.roles.includes('sys-admin'))
    //return <div>No autorizado</div>;

  const tabs = [
    {
      label: '🔐 Autenticación',
      content: <UserForm initialData={selectedUser} onSubmit={handleUpdate} />
    },
    {
      label: '👤 Datos personales',
      content: <UserProfile userId={selectedUser} />
    }/*,
    {
      label: '🧩 Acceso a apps',
      content: <UserApplication userId={selectedUser} />
    }*/
  ];


  return (
    <div>
      <h2 className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">👥 Gestión de Usuarios</h2>
      <UserFilters query={query} setQuery={setQuery} />
      <UserTable users={paginated} onEditClick={handleEditClick} selectedUser={selectedUser} onUpdate={handleUpdate} />
      <Pagination
        total={filtered.length}
        page={page}
        pageSize={pageSize}
        setPage={setPage}
      />
      <button className="w-full py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition mt-2 flex items-center justify-center space-x-2" onClick={handleNewUser}>
        <span> Nuevo</span> <FiUserPlus />
      </button>

      {selectedUser && (
        <div className="mt-4 p-4 border rounded-md bg-gray-50 dark:bg-gray-800">
          <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
            Editando: {selectedUser.username}
          </h3>
          <div className="mt-6">
            <TabContainer tabs={tabs} />
          </div>
        </div>
      )}

    </div>
  );
}
