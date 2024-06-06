import { forwardRef, useEffect, useRef } from 'react';

const SelectInput = forwardRef(function SelectInput({ className = '', isFocused = false, options = [], ...props }, ref) {
    const selectRef = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            selectRef.current.focus();
        }
    }, []);

    return (
        <select
            {...props}
            className={
                'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm ' +
                className
            }
            ref={selectRef}
        >
            {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                    {option.text}
                </option>
            ))}
        </select>
    );
});

export default SelectInput;
