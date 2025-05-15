import { debounce, get } from '@/lib/utils';
import { useState, useEffect, useRef } from 'react';
import TextInput from './TextInput';
const Autocomplete = ({ apiUrl, searchParam = "q", displayField = "nama", valueField = "id", onSelect, onChange, onBlur, ...props }) => {
    const [debouncedQuery, query, setQuery] = debounce(props.value, 300);
    const [results, setResults] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(false);
    const inputRef = useRef(null);
    const resultsRef = useRef(null);

    const fetchResults = async (searchQuery) => {
        if (!searchQuery || searchQuery.trim() === '') {
            setResults([]);
            return;
        }

        setIsLoading(true);
        try {
            // Replace with your actual API endpoint
            // Example using JSONPlaceholder API for demonstration
            const response = await fetch(`${apiUrl}?${searchParam}=${searchQuery}`);
            const data = await response.json();
            const results = get(data, props.responseField);
            setResults(results);
        } catch (error) {
            console.error('Error fetching results:', error);
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchResults(debouncedQuery);
    }, [debouncedQuery]);

    useEffect(() => {
        if (props.value !== undefined) {
            setQuery(props.value);
        }
    }, [props.value]);

    // Handle click outside to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                resultsRef.current &&
                !resultsRef.current.contains(event.target) &&
                !inputRef.current.contains(event.target)
            ) {
                setShowResults(false);
                if (onBlur) onBlur({
                    target: {
                        name: props.name,
                        value: query
                    }
                });
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setQuery(newValue);
        setShowResults(true);
        setSelectedIndex(-1);
        if (onChange) onChange({
            target: {
                name: props.name,
                value: newValue
            }
        });
    };

    const handleSelectItem = (item) => {
        const displayValue = item[displayField];
        const actualValue = item[valueField];
        setQuery(actualValue);
        setShowResults(false);
        setSelectedIndex(-1);
        if (onChange) onChange({
            target: {
                name: props.name,
                value: actualValue,
                selectedItem: item,
                selectedValue: displayValue
            }
        });
        if (onSelect) onSelect(item);
    };

    const handleKeyDown = (e) => {
        if (!showResults) return;

        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev =>
                prev < results.length - 1 ? prev + 1 : prev
            );
        }
        // Arrow up
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        }
        // Enter
        else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleSelectItem(results[selectedIndex]);
        }
        // Escape
        else if (e.key === 'Escape') {
            setShowResults(false);
        }
    };

    const handleBlur = (e) => {
        if (onBlur) {
            onBlur({
                target: {
                    name: props.name,
                    value: query,
                    selectedItem: results[selectedIndex]
                }
            });
        }
    };
    return (
        <div className='relative w-full'>
            <TextInput ref={inputRef} value={query} onChange={handleInputChange} onKeyDown={handleKeyDown} onFocus={() => setShowResults(true)} onBlur={handleBlur} {...props} />
            {showResults && results.length > 0 && (
                <ul
                    id="autocomplete-results"
                    ref={resultsRef}
                    className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-60 overflow-auto rounded-md shadow-lg"
                    role="listbox"
                >
                    {results.map((item, index) => (
                        <li
                            key={item.id}
                            className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${selectedIndex === index ? 'bg-blue-100' : ''
                                }`}
                            onClick={() => handleSelectItem(item)}
                            onMouseEnter={() => setSelectedIndex(index)}
                            role="option"
                            aria-selected={selectedIndex === index}
                        >
                            {displayField ? item[displayField] : item.name}
                        </li>
                    ))}
                </ul>
            )}

            {showResults && query && !isLoading && results.length === 0 && (
                <div className="absolute z-10 bg-white border border-gray-300 w-full mt-1 rounded-md shadow-lg">
                    <div className="px-4 py-3 text-sm text-gray-500">No results found</div>
                </div>
            )}
        </div>
    );
};

export default Autocomplete;