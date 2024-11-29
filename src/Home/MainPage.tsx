import {Row} from "../Common/Blocks";
import HexViewer from "./HexViewer/HexViewer";
import DataInspector from "./DataInspector/DataInspector";


export default function MainPage() {
  return (
    <Row >
     <HexViewer/>
        <DataInspector/>
    </Row>
  );
}