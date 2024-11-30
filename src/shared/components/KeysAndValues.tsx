import React from "react";
import {Column} from "./Blocks";

interface KeyValue {
    key: React.ReactNode;
    value: React.ReactNode;
}

interface Props {
    keysAndValues: KeyValue[];
}

export default function KeysAndValues({keysAndValues}: Props) {
    return (
        <Column>
            {keysAndValues.map(({key, value}, index) => (
                <Column key={index}>
                    <div>{key}</div>
                    <div>{value}</div>
                </Column>
            ))}
        </Column>
    );
}
