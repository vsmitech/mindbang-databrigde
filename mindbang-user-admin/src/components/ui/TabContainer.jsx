import { useState } from "react";

export default function TabContainer({tabs,defaultIndex = 0}){

    const[activeIndex,setActiveIndex] =useState(defaultIndex);

    return (
        <div className="space-y-4">
      {/* Encabezado de tabs */}
      <div className="flex space-x-2 border-b border-gray-300 dark:border-gray-700">
        {tabs.map((tab, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-2 text-sm font-medium rounded-t ${
              idx === activeIndex
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Contenido activo */}
      <div className="p-4 border border-gray-300 dark:border-gray-700 rounded-b bg-white dark:bg-gray-900">
        {tabs[activeIndex].content}
      </div>
    </div>
    );
};