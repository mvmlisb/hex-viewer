import { StyleProps } from "../../Common/Props";

interface Props extends StyleProps {}

export default function HexViewer({ ...rest }: Props) {
  return <div {...rest}></div>;
}
