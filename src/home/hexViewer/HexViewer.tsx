import {StyleProps} from "../../shared/props/Props";
import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled from "styled-components";
import {Block, getExclusiveEnd} from "./Block";
import {map} from "../../shared/utils";
import {FixedSizeList as List} from "react-window";
import {Row} from "../../shared/components/Blocks";

const MAX_SECTOR_SIZE = 4096;
const CELLS_PER_ROW = 16;

const Root = styled.div`
    font-family: monospace;
    overflow-y: hidden;
`;
const EmptyData = new Uint8Array(MAX_SECTOR_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(MAX_SECTOR_SIZE, fileSize - start);
}

function countZeroesInNumber(number: number) {
    let count = 0;
    let currentNumber = number;
    while (currentNumber) {
        count += currentNumber & 1;
        currentNumber >>= 1;
    }
}

interface Props extends StyleProps {
    file: File;
}

const Bytes = ({
    index,
    style,
    data,
    readBlock
}: {
    index: number;
    style: React.CSSProperties;
    data: Uint8Array;
    readBlock?: Block;
}) => {
    const relativeStart = index * CELLS_PER_ROW - (readBlock?.start ?? 0);

    const cells = map(
        data.slice(relativeStart, relativeStart + CELLS_PER_ROW),
        (byte, index) => {
            const addSlitter = index + 1 === CELLS_PER_ROW / 2;
            return (
                <React.Fragment key={index}>
                    <span
                        style={{
                            padding: 4,
                            borderRight: addSlitter ? "1px solid" : "none",
                            borderColor: "lightgray"
                        }}
                    >
                        {byte.toString(16).padStart(2, "0").toUpperCase()}
                    </span>
                </React.Fragment>
            );
        }
    );

    return (
        <Row style={style}>
            <span style={{background: "lightgray", padding: 4}}>
                {" "}
                {index * CELLS_PER_ROW}
            </span>
            {cells}
        </Row>
    );
};

export default function HexViewer({file, ...rest}: Props) {
    const reader = useMemo(() => new FileReader(), []);

    const totalRowCount = Math.ceil(file.size / CELLS_PER_ROW);

    const [rawData, setRawData] = useState<Uint8Array>(EmptyData);

    const blockRef = useRef<Block>();

    const isLoadingRef = React.useRef(false);

    useEffect(() => {
        reader.onload = e => {
            console.log("target", e);
            const data = new Uint8Array(reader.result as ArrayBuffer);
            setRawData(data);
            isLoadingRef.current = false;
        };
        return () => {
            // reader.abort();
        };
    }, [reader]);

    const requestRead = useCallback(
        (block: {start: number; count: number}) => {
            reader.readAsArrayBuffer(
                file.slice(block.start, getExclusiveEnd(block))
            );
        },
        [file, reader]
    );

    return (
        <div style={{maxHeight: "500px", position: "relative"}}>
            <List
                style={{
                    fontFamily: "monospace"
                }}
                height={500}
                itemCount={totalRowCount}
                itemData={rawData}
                itemSize={24}
                width={600}
                onItemsRendered={({visibleStartIndex, visibleStopIndex}) => {
                    if (isLoadingRef.current) {
                        return;
                    }

                    isLoadingRef.current = true;

                    const start = visibleStartIndex * CELLS_PER_ROW;
                    const count = Math.min(
                        (visibleStopIndex - visibleStartIndex) * CELLS_PER_ROW,
                        file.size - start
                    );

                    console.log("start", start, "count", count);

                    const block = {start, count};
                    requestRead(block);
                    blockRef.current = block;
                }}
            >
                {({index, style}) => (
                    <Bytes
                        index={index}
                        style={style}
                        data={rawData}
                        readBlock={blockRef.current}
                    />
                )}
            </List>
        </div>
    );
}
