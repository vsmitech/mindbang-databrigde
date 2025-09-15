export default function AppAccessPanel() {
  return (
    <div className="mt-12">
      <div className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-2 items-center inline-flex w-full justify-center space-x-2">
        <h2 className="text-xl font-bold">🧩 Acceso a Aplicaciones</h2>
      </div>
      <p>Administra qué apps están disponibles para cada cliente o usuario.</p>
      {/* Placeholder para panel de apps */}
      <div className="mt-4 border rounded p-4 text-gray-500">
        Módulo en construcción: listado de apps, toggles de acceso y logs.
      </div>
    </div>
  );
}
