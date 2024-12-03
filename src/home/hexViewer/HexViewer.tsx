import {StyleProps} from "../../shared/props/Props";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import styled from "styled-components";
import {getExclusiveEnd} from "./Block";
import {map} from "../../shared/utils";
import {FixedSizeList as List} from "react-window";

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

interface Props extends StyleProps {
    file: File;
}

const Bytes = ({
    index,
    style,
    data,
    block
}: {
    index: number;
    style: React.CSSProperties;
    data: Uint8Array;
    block: {start: number; count: number};
}) => {
    const relativeStart = index * CELLS_PER_ROW - block.start;

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
                        {byte.toString(16).padEnd(2, "0").toUpperCase()}
                    </span>
                </React.Fragment>
            );
        }
    );

    return <div style={style}>{cells}</div>;
};

export default function HexViewer({file, ...rest}: Props) {
    const reader = useMemo(() => new FileReader(), []);

    const totalRowCount = Math.ceil(file.size / CELLS_PER_ROW);

    const [rawData, setRawData] = useState<Uint8Array>(EmptyData);

    const [block, setBlock] = useState({start: 0, count: 0});

    const isLoadingRef = React.useRef(false);

    useEffect(() => {
        reader.onload = e => {
            console.log("target", e.target);
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
                setBlock(block);
            }}
        >
            {({index, style}) => (
                <Bytes
                    index={index}
                    style={style}
                    data={rawData}
                    block={block}
                />
            )}
        </List>
    );
}
