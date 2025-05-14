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