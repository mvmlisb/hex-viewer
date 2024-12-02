import {Column} from "../../shared/components/Blocks";
import React, {useEffect, useRef} from "react";

export default function Scrollbar() {
    const thumbRef = React.useRef<HTMLDivElement>(null);
    const thumbRootRef = React.useRef<HTMLDivElement>(null);
    const isMouseDownRef = useRef<boolean>(false);
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

            setThumbY(prev => {
                if (e.clientY === prev) {
                    return prev;
                }
                return prev + e.movementY;
            });
        };

        document.addEventListener("mouseup", handleMouseUp);
        document.addEventListener("mousemove", handleMouseMove);

        return () => {
            document.removeEventListener("mouseup", handleMouseUp);
            document.removeEventListener("mousemove", handleMouseMove);
        };
    }, []);

    console.log("new pos", Math.max(0, thumbY));

    console.log(JSON.stringify(thumbRef.current?.getBoundingClientRect()));

    return (
        <Column>
            <div
                style={{
                    height: "8px",
                    width: "8px",
                    position: "relative",
                    border: "1px solid black"
                }}
            />
            <Column
                style={{
                    height: "100%",
                    position: "relative"
                }}
                ref={thumbRootRef}
            >
                <div
                    ref={thumbRef}
                    style={{
                        height: "8px",
                        position: "relative",
                        width: "8px",
                        border: "1px solid lightgray",
                        top: Math.min(
                            Math.max(0, thumbY),
                            (thumbRootRef.current?.getBoundingClientRect()
                                .bottom ?? 0) +
                                (thumbRef.current?.getBoundingClientRect()
                                    .height ?? 0)
                        )
                    }}
                    onMouseDown={() => {
                        console.log("mouse down");
                        isMouseDownRef.current = true;
                    }}
                />
            </Column>
            <div
                style={{
                    height: "8px",
                    width: "8px",
                    position: "relative",
                    border: "1px solid black",
                    top: "0"
                }}
            />
        </Column>
    );
}
