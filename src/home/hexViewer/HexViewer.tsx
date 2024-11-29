import {StyleProps} from "../../shared/Props";
import React, {useEffect, useMemo, useState} from "react";
import styled from "styled-components";

const MAX_SECTOR_SIZE = 4096;
const CELLS_PER_ROW = 16;

const Root = styled.div`
    font-family: monospace;
`;

interface Block {
    start: number;
    count: number;
}

const EmptyData = new Uint8Array(MAX_SECTOR_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(MAX_SECTOR_SIZE, fileSize - start);
}

function getExclusiveEnd(block: Block) {
    return block.start + block.count;
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

    const test = map(rawData, (byte, index) => {
        const addBreak = (index + 1) % CELLS_PER_ROW === 0;
        return (
            <React.Fragment key={index}>
                <span style={{marginLeft: 4}}>
                    {byte.toString(16).padEnd(2, "0")}
                </span>
                {addBreak && <div />}
            </React.Fragment>
        );
    });

    return <Root>{test}</Root>;
}
