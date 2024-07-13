import { CSSProperties, MouseEvent, useRef } from "react";
import { cn } from "../utils/lib";
import { getOptionKeyOrValue, isSelected } from "../utils/options-helper";

export interface OptionProps<T> {
    value: T | null;
    options: T[];
    selectedOptions?: T[];
    multiple?: boolean;
    focusedIndex?: number;
    labelKey?: keyof T;
    valueKey?: keyof T;
    activeClassName?: string;
    optionClassName?: string;
    popupClassName?: string;
    onSelect: (option: T) => void;
    renderOption?: (option: T, index: number) => JSX.Element;
    renderNoOption?: () => JSX.Element;
}

function Options<T>({
    value,
    options,
    focusedIndex,
    onSelect,
    activeClassName = "bg-indigo-300",
    ...rest
}: OptionProps<T>) {
    const listRef = useRef<HTMLUListElement>(null);

    const onOptionSelect = (e: MouseEvent<HTMLUListElement>) => {
        const liElement = (e.target as HTMLElement).closest("li[data-index]");
        if (liElement) {
            const index = liElement.getAttribute("data-index");

            if (index !== null) {
                onSelect(options[Number(index)]);
            }
        }
    };

    const renderOptionsList = () => {
        if (options.length > 0) {
            return options.map((opt, idx) => {
                let selected = isSelected(opt, value);
                if (rest.multiple && rest.selectedOptions) {
                    selected = rest.selectedOptions?.some((selectedOpt) =>
                        isSelected(opt, selectedOpt),
                    );
                }

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
                            {
                                "--tw-bg-opacity": focusedIndex === idx ? "0.25" : "1",
                            } as CSSProperties
                        }
                        data-index={idx}
                    >
                        {rest.renderOption ? (
                            rest.renderOption(opt, idx)
                        ) : (
                            <span>{getOptionKeyOrValue(opt, rest.labelKey)}</span>
                        )}
                    </li>
                );
            });
        } else {
            return (
                <li
                    role="option"
                    tabIndex={-1}
                    className={cn(
                        "cursor-pointer select-none px-2 py-1 hover:bg-indigo-100",
                        rest.optionClassName,
                    )}
                >
                    {rest.renderNoOption ? rest.renderNoOption() : <span> No Option</span>}
                </li>
            );
        }
    };
    return (
        <div className={"relative inset-0 mt-0.5 max-h-40 w-full overflow-y-auto"}>
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
    );
}

export default Options;
