import {StyleProps} from "../../shared/props/Props";
import React, {useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {Block, getExclusiveEnd} from "./Block";
import {map} from "../../shared/utils";
import {Row} from "../../shared/components/Blocks";
import Scrollbar from "./Scrollbar";

const MAX_SECTOR_SIZE = 4096;
const CELLS_PER_ROW = 16;

const Root = styled.div`
    font-family: monospace;
    overflow-y: auto;
    height: 100vh;

    /* Custom scrollbar for WebKit-based browsers */

    &::-webkit-scrollbar {
        width: 5px;
        margin-left: 10px; /* Width of the scrollbar */
        max-height: 5px;
    }

    &::-webkit-scrollbar-thumb {
        background: #888; /* Color of the scrollbar thumb */
        border-radius: 10px; /* Rounded corners of the scrollbar thumb */
        max-height: 5px;
    }

    &::-webkit-scrollbar-thumb:hover {
        background: #555; /* Color of the scrollbar thumb on hover */
        max-height: 5px;
    }
`;
const EmptyData = new Uint8Array(MAX_SECTOR_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(MAX_SECTOR_SIZE, fileSize - start);
}

interface Props extends StyleProps {
    file: File;
}

function getScrollbarHeight(
    element: HTMLElement,
    totalRowCount: number,
    rowHeight: number
): number {
    const visibleHeight = element.clientHeight;
    const contentHeight = totalRowCount * rowHeight;
    return (visibleHeight / contentHeight) * visibleHeight;
}

export default function HexViewer({file, ...rest}: Props) {
    const reader = useMemo(() => new FileReader(), []);
    const [block, setBlock] = useState<Block>({
        start: 0,
        count: getByteCountToRead(0, file.size)
    });

    const rootRef = useRef<HTMLDivElement>(null);

    const totalRowCount = Math.ceil(file.size / CELLS_PER_ROW);

    const rowHeight = 20;

    const [rawData, setRawData] = useState<Uint8Array>(EmptyData);

    useEffect(() => {
        reader.onload = () => {
            const data = new Uint8Array(reader.result as ArrayBuffer);
            setRawData(data);
        };
        return () => {
            reader.abort();
        };
    }, [reader]);

    useEffect(() => {
        reader.readAsArrayBuffer(
            file.slice(block.start, getExclusiveEnd(block))
        );
    }, [block, file, reader]);

    const cells = map(rawData, (byte, index) => {
        const isEndOfRow = (index + 1) % CELLS_PER_ROW === 0;
        const addSlitter =
            (index + 1) % (CELLS_PER_ROW / 2) === 0 && !isEndOfRow;
        return (
            <React.Fragment key={index}>
                <span
                    style={
                        isEndOfRow
                            ? {
                                  borderRight: addSlitter ? "1px solid" : "none"
                              }
                            : {
                                  padding: 4,
                                  borderRight: addSlitter
                                      ? "1px solid"
                                      : "none",
                                  borderColor: "lightgray"
                              }
                    }
                >
                    {byte.toString(16).padEnd(2, "0").toUpperCase()}
                </span>
                {isEndOfRow && <div />}
            </React.Fragment>
        );
    });

    return (
        <Row>
            <Root ref={rootRef} {...rest}>
                {cells}
            </Root>
            <Scrollbar />
        </Row>
    );
}
