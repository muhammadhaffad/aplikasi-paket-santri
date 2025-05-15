import clsx from "clsx"
import { useState } from "react";
import { twMerge } from "tailwind-merge"
import { useDebounce } from "use-debounce";

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

export function debounce(initialValue = "", delay = 500) {
    const [text, setText] = useState(initialValue);
    const [value] = useDebounce(text, delay);
    return [value, text, setText]
}

export function get(obj, path, defaultValue = undefined) {
    // Return the default value if the object is null or undefined
    if (obj == null) {
        return defaultValue;
    }

    // Handle the case where path is not provided or is empty
    if (!path) {
        return obj;
    }

    // Split the path by dots to get individual keys
    const keys = path.split('.');
    let result = obj;

    // Traverse the object using the keys
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        // Check if the current result has the key
        if (result == null || typeof result !== 'object' || !(key in result)) {
            return defaultValue;
        }

        result = result[key];
    }

    return result;
}