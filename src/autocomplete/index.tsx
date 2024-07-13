import { ChangeEvent, PropsWithChildren, useMemo, useRef } from "react";
import { RiCloseLine } from "react-icons/ri";
import useClickOutside from "../hooks/useClickOutside";
import useOptions from "../hooks/useOptions";
import Options, { OptionProps } from "../Options";
import { cn } from "../utils/lib";
import { getOptionKeyOrValue, isSelected } from "../utils/options-helper";

interface AutoCompleteProps<T> extends Omit<OptionProps<T>, "value"> {
    id?: string;
    value: string;
    limitPill?: number;
    multiple?: boolean;
    selectedOptions?: T[];
    placeholder?: string;
    disabled?: boolean;
    popupClassName?: string;
    tagClassName?: string;
    containerClassName?: string;
    onSelect: (option: T | T[]) => void;
    onChange: (filteredValue: string, e?: ChangeEvent<HTMLInputElement>) => void;
}

function AutoComplete<T>({
    value,
    onChange,
    options,
    onSelect,
    activeClassName,
    multiple = false,
    selectedOptions = [],
    limitPill = 2,
    disabled = false,
    tagClassName = "",
    placeholder = "Type...",
    id = "autocomplete",
    ...rest
}: AutoCompleteProps<T>) {
    const autocompleteRef = useRef<HTMLDivElement>(null);

    const currentOption = (
        value ? options.find((opt) => opt[rest.labelKey as keyof T] === value) : {}
    ) as T;

    const filteredOptions = useMemo(
        () =>
            options.filter((option) =>
                getOptionKeyOrValue(option, rest.labelKey)
                    .toLowerCase()
                    .includes(value.toLowerCase()),
            ),
        [value, options, rest.labelKey],
    );

    const handleSelect = (selectedValue: T) => {
        console.log({ value: selectedValue });
        if (multiple) {
            onChange("");
            const newSelected = selectedOptions.some((opt) =>
                isSelected(opt, selectedValue, rest.labelKey),
            )
                ? selectedOptions
                : [...selectedOptions, selectedValue];
            onSelect(newSelected);
        } else {
            onChange(getOptionKeyOrValue(selectedValue, rest.labelKey));
            onSelect(selectedValue);
        }
        handleClose();
    };

    const { isOpen, focusedIndex, handleOpen, handleClose, handleOpenToggle, handleKeyDown } =
        useOptions({
            options: filteredOptions,
            onSelect: handleSelect,
        });

    useClickOutside(autocompleteRef, handleClose);

    const newOptions = isOpen ? selectedOptions : selectedOptions.slice(0, limitPill);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value, e);
        handleOpen();
    };

    const handlePillClose = (option: T) => {
        onSelect(selectedOptions.filter((opt) => !isSelected(opt, option, rest.labelKey)));
    };

    return (
        <div ref={autocompleteRef} className="relative">
            <div
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-labelledby={id}
                tabIndex={0}
                className={cn(
                    "w-auto min-w-40 max-w-96",
                    "cursor-pointer rounded border border-green-100 focus-within:ring-1 focus-within:ring-green-300 focus-visible:outline-green-200",
                    rest.containerClassName,
                )}
                onClick={handleOpenToggle}
                onKeyDown={handleKeyDown}
            >
                <div className="flex">
                    {multiple && (
                        <div className="flex gap-2">
                            {newOptions.length > 0 && (
                                <>
                                    {newOptions.map((option, idx) => (
                                        <Pill
                                            closable
                                            key={idx}
                                            onClose={() => handlePillClose(option)}
                                            className={tagClassName}
                                        >
                                            <span className="truncate text-sm">
                                                {getOptionKeyOrValue(option, rest.labelKey)}
                                            </span>
                                        </Pill>
                                    ))}
                                    {!isOpen &&
                                        selectedOptions.length - limitPill > 0 &&
                                        "+" + (selectedOptions.length - limitPill)}
                                </>
                            )}
                        </div>
                    )}
                    <input
                        className="w-full rounded px-2 outline-none"
                        value={value}
                        disabled={disabled}
                        placeholder={placeholder}
                        onChange={handleChange}
                    />
                </div>
            </div>
            {isOpen && (
                <Options
                    multiple={multiple}
                    value={currentOption}
                    focusedIndex={focusedIndex}
                    options={filteredOptions}
                    onSelect={handleSelect}
                    selectedOptions={selectedOptions}
                    activeClassName={activeClassName}
                    {...rest}
                />
            )}
        </div>
    );
}

interface PillProps {
    closable?: boolean;
    className?: string;
    onClose?: () => void;
}

function Pill({ children, closable, className, onClose }: PropsWithChildren<PillProps>) {
    return (
        <div
            className={cn(
                "relative flex items-center justify-between rounded-sm border bg-gray-200 px-2 shadow-sm",
                className,
            )}
        >
            {children}
            &nbsp;
            {closable && (
                <RiCloseLine onClick={onClose} className="absolute right-0 my-auto size-3" />
            )}
        </div>
    );
}

export default AutoComplete;
