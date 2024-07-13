export function getOptionKeyOrValue<T>(option: T | null, key?: keyof T) {
    if (!option) return "";
    if (typeof option === "object" && key) {
        return option[key] as string;
    }
    return option as string;
}

export function isSelected<T>(option: T | null, value: T | null, key?: keyof T) {
    if (!option || !value) return false;
    return getOptionKeyOrValue(value, key) === getOptionKeyOrValue(option, key);
}
