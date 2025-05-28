import {useCallback, useEffect, useMemo, useRef, useState} from "react";

const CHUNK_SIZE = 4096;
const CHUNKS_TO_PRELOAD_EACH_SIDE = 4;

function getChunkNumberFromOffset(offset: number) {
    return Math.floor(offset / CHUNK_SIZE);
}

function getActiveChunks(
    startChunk: number,
    chunkCount: number,
    totalChunkCount: number
) {
    const activeChunks: number[] = [];

    for (
        let activeChunk = startChunk;
        activeChunk < startChunk + chunkCount;
        activeChunk++
    ) {
        activeChunks.push(activeChunk);
    }

    // for (
    //     let preTopChunk = startChunk - CHUNKS_TO_PRELOAD_EACH_SIDE;
    //     preTopChunk < chunkCount && preTopChunk >= 0;
    //     preTopChunk++
    // ) {
    //     activeChunks.push(preTopChunk);
    // }

    // for (
    //     let postBottomChunk = startChunk + chunkCount;
    //     postBottomChunk < totalChunkCount;
    //     postBottomChunk++
    // ) {
    //     if (postBottomChunk >= totalChunkCount) {
    //         break;
    //     }
    //     activeChunks.push(postBottomChunk);
    // }

    return activeChunks;
}

export function useFileData(file: File, bytesInRow: number) {
    const [readChunks, setReadChunks] = useState<Record<string, Uint8Array>>(
        {}
    );
    const activeChunksRef = useRef<number[]>([]);
    const readChunkRef = useRef<number>();

    const fileReader = useMemo(() => new FileReader(), []);

    const readNextChunk = useCallback(() => {
        const nextChunkToRead = activeChunksRef.current.find(
            activeChunk => !readChunks[activeChunk]
        );
        if (nextChunkToRead !== undefined) {
            readChunkRef.current = nextChunkToRead;
            const start = nextChunkToRead * CHUNK_SIZE;
            const end = Math.min(start + CHUNK_SIZE, file.size);
            fileReader.readAsArrayBuffer(file.slice(start, end));
        }
    }, [readChunks, fileReader]);

    useEffect(() => {
        readNextChunk();
    }, [readChunks]);

    useEffect(() => {
        fileReader.onload = e => {
            const data = new Uint8Array(fileReader.result as ArrayBuffer);
            const readChunkNumber = readChunkRef.current;
            if (readChunkNumber !== undefined) {
                setReadChunks(prev => {
                    const relevantReadChunks = Object.fromEntries(
                        Object.entries(prev).filter(([chunkNumber]) =>
                            activeChunksRef.current.includes(
                                parseInt(chunkNumber)
                            )
                        )
                    );
                    if (activeChunksRef.current.includes(readChunkNumber)) {
                        relevantReadChunks[readChunkNumber] = data;
                    }
                    return relevantReadChunks;
                });
            }
            readChunkRef.current = undefined;
        };
        return () => {
            fileReader.abort();
        };
    }, [fileReader]);

    const requestRead = useCallback(
        (topRow: number, visibleRowCount: number) => {
            const chunkNumber = getChunkNumberFromOffset(topRow * bytesInRow);
            const chunkCount = Math.ceil(
                (visibleRowCount * bytesInRow) / CHUNK_SIZE
            );
            activeChunksRef.current = getActiveChunks(
                chunkNumber,
                chunkCount,
                Math.ceil(file.size / CHUNK_SIZE)
            );
            readNextChunk();
        },
        [file, bytesInRow, fileReader]
    );

    const getRowData = useCallback(
        (row: number) => {
            const offset = row * bytesInRow;
            const chunkNumber = getChunkNumberFromOffset(offset);
            const readChunk = readChunks?.[chunkNumber];
            if (readChunk) {
                const start = offset % CHUNK_SIZE;
                const end = Math.min(
                    start + bytesInRow,
                    start + (file.size - offset)
                );
                return readChunk.slice(start, end);
            }
        },
        [readChunks, file]
    );

    return {requestRead, getRowData};
}
