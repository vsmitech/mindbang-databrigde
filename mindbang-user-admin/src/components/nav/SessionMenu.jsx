import { useAuth } from "../../hooks/useAuth";
import RoleSelector from "../roles/RoleSelector";
import UserBadge from '../users/UserBagde'
import { FiPower } from "react-icons/fi";

export default function SessionMenu() {
    const {user,logout} = useAuth();
    if(!user) return null;  
    return (
    <div className="flex p-3 rounded">
      <UserBadge />
      <button
        onClick={logout}
        className="bg-gray-300 text-white p-2 rounded hover:bg-black-600 cursor-pointer"
      >
        <FiPower className="mr-1" />
      </button>
    </div>
  );
};