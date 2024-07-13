import { useRef } from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import useClickOutside from "../hooks/useClickOutside";
import useOptions from "../hooks/useOptions";
import Options, { OptionProps } from "../Options";
import { cn } from "../utils/lib";
import { getOptionKeyOrValue } from "../utils/options-helper";

interface CustomSelectProps<T> extends OptionProps<T> {
    id?: string;
    popupClassName?: string;
    selectClassName?: string;
}

function CustomSelect<T>({
    options,
    value,
    onSelect,
    activeClassName,
    id = "select-label",
    ...rest
}: CustomSelectProps<T>) {
    const selectRef = useRef<HTMLDivElement>(null);
    const { isOpen, focusedIndex, handleClose, handleKeyDown, handleOpenToggle } = useOptions({
        options,
        onSelect,
    });

    useClickOutside(selectRef, handleClose);

    const handleSelect = (selectedValue: T) => {
        onSelect(selectedValue);
        handleClose();
    };

    return (
        <div ref={selectRef} className="relative">
            <div
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-labelledby={id}
                tabIndex={0}
                className={cn(
                    "w-auto min-w-40 max-w-64",
                    "cursor-pointer rounded border border-indigo-100 focus-visible:outline-indigo-200",
                    rest.selectClassName,
                )}
                onKeyDown={handleKeyDown}
                onClick={handleOpenToggle}
            >
                <div id={id} className="flex select-none items-center justify-between px-2">
                    <span>{getOptionKeyOrValue(value, rest.labelKey) || "Select Value"}</span>
                    {isOpen ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
                </div>
            </div>
            {isOpen && (
                <Options
                    value={value}
                    focusedIndex={focusedIndex}
                    options={options}
                    onSelect={handleSelect}
                    activeClassName={activeClassName}
                    {...rest}
                />
            )}
        </div>
    );
}

export default CustomSelect;
