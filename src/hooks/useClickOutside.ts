import { RefObject, useEffect } from "react";

const useClickOutside = <T extends HTMLElement = HTMLElement>(
    ref: RefObject<T>,
    handler: () => void,
) => {
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const isOutside = ref.current && !ref.current.contains(e.target as Node);
            if (isOutside) {
                handler();
            }
        };
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, [ref, handler]);

    return { ref };
};

export default useClickOutside;
