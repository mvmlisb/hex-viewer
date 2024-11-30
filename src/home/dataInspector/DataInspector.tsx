import {StyleProps} from "../../shared/props/Props";
import {Column} from "../../shared/components/Blocks";
import ByteOrderSelector from "./ByteOrderSelector";
import DataInspectorValues from "./DataInspectorValues";

interface Props extends StyleProps {}

export default function DataInspector({...rest}: Props) {
    return (
        <Column>
            <ByteOrderSelector></ByteOrderSelector>
            <DataInspectorValues></DataInspectorValues>
        </Column>
    );
}
