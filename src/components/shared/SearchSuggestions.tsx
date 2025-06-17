import React from 'react';

interface SearchSuggestionsProps {
  items: any[];
  searchTerm: string;
  onSelect: (item: any) => void;
  visible: boolean;
}

const SearchSuggestions = ({ items, searchTerm, onSelect, visible }: SearchSuggestionsProps) => {
  if (!visible || !searchTerm) return null;

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredItems.length === 0) return null;

  return (
    <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
      <ul className="max-h-60 overflow-auto py-1">
        {filteredItems.map((item, index) => (
          <li
            key={item.id}
            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
            onClick={() => onSelect(item)}
          >
            <div className="flex justify-between items-center">
              <span>{item.name}</span>
              <span className="text-gray-500">{item.price}</span>
            </div>
            {item.brand && (
              <span className="text-xs text-gray-500">{item.brand} • {item.category}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchSuggestions;