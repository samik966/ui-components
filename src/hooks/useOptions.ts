import { KeyboardEvent, useState } from "react";

type Props<T> = {
    options: T[];
    onSelect: (option: T) => void;
};

function useOptions<T>({ options, onSelect }: Props<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);

    const handleOpenToggle = () => {
        if (!document.startViewTransition) {
            setIsOpen((prev) => !prev);
        }
        document.startViewTransition(() => {
            setIsOpen((prev) => !prev);
        });
    };

    const handleOpen = () => {
        if (!document.startViewTransition) {
            setIsOpen(true);
        }
        document.startViewTransition(() => {
            setIsOpen(true);
        });
    };
    const handleClose = () => {
        if (!document.startViewTransition) {
            setIsOpen(false);
        }
        document.startViewTransition(() => {
            setIsOpen(false);
        });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
        switch (e.code) {
            case "Enter":
                e.preventDefault();
                onSelect(options[focusedIndex]);
                handleClose();
                break;
            case "Escape":
                e.preventDefault();
                handleClose();
                break;
            case "ArrowDown":
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % options.length);
                break;
            case "ArrowUp":
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + options.length) % options.length);
                break;
            case "Home":
                e.preventDefault();
                setFocusedIndex(0);
                break;
            case "End":
                e.preventDefault();
                setFocusedIndex(options.length - 1);
                break;
            default:
                break;
        }
    };

    return { handleClose, handleOpen, handleOpenToggle, handleKeyDown, isOpen, focusedIndex };
}

export default useOptions;
