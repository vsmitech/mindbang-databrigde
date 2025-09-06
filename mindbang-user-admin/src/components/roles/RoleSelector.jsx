// components/RoleSelector.jsx
import { useEffect, useState } from "react";
import { FiShield } from "react-icons/fi";
import roleService from "../../services/roleService";

const RoleSelector = ({ selectedRoles = [], onChange }) => {
  const [availableRoles, setAvailableRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await roleService.getRoleList();
        setAvailableRoles(response.roles);
      } catch (error) {
        console.error("Error al obtener roles:", error);
      }
    };
    fetchRoles();
  }, []);

  const toggleRole = (roleObj) => {
    const exists = selectedRoles.some(r => r.role === roleObj.role);
    const updated = exists
      ? selectedRoles.filter(r => r.role !== roleObj.role)
      : [...selectedRoles, roleObj];

    onChange(updated);
  };

  const safeRoles = Array.isArray(availableRoles) ? availableRoles : [];

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        <FiShield className="inline mr-1" /> Roles
      </label>
      <div className="flex flex-wrap gap-4 pl-4 pt-2">
        {safeRoles.map(roleObj => (
          <label key={roleObj._id} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedRoles.some(r => r.role === roleObj.role)}
              onChange={() => toggleRole(roleObj)}
              className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300 capitalize">
              {roleObj.role}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default RoleSelector;
