// src/components/nav/SidebarMenu.jsx
import { Link,useLocation } from 'react-router-dom';
import { useState } from 'react';
import {FiChevronLeft, FiChevronRight, FiUser,FiHome,FiGrid,FiShield} from 'react-icons/fi';

export default function SidebarMenu() {

    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    const navItems = [
        { name: 'Overview', path: '/dashboard/overview',icon:<FiHome></FiHome> },  
        { name: 'Usuarios', path: '/dashboard/users',icon:<FiUser></FiUser> },
        { name: 'Roles', path: '/dashboard/roles',icon:<FiShield></FiShield> },
        { name: 'Apps', path: '/dashboard/apps',icon:<FiGrid></FiGrid> },
    ];

  return (
   <aside
      className={`bg-gray-100 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ${
        collapsed ? 'w-16' : 'w-64'
      } min-h-screen flex flex-col mt-15`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        {/* {!collapsed && (
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">MINDBANG</h2>
        )} */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 dark:text-gray-400 hover:text-blue-500"
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      {/* Navegación */}
      <nav className="flex flex-col gap-2 px-4">
        {navItems.map(({ name, path,icon }) => (
          <Link
            key={path}
            to={path}
            className={`py-2 px-2 rounded text-sm font-medium transition ${
              location.pathname === path
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800'
            }`}
          >
            {collapsed ? icon : name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
