import {StyleProps} from "../../shared/props/Props";
import styled from "styled-components";
import {ComputerType} from "./Computers";

const Root = styled.div`
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
`;

const ComputerLabels: Record<ComputerType, string> = {
    get8Bit: "8-bit integer",
    get16Bit: "16-bit integer",
    get32Bit: "32-bit integer",
    get64Bit: "64-bit integer"
};

const Header = styled.h5``;

const HeaderLabels = ["Type", "Unsigned (+)", "Signed (+-)"];

interface Props extends StyleProps {}

export default function DataInspectorValues({...rest}: Props) {
    return (
        <Root>
            {HeaderLabels.map((label, index) => (
                <Header key={index}>{label}</Header>
            ))}
        </Root>
    );
}
