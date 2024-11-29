import {StyleProps} from "../../shared/Props";

interface Props extends StyleProps {}

export default function DataInspector({...rest}: Props) {
    return <div {...rest}></div>;
}
