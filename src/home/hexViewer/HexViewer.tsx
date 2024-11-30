import {StyleProps} from "../../shared/props/Props";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {Block, getExclusiveEnd} from "./Block";

const MAX_SECTOR_SIZE = 4096;
const CELLS_PER_ROW = 16;

const Root = styled.div`
    font-family: monospace;
    overflow-y: auto;
    height: 100vh;
`;
const EmptyData = new Uint8Array(MAX_SECTOR_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(MAX_SECTOR_SIZE, fileSize - start);
}

interface Props extends StyleProps {
    file: File;
}

function map<T>(
    array: Uint8Array,
    map: (value: number, index: number) => T
): T[] {
    const result: T[] = [];
    array.forEach((byte, index) => result.push(map(byte, index)));
    return result;
}

export default function HexViewer({file, ...rest}: Props) {
    const reader = useMemo(() => new FileReader(), []);
    const [block, setBlock] = useState<Block>({
        start: 0,
        count: getByteCountToRead(0, file.size)
    });

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

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        console.log(e);
    }, []);

    return (
        <Root onScroll={handleScroll} {...rest}>
            {cells}
        </Root>
    );
}
