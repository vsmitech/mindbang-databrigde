export default function Pagination({ total, page, pageSize, setPage }) {
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="flex justify-center mt-4 gap-2">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          onClick={() => setPage(i + 1)}
          className={`px-3 py-1 rounded ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
}
