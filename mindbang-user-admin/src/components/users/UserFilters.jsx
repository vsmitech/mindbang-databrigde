export default function UserFilters({ query, setQuery }) {
  return (
    <div className="mb-4">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Buscar por nombre o email..."
        className="border p-2 rounded w-full"
      />
    </div>
  );
}
