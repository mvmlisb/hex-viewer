import {StyleProps} from "../../shared/props/Props";
import styled from "styled-components";
import {
    DataViewOperationsBySignType,
    DataViewOperationType
} from "./DataViewOperations";
import {SignType} from "./SignType";
import {useDataStore} from "../MainPage";
import React from "react";

const Root = styled.div`
    display: grid;
    grid-template-columns: 3fr 2fr 2fr;
`;

const HeaderCell = styled.h5``;

const RegularCell = styled.span``;

const HeaderLabels = ["Type", "Unsigned", "Signed"];

const ComputerLabels: Record<DataViewOperationType, string> = {
    get8Bit: "8-bit integer",
    get16Bit: "16-bit integer",
    get32Bit: "32-bit integer",
    get64Bit: "64-bit integer"
};

interface Props extends StyleProps {}

export default function DataInspectorValues({...rest}: Props) {
    const data = useDataStore(state => state.data);
    return (
        <Root>
            {HeaderLabels.map((label, index) => (
                <HeaderCell key={label}>{label}</HeaderCell>
            ))}
            {Object.entries(ComputerLabels).map(([type, value]) => (
                <React.Fragment key={type}>
                    <RegularCell>{value}</RegularCell>
                    <RegularCell>
                        {DataViewOperationsBySignType[SignType.Unsigned][
                            type as DataViewOperationType
                        ](data)}
                    </RegularCell>
                    <RegularCell>
                        {DataViewOperationsBySignType[SignType.Unsigned][
                            type as DataViewOperationType
                        ](data)}
                    </RegularCell>
                </React.Fragment>
            ))}
        </Root>
    );
}
