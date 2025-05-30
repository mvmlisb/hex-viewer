import React from "react";
import {Row} from "../../shared/components/Blocks";
import {ByteOrder} from "./ByteOrder";
import {useDataStore} from "../MainPage";
import RadioButton from "../../shared/components/RadioButton";

const ByteOrderLabels: Record<ByteOrder, string> = {
    [ByteOrder.LittleEndian]: "Little Endian",
    [ByteOrder.BigEndian]: "Big Endian"
};

export default function ByteOrderSelector() {
    const selectedByteOrder = useDataStore(state => state.byteOrder);
    const setByteOrder = useDataStore(state => state.setByteOrder);
    return (
        <Row>
            {Object.values(ByteOrder).map(byteOrder => (
                <RadioButton
                    key={byteOrder}
                    name="byteOrder"
                    value={byteOrder}
                    checked={byteOrder === selectedByteOrder}
                    label={ByteOrderLabels[byteOrder]}
                    onChange={() => setByteOrder(byteOrder)}
                />
            ))}
        </Row>
    );
}
