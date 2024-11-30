import {StyleProps} from "../../shared/props/Props";
import {Column} from "../../shared/components/Blocks";
import ByteOrderSelector from "./ByteOrderSelector";

interface Props extends StyleProps {}

export default function DataInspector({...rest}: Props) {
    return (
        <Column>
            <ByteOrderSelector></ByteOrderSelector>
        </Column>
    );
}
