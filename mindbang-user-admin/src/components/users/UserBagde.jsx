import { useAuth } from "../../hooks/useAuth";

export default function UserBadge({ user }) {
 //const {user,activeRole} = useAuth();
  if (!user) return null;
    return ( <div className="flex items-center gap-3 p-2 bg-gray-100 rounded">
      {user.avatarUrl && (
        <img
          src={user.avatarUrl}
          alt="avatar"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div>
        <div className="font-semibold">{user.name}</div>
        <div className="text-sm text-gray-600">Rol: {activeRole}</div>
      </div>
    </div> );
}