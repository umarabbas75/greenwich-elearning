interface SearchComponentProps {
  setSearch: (value: string) => void;
  search: string;
}

const SearchComponent: React.FC<SearchComponentProps> = ({ setSearch, search }) => {
  return (
    <div className="w-full relative text-gray-600 dark:text-white/80 focus-within:text-gray-400 border rounded-md bg-white dark:bg-black md:max-w-xs">
      <span className="absolute inset-y-0 left-0 flex items-center pl-2">
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          className="w-6 h-6"
        >
          <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
        </svg>
      </span>
      <input
        type="search"
        name="q"
        className="py-2 text-sm text-accent bg-white dark:text-white/80 dark:bg-black rounded-md pl-10 w-full focus:outline-none h-full pr-2"
        placeholder="Search..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};

export default SearchComponent;
