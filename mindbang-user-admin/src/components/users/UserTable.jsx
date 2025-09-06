import { FiEdit, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";



export default function UserTable({ users, onEditClick, selectedUser, onUpdate }) {

  const isMobile = window.innerWidth < 640;

  return (
    <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
      {
        isMobile ? (
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user._id} className="bg-white shadow rounded p-4" onClick={() => onEditClick(user)}>
                <p><strong>👤 Usuario:</strong> {user.username}</p>
                <p><strong>📧 Email:</strong> {user.email}</p>
                <p><strong>🔐 Roles:</strong> {user.roles?.map((rol, idx) => (
                  <span
                    key={idx}
                    className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                  >
                    {rol.role}
                  </span>
                ))}</p>
              </div>
            ))}
          </div>
        )
          :
          (
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Username</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Roles</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-100 dark:divide-gray-800">
                {users.map(user => (
                  <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">{user.username}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-4 py-3 space-x-1">
                      {user.roles?.map((rol, idx) => (
                        <span
                          key={idx}
                          className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        >
                          {rol.role}
                        </span>
                      ))}
                    </td>
                    <td className="inline-flex items-center justify-center">
                      <button onClick={() => onEditClick(user)}><FiEdit /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
      }
    </div>
  );
}
