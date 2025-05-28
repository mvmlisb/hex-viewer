import {map} from "../../shared/utils";
import React from "react";
import {Column, Row} from "../../shared/components/Blocks";
import {BYTES_PER_ROW} from "./HexViewer";

export const HexViewerRow = ({
                                 index,
                                 data,
                                 maxOffset
                             }: {
    index: number;
    data?: Uint8Array;
    maxOffset: number;
}) => {
    if (!data) return null;
    const cells = map(data, (byte, index) => {
        const addSlitter = index + 1 === BYTES_PER_ROW / 2;
        return (
            <React.Fragment key={index}>
                <span
                    style={{
                        borderRight: addSlitter ? "1px solid" : "none",
                        borderColor: "lightgray",
                        padding: 4
                    }}
                >
                    {byte.toString(16).padStart(2, "0").toUpperCase()}
                </span>
            </React.Fragment>
        );
    });
    const textDecode = new TextDecoder("ascii", {fatal: true, ignoreBOM: true});
    const ascii = map(data, (byte, index) => {
        return (
            <React.Fragment key={index}>
                <span
                    style={{
                        borderColor: "lightgray",
                        padding: 4
                    }}
                >
                    {textDecode.decode(new Uint8Array([byte]))}
                </span>
            </React.Fragment>
        );
    });

    return (
        <Row>
            <span
                style={{
                    background: "lightgray",
                    padding: 4,
                    whiteSpace: "pre",
                    marginRight: 16
                }}
            >
                {(index * BYTES_PER_ROW)
                    .toString()
                    .padEnd(maxOffset.toString().length, " ")}
            </span>
            <Row>
                {cells}

            </Row>
            <Row style={{marginLeft: 16}}>
                {ascii}

            </Row>
        </Row>
    );
};