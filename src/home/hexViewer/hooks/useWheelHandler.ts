import {useEffect} from "react";

export function useWheelHandler(element: HTMLElement | null, onScroll: (deltaY: number) => void) {
    useEffect(() =>{
        if (!element){
            return;
        }
        const handleWheel = (event: WheelEvent) => {
            event.preventDefault();
            onScroll(event.deltaY);
        };
        element.addEventListener("wheel", handleWheel, {passive: true});
        return () => {
            element.removeEventListener("wheel", handleWheel);
        };
    }, [element]);
}