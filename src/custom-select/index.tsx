import { CSSProperties, KeyboardEvent, MouseEvent as RMouseEvent, useRef, useState } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";
import { cn } from "../utils/lib";

interface CustomSelectProps<T> {
    id?: string;
    options: T[];
    value: T | null;
    labelKey?: keyof T;
    valueKey?: keyof T;
    activeClassName?: string;
    optionClassName?: string;
    popupClassName?: string;
    selectClassName?: string;
    onSelect: (option: T) => void;
    renderOption?: (option: T, index: number) => JSX.Element;
}

function CustomSelect<T>({
    options,
    value,
    onSelect,
    activeClassName = "bg-indigo-300",
    id = "select-label",
    ...rest
}: CustomSelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const listRef = useRef<HTMLUListElement>(null);
    const selectRef = useRef<HTMLDivElement>(null);

    const onOptionSelect = (e: RMouseEvent<HTMLUListElement>) => {
        const liElement = (e.target as HTMLElement).closest("li[data-index]");
        if (liElement) {
            const index = liElement.getAttribute("data-index");
            if (index !== null) {
                onSelect(options[Number(index)]);
            }
        }
        setIsOpen(false);
    };

    const isSelected = (option: T) => {
        if (option) {
            return getOptionValue(value) === getOptionValue(option);
        }
        return false;
    };

    const getOptionLabel = (option: T | null) => {
        if (!option) return "";
        if (typeof option === "object" && rest.labelKey) {
            return option[rest?.labelKey] as string;
        }
        return option as string;
    };

    const getOptionValue = (option: T | null) => {
        if (!option) return "";
        if (typeof option === "object" && rest.valueKey) {
            return option[rest.valueKey];
        }
        return option;
    };

    const renderOptionsList = () => {
        return options.map((opt, idx) => {
            const selected = isSelected(opt);
            return (
                <li
                    role="option"
                    aria-selected={selected}
                    key={idx}
                    tabIndex={-1}
                    className={cn(
                        "cursor-pointer select-none px-2 py-1 hover:bg-indigo-100",
                        idx !== options.length - 1 && "border-b",
                        selected && activeClassName,
                        focusedIndex === idx && activeClassName,
                        rest.optionClassName,
                    )}
                    style={
                        { "--tw-bg-opacity": focusedIndex === idx ? "0.25" : "1" } as CSSProperties
                    }
                    data-index={idx}
                >
                    {rest.renderOption ? (
                        rest.renderOption(opt, idx)
                    ) : (
                        <span> {getOptionLabel(opt)}</span>
                    )}
                </li>
            );
        });
    };

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

    const handleSelectKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
            case "Space":
                e.preventDefault();
                handleOpen();
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

    useClickOutside(selectRef, handleClose);

    return (
        <div ref={selectRef} className="relative w-auto min-w-40 max-w-64">
            <div
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-labelledby={id}
                tabIndex={0}
                className={cn(
                    "cursor-pointer rounded border border-indigo-100 focus-visible:outline-indigo-200",
                    rest.selectClassName,
                )}
                onKeyDown={handleSelectKeyDown}
                onClick={handleOpenToggle}
            >
                <div id={id} className="flex select-none items-center justify-between px-2">
                    <span>{getOptionLabel(value) || "Select Value"}</span>
                    {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </div>
            </div>
            {isOpen && (
                <div className={"relative inset-0 top-full mt-0.5 max-h-40 w-full overflow-y-auto"}>
                    <ul
                        ref={listRef}
                        role="listbox"
                        aria-activedescendant={`option-${focusedIndex}`}
                        className={cn(
                            "rounded border border-indigo-200 bg-white shadow-sm",
                            rest.popupClassName,
                        )}
                        onClick={onOptionSelect}
                    >
                        {renderOptionsList()}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default CustomSelect;
