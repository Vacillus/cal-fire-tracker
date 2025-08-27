interface SearchBarProps {
  className?: string;
  onSearch?: (query: string) => void;
}

export default function SearchBar({ className, onSearch }: SearchBarProps) {
  return (
    <div className={`bg-white p-2 rounded shadow-md ${className || ''}`}>
      <div className="flex items-center gap-2">
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Search county or fire name..."
          className="w-full p-2 border rounded focus:outline-none focus:border-blue-500"
          onChange={(e) => onSearch?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSearch) {
              onSearch((e.target as HTMLInputElement).value);
            }
          }}
        />
      </div>
    </div>
  );
}