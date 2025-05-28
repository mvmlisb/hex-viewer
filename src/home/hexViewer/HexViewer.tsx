import {StyleProps} from "../../shared/props/Props";
import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components";
import {useFileData} from "./useFileReader";
import {useObservableHeight} from "../../shared/useObservableHeight";
import {HexViewerRow} from "./HexViewerRow";
import {useWheelHandler} from "./hooks/useWheelHandler";

const CHUNK_SIZE = 4096;
export const BYTES_PER_ROW = 16;
const ROW_HEIGHT = 14;

const Root = styled.div`
    font-family: monospace;
    overflow-y: hidden;
`;
const EmptyData = new Uint8Array(CHUNK_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(CHUNK_SIZE, fileSize - start);
}

function countZeroesInNumber(number: number) {
    let count = 0;
    let currentNumber = number;
    while (currentNumber) {
        count += currentNumber & 1;
        currentNumber >>= 1;
    }
    return count;
}

interface Props extends StyleProps {
    file: File;
}

export default function HexViewer({file}: Props) {
    const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(
        null
    );

    const height = useObservableHeight(containerRef);

    const totalRowCount = Math.ceil(file.size / BYTES_PER_ROW);
    const visibleRowCount = Math.floor(height / ROW_HEIGHT);

    const [topRow, setTopRow] = useState(0);

    const {requestRead, getRowData} = useFileData(file, BYTES_PER_ROW);

    useEffect(() => {
        requestRead(topRow, visibleRowCount);
    }, [topRow, visibleRowCount]);

    const lastVisibleRow = totalRowCount - visibleRowCount;

    const setTopRowSafely = useCallback(
        (value: ((prev: number) => number) | number) => {
            setTopRow((prev: number) => {
                const newValue =
                    typeof value === "function" ? value(prev) : value;
                if (newValue < 0) return 0;
                if (newValue > lastVisibleRow) return lastVisibleRow;
                return newValue;
            });
        },
        [lastVisibleRow]
    );

    const handleScroll = useCallback(
        (scrollY: number) => {
            setTopRowSafely((prev: number) => prev + (scrollY > 0 ? 1 : 1));
        },
        [setTopRowSafely]
    );

    useWheelHandler(containerRef, handleScroll);

    const renderRows = () => {
        const rows: any[] = [];
        const endRowExclusive = Math.min(
            topRow + visibleRowCount,
            totalRowCount
        );
        for (let i = topRow; i < endRowExclusive; i++) {
            rows.push(
                <HexViewerRow
                    key={i}
                    index={i}
                    data={getRowData(i)}
                    maxOffset={(totalRowCount - 1) * BYTES_PER_ROW}
                />
            );
        }
        return rows;
    };

    return (
        <div
            style={{
                height: "100%",
                position: "relative",
                display: "flex",
                flexDirection: "column",
                fontFamily: "monospace"
            }}
            ref={setContainerRef}
        >
            {renderRows()}
        </div>
    );
}