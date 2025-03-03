import { useState, useRef, useEffect, React} from 'react';

export const Select = ({ value, onValueChange, children, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={selectRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2 text-left border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600 ${className}`}
      >
        {value}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          {React.Children.map(children, child =>
            React.cloneElement(child, {
              onSelect: (value) => {
                onValueChange(value);
                setIsOpen(false);
              }
            })
          )}
        </div>
      )}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }) => (
  <button
    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none"
    onClick={() => onSelect(value)}
  >
    {children}
  </button>
);