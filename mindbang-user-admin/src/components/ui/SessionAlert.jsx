export default function SessionAlert({ message, onClose }) {
  return (
    <div className="fixed top-4 right-4 z-50 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md flex items-center gap-2 animate-fade-in">
      <span className="font-semibold">Sesión expirada:</span>
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-auto text-red-500 hover:text-red-700 font-bold"
      >        
      </button>
    </div>
  );
}
