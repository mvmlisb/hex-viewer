import {Column} from "../../shared/components/Blocks";
import React, {useEffect, useRef} from "react";

export default function Scrollbar() {
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const isMouseDownRef = useRef<boolean>(false);
    const prevMouseDownYRef = useRef<number>(-1);

    console.log("prevMouseDownYRef.current", prevMouseDownYRef.current);
    const [thumbY, setThumbY] = React.useState<number>(0);

    useEffect(() => {
        const handleMouseUp = () => {
            console.log("mouse up");
            isMouseDownRef.current = false;
        };

        const handleMouseMove = (e: MouseEvent) => {
            if (!isMouseDownRef.current) {
                return;
            }

            const prevMouseDown = prevMouseDownYRef.current;

            if (prevMouseDown === -1) {
                prevMouseDownYRef.current = e.clientY;
                return;
            }

            setThumbY(prev => {
                if (e.clientY === prev) {
                    return prev;
                }
                prevMouseDownYRef.current = e.clientY;

                const diff = e.clientY - prevMouseDown;

                console.log("e", e);
                console.log("prevMouseDown", prevMouseDown);
                console.log("diff", diff);
                return prev + diff;
            });
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    return (
        <Column
            style={{
                height: "100%",
                position: "relative"
            }}
        >
            <div
                style={{
                    height: "8px",
                    width: "8px",
                    position: "relative",
                    border: "1px solid black"
                }}
            />
            <div
                ref={thumbRef}
                style={{
                    height: "8px",
                    position: "relative",
                    width: "8px",
                    border: "1px solid lightgray",
                    top: Math.max(0, thumbY)
                }}
                onMouseDown={() => {
                    console.log("mouse down");
                    isMouseDownRef.current = true;
                }}
            />

            <div
                style={{
                    height: "8px",
                    width: "8px",
                    position: "absolute",
                    border: "1px solid black",
                    bottom: "0"
                }}
            />
        </Column>
    );
}
