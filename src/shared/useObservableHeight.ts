import {useEffect, useState} from "react";

export function useObservableHeight(
    element: HTMLElement | null,
    initialHeight: number = 0
): number {
    const [height, setHeight] = useState(initialHeight);

    useEffect(() => {
        if (!element) return;

        const observer = new ResizeObserver(() => {
            setHeight(element.offsetHeight);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [element]);

    return height;
}
