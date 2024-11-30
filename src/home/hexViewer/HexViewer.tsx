import {StyleProps} from "../../shared/props/Props";
import React, {useEffect, useMemo, useState} from "react";
import {Block, getExclusiveEnd} from "./Block";
import {map} from "../../shared/utils";

import AutoSizer from "react-virtualized-auto-sizer";
import {FixedSizeList} from "react-window";

const MAX_SECTOR_SIZE = 4096;
const CELLS_PER_ROW = 16;

const EmptyData = new Uint8Array(MAX_SECTOR_SIZE);

function getByteCountToRead(start: number, fileSize: number) {
    return Math.min(MAX_SECTOR_SIZE, fileSize - start);
}

interface Props extends StyleProps {
    file: File;
}

const Row = ({
    index,
    style,
    data
}: {
    index: number;
    style: React.CSSProperties;
    data: FileReader;
}) => <div style={style}>{index}</div>;

export default function HexViewer({file, ...rest}: Props) {
    const reader = useMemo(() => new FileReader(), []);
    const [block, setBlock] = useState<Block>({
        start: 0,
        count: getByteCountToRead(0, file.size)
    });

    const totalRowCount = Math.ceil(file.size / CELLS_PER_ROW);

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
        <AutoSizer
            id={"autosizer"}
            style={{position: "relative", fontFamily: "monospace"}}
        >
            {({height, width}: {height: number; width: number}) => (
                <FixedSizeList
                    height={height}
                    itemCount={totalRowCount}
                    itemSize={20}
                    itemData={reader}
                    width={width}
                >
                    {}
                    {Row}
                </FixedSizeList>
            )}
        </AutoSizer>
    );
}
